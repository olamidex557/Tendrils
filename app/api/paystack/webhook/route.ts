import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getStoreRuntimeState } from "@/lib/storefront/runtime";
import {
  extractClientIpFromHeaders,
  isAllowedPaystackWebhookIp,
  verifyPaystackSignature,
} from "@/lib/payments/paystack-security";

type PaystackWebhookEvent = {
  event?: string;
  data?: {
    status?: string;
    reference?: string;
    amount?: number;
    paid_at?: string | null;
    currency?: string | null;
    metadata?: Record<string, unknown> | null;
  };
};

function safeNumber(value: unknown, fallback = 0) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    if (!verifyPaystackSignature(rawBody, signature)) {
      return NextResponse.json(
        { error: "Invalid webhook signature." },
        { status: 401 }
      );
    }

    const ip = extractClientIpFromHeaders(req.headers);

    if (!isAllowedPaystackWebhookIp(ip)) {
      return NextResponse.json(
        { error: "Webhook IP not allowed." },
        { status: 401 }
      );
    }

    const payload = JSON.parse(rawBody) as PaystackWebhookEvent;

    if (payload.event !== "charge.success") {
      return NextResponse.json({ received: true });
    }

    const reference = payload.data?.reference?.trim();

    if (!reference) {
      return NextResponse.json(
        { error: "Missing payment reference." },
        { status: 400 }
      );
    }

    const settings = await getStoreRuntimeState();

    if (settings.maintenanceMode) {
      return NextResponse.json(
        { error: "Store is in maintenance mode." },
        { status: 423 }
      );
    }

    const { data: order, error: orderLookupError } = await supabaseAdmin
      .from("orders")
      .select("id, customer_id, payment_status")
      .eq("order_number", reference)
      .maybeSingle();

    if (orderLookupError) {
      return NextResponse.json(
        { error: orderLookupError.message },
        { status: 500 }
      );
    }

    if (!order) {
      return NextResponse.json(
        { error: "Order not found for webhook reference." },
        { status: 404 }
      );
    }

    const amount = safeNumber(payload.data?.amount, 0) / 100;
    const paidAt = payload.data?.paid_at ?? new Date().toISOString();
    const currency = payload.data?.currency ?? "NGN";
    const metadata = payload.data?.metadata ?? null;

    const { error: paymentUpsertError } = await supabaseAdmin
      .from("payments")
      .upsert(
        {
          order_id: order.id,
          customer_id: order.customer_id,
          provider: "paystack",
          reference,
          amount,
          currency,
          status: "success",
          paid_at: paidAt,
          metadata,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "reference" }
      );

    if (paymentUpsertError) {
      return NextResponse.json(
        { error: paymentUpsertError.message },
        { status: 500 }
      );
    }

    const orderWasAlreadyPaid = order.payment_status === "paid";

    if (!orderWasAlreadyPaid) {
      const { error: orderUpdateError } = await supabaseAdmin
        .from("orders")
        .update({
          payment_status: "paid",
          status: "processing",
          updated_at: new Date().toISOString(),
        })
        .eq("id", order.id);

      if (orderUpdateError) {
        return NextResponse.json(
          { error: orderUpdateError.message },
          { status: 500 }
        );
      }

      if (order.customer_id) {
        const { data: customer } = await supabaseAdmin
          .from("customers")
          .select("total_orders, total_spent")
          .eq("id", order.customer_id)
          .maybeSingle();

        const nextTotalOrders = safeNumber(customer?.total_orders, 0) + 1;
        const nextTotalSpent = safeNumber(customer?.total_spent, 0) + amount;

        await supabaseAdmin
          .from("customers")
          .update({
            total_orders: nextTotalOrders,
            total_spent: nextTotalSpent,
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.customer_id);
      }

      const { data: orderItems, error: orderItemsError } = await supabaseAdmin
        .from("order_items")
        .select("id, product_id, variant_id, quantity")
        .eq("order_id", order.id);

      if (orderItemsError) {
        return NextResponse.json(
          { error: orderItemsError.message },
          { status: 500 }
        );
      }

      for (const item of orderItems ?? []) {
        const quantity = safeNumber(item.quantity, 0);

        if (item.variant_id) {
          const { data: variant, error: variantLookupError } = await supabaseAdmin
            .from("product_variants")
            .select("id, product_id, stock_quantity, status")
            .eq("id", item.variant_id)
            .maybeSingle();

          if (variantLookupError) {
            return NextResponse.json(
              { error: variantLookupError.message },
              { status: 500 }
            );
          }

          if (variant) {
            const nextVariantStock = Math.max(
              0,
              safeNumber(variant.stock_quantity, 0) - quantity
            );

            const nextVariantStatus =
              nextVariantStock <= 0 ? "inactive" : variant.status ?? "active";

            const { error: variantUpdateError } = await supabaseAdmin
              .from("product_variants")
              .update({
                stock_quantity: nextVariantStock,
                status: nextVariantStatus,
              })
              .eq("id", variant.id);

            if (variantUpdateError) {
              return NextResponse.json(
                { error: variantUpdateError.message },
                { status: 500 }
              );
            }

            if (variant.product_id) {
              const { data: siblingVariants, error: siblingError } =
                await supabaseAdmin
                  .from("product_variants")
                  .select("stock_quantity")
                  .eq("product_id", variant.product_id);

              if (siblingError) {
                return NextResponse.json(
                  { error: siblingError.message },
                  { status: 500 }
                );
              }

              const totalVariantStock = (siblingVariants ?? []).reduce(
                (sum, row) => sum + safeNumber(row.stock_quantity, 0),
                0
              );

              const productStatus =
                totalVariantStock <= 0 ? "out_of_stock" : "published";

              const { error: productSyncError } = await supabaseAdmin
                .from("products")
                .update({
                  stock_quantity: totalVariantStock,
                  status: productStatus,
                  updated_at: new Date().toISOString(),
                })
                .eq("id", variant.product_id);

              if (productSyncError) {
                return NextResponse.json(
                  { error: productSyncError.message },
                  { status: 500 }
                );
              }
            }

            continue;
          }
        }

        if (item.product_id) {
          const { data: product, error: productLookupError } = await supabaseAdmin
            .from("products")
            .select("id, stock_quantity, status")
            .eq("id", item.product_id)
            .maybeSingle();

          if (productLookupError) {
            return NextResponse.json(
              { error: productLookupError.message },
              { status: 500 }
            );
          }

          if (!product) continue;

          const nextStock = Math.max(
            0,
            safeNumber(product.stock_quantity, 0) - quantity
          );

          const nextStatus =
            nextStock <= 0 ? "out_of_stock" : product.status ?? "published";

          const { error: productUpdateError } = await supabaseAdmin
            .from("products")
            .update({
              stock_quantity: nextStock,
              status: nextStatus,
              updated_at: new Date().toISOString(),
            })
            .eq("id", product.id);

          if (productUpdateError) {
            return NextResponse.json(
              { error: productUpdateError.message },
              { status: 500 }
            );
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Unexpected webhook error.",
      },
      { status: 500 }
    );
  }
}