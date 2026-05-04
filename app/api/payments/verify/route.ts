import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getStoreRuntimeState } from "@/lib/storefront/runtime";

function isUuid(value: string | null | undefined) {
  if (!value || value === "null") return false;

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value.trim()
  );
}

function toKobo(amount: number) {
  return Math.round(Number(amount || 0) * 100);
}

function isFailedPaystackStatus(status: string | null | undefined) {
  return [
    "abandoned",
    "cancelled",
    "canceled",
    "declined",
    "failed",
    "reversed",
  ].includes(String(status ?? "").toLowerCase());
}

async function deductStock(orderId: string) {
  const { data: items, error } = await supabaseAdmin
    .from("order_items")
    .select("product_id, matrix_id, product_name, quantity")
    .eq("order_id", orderId);

  if (error) throw new Error(error.message);

  for (const item of items ?? []) {
    const qty = Number(item.quantity ?? 0);
    if (qty <= 0) continue;

    if (isUuid(item.matrix_id)) {
      const { data: row, error: rowError } = await supabaseAdmin
        .from("product_inventory_matrix")
        .select("stock_quantity")
        .eq("id", item.matrix_id)
        .maybeSingle();

      if (rowError) throw new Error(rowError.message);

      const currentStock = Number(row?.stock_quantity ?? 0);

      if (currentStock < qty) {
        throw new Error(`${item.product_name} does not have enough stock.`);
      }

      const { error: updateError } = await supabaseAdmin
        .from("product_inventory_matrix")
        .update({ stock_quantity: currentStock - qty })
        .eq("id", item.matrix_id);

      if (updateError) throw new Error(updateError.message);
      continue;
    }

    if (isUuid(item.product_id)) {
      const { data: product, error: productError } = await supabaseAdmin
        .from("products")
        .select("stock_quantity")
        .eq("id", item.product_id)
        .maybeSingle();

      if (productError) throw new Error(productError.message);

      const currentStock = Number(product?.stock_quantity ?? 0);

      if (currentStock < qty) {
        throw new Error(`${item.product_name} does not have enough stock.`);
      }

      const { error: updateError } = await supabaseAdmin
        .from("products")
        .update({ stock_quantity: currentStock - qty })
        .eq("id", item.product_id);

      if (updateError) throw new Error(updateError.message);
    }
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get("reference");

    if (!reference) {
      return NextResponse.json(
        { error: "Missing payment reference." },
        { status: 400 }
      );
    }

    const settings = await getStoreRuntimeState();

    if (settings.maintenanceMode) {
      return NextResponse.json(
        { error: "Payment verification is paused during maintenance." },
        { status: 423 }
      );
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, payment_status, stock_deducted, total, total_amount")
      .eq("order_number", reference)
      .maybeSingle();

    if (orderError) throw new Error(orderError.message);

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (order.payment_status === "paid") {
      return NextResponse.json({ success: true, source: "database" });
    }

    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const verifyData = await verifyResponse.json();

    if (!verifyResponse.ok || !verifyData.status) {
      return NextResponse.json(
        { error: verifyData?.message || "Unable to verify payment." },
        { status: 400 }
      );
    }

    const paystackStatus = String(verifyData?.data?.status ?? "pending").toLowerCase();

    if (paystackStatus !== "success") {
      if (isFailedPaystackStatus(paystackStatus)) {
        await supabaseAdmin.from("payments").upsert(
          {
            order_id: order.id,
            reference,
            status: "failed",
            provider: "paystack",
            amount: Number(verifyData?.data?.amount ?? 0) / 100,
            paid_at: null,
            metadata: {
              paystack_status: paystackStatus,
              message: verifyData?.message ?? null,
            },
          },
          { onConflict: "reference" }
        );

        const { error: failedOrderError } = await supabaseAdmin
          .from("orders")
          .update({
            status: "failed",
            payment_status: "failed",
            fulfillment_status: "unfulfilled",
            updated_at: new Date().toISOString(),
          })
          .eq("id", order.id);

        if (failedOrderError) throw new Error(failedOrderError.message);
      }

      return NextResponse.json(
        {
          error:
            paystackStatus === "abandoned"
              ? "Payment was abandoned."
              : "Payment is not successful yet.",
          paystackStatus,
        },
        { status: 409 }
      );
    }

    const expectedAmount =
      order.total !== null && order.total !== undefined
        ? Number(order.total)
        : Number(order.total_amount ?? 0);

    const expectedKobo = toKobo(expectedAmount);
    const paidKobo = Number(verifyData?.data?.amount ?? 0);

    if (paidKobo !== expectedKobo) {
      await supabaseAdmin.from("payments").upsert(
        {
          order_id: order.id,
          reference,
          status: "amount_mismatch",
          provider: "paystack",
          amount: paidKobo / 100,
          paid_at: new Date().toISOString(),
        },
        { onConflict: "reference" }
      );

      return NextResponse.json(
        {
          error: "Payment amount does not match the order total.",
        },
        { status: 409 }
      );
    }

    if (!order.stock_deducted) {
      await deductStock(order.id);
    }

    const { error: paymentError } = await supabaseAdmin.from("payments").upsert(
      {
        order_id: order.id,
        reference,
        status: "success",
        provider: "paystack",
        amount: paidKobo / 100,
        paid_at: new Date().toISOString(),
      },
      { onConflict: "reference" }
    );

    if (paymentError) throw new Error(paymentError.message);

    const { error: updateOrderError } = await supabaseAdmin
      .from("orders")
      .update({
        status: "processing",
        payment_status: "paid",
        fulfillment_status: "processing",
        paid_at: new Date().toISOString(),
        stock_deducted: true,
      })
      .eq("id", order.id);

    if (updateOrderError) throw new Error(updateOrderError.message);

    return NextResponse.json({ success: true, source: "verify-api" });
  } catch (error) {
    console.error("PAYMENT VERIFY ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unexpected verification error.",
      },
      { status: 500 }
    );
  }
}
