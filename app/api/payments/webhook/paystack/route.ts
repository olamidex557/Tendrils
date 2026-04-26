import crypto from "crypto";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import {
  sendAdminNewOrderEmail,
  sendCustomerOrderConfirmationEmail,
} from "@/lib/email/order-emails";

function isUuid(value: string | null | undefined) {
  if (!value || value === "null") return false;

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value.trim()
  );
}

async function deductStock(orderId: string) {
  const { data: items, error } = await supabaseAdmin
    .from("order_items")
    .select("product_id, variant_id, matrix_id, product_name, quantity")
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

async function sendOrderEmails(order: {
  id: string;
  order_number: string;
  shipping_name: string | null;
  shipping_email: string | null;
  shipping_address: string | null;
  total: number | null;
}) {
  if (!order.shipping_email) return;

  const { data: orderItems, error } = await supabaseAdmin
    .from("order_items")
    .select("product_name, quantity, unit_price, line_total")
    .eq("order_id", order.id);

  if (error) {
    console.error("ORDER EMAIL ITEMS ERROR:", error.message);
    return;
  }

  const emailData = {
    orderNumber: order.order_number,
    customerName: order.shipping_name ?? "Customer",
    customerEmail: order.shipping_email,
    total: Number(order.total ?? 0),
    address: order.shipping_address ?? "",
    items: (orderItems ?? []).map((item) => ({
      product_name: item.product_name,
      quantity: Number(item.quantity ?? 0),
      unit_price: Number(item.unit_price ?? 0),
      line_total: Number(item.line_total ?? 0),
    })),
  };

  await Promise.allSettled([
    sendCustomerOrderConfirmationEmail(emailData),
    sendAdminNewOrderEmail(emailData),
  ]);

  await supabaseAdmin
    .from("orders")
    .update({ confirmation_email_sent: true })
    .eq("id", order.id);
}

export async function POST(req: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY;

    if (!secret) {
      return NextResponse.json(
        { error: "PAYSTACK_SECRET_KEY is missing." },
        { status: 500 }
      );
    }

    const rawBody = await req.text();
    const signature = req.headers.get("x-paystack-signature");

    const hash = crypto
      .createHmac("sha512", secret)
      .update(rawBody)
      .digest("hex");

    if (!signature || hash !== signature) {
      return NextResponse.json({ error: "Invalid signature." }, { status: 401 });
    }

    const event = JSON.parse(rawBody);

    console.log("PAYSTACK WEBHOOK HIT:", event.event, event.data?.reference);

    if (event.event !== "charge.success") {
      return NextResponse.json({ received: true, ignored: true });
    }

    const reference = event.data?.reference;

    if (!reference) {
      return NextResponse.json(
        { error: "Missing payment reference." },
        { status: 400 }
      );
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        order_number,
        payment_status,
        stock_deducted,
        confirmation_email_sent,
        shipping_name,
        shipping_email,
        shipping_address,
        total
      `)
      .eq("order_number", reference)
      .maybeSingle();

    if (orderError) throw new Error(orderError.message);

    if (!order) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    if (order.payment_status === "paid") {
      if (!order.confirmation_email_sent) {
        await sendOrderEmails(order);
      }

      return NextResponse.json({ success: true, source: "already-paid" });
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
        amount: Number(event.data?.amount ?? 0) / 100,
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

    if (!order.confirmation_email_sent) {
      await sendOrderEmails(order);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PAYSTACK WEBHOOK ERROR:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Webhook processing failed.",
      },
      { status: 500 }
    );
  }
}