import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const orderNumber = String(body.orderNumber ?? "").trim().toLowerCase();
    const email = String(body.email ?? "").trim().toLowerCase();

    if (!orderNumber) {
      return NextResponse.json(
        { error: "Order number is required." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        order_number,
        status,
        payment_status,
        fulfillment_status,
        fulfillment_method,
        currency,
        subtotal,
        shipping_fee,
        discount_amount,
        total,
        total_amount,
        shipping_name,
        shipping_email,
        shipping_phone,
        shipping_address,
        created_at,
        order_items (
          id,
          product_name,
          product_slug,
          unit_price,
          quantity,
          line_total
        )
      `)
      .eq("order_number", orderNumber)
      .ilike("shipping_email", email)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return NextResponse.json(
        { error: "No order found with those details." },
        { status: 404 }
      );
    }

    const order = {
      id: data.id,
      orderNumber: data.order_number,
      status: data.status ?? "pending",
      paymentStatus: data.payment_status ?? "pending",
      fulfillmentStatus: data.fulfillment_status ?? "unfulfilled",
      fulfillmentMethod: data.fulfillment_method ?? "delivery",
      currency: data.currency ?? "NGN",
      subtotal: Number(data.subtotal ?? 0),
      shippingFee: Number(data.shipping_fee ?? 0),
      discountAmount: Number(data.discount_amount ?? 0),
      totalAmount:
        data.total !== null && data.total !== undefined
          ? Number(data.total)
          : Number(data.total_amount ?? 0),
      shippingName: data.shipping_name ?? null,
      shippingEmail: data.shipping_email ?? null,
      shippingPhone: data.shipping_phone ?? null,
      shippingAddress: data.shipping_address ?? null,
      createdAt: data.created_at,
      items: (data.order_items ?? []).map((item: any) => ({
        id: item.id,
        productName: item.product_name,
        productSlug: item.product_slug ?? null,
        unitPrice: Number(item.unit_price ?? 0),
        quantity: Number(item.quantity ?? 0),
        lineTotal: Number(item.line_total ?? 0),
        variantLabel: null,
      })),
    };

    return NextResponse.json({ order });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to track order.",
      },
      { status: 500 }
    );
  }
}
