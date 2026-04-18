"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { assertStorefrontAvailableForCheckout } from "@/lib/storefront/runtime";

type CheckoutInput = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  items: {
    id: string;
    name: string;
    slug: string;
    price: number;
    quantity: number;
  }[];
};

function generateOrderNumber() {
  return `AJK-${Date.now()}`;
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export async function createCheckoutSession(input: CheckoutInput) {
  await assertStorefrontAvailableForCheckout();

  if (!input.items.length) {
    throw new Error("Your cart is empty.");
  }

  if (!input.fullName.trim()) {
    throw new Error("Full name is required.");
  }

  if (!input.email.trim()) {
    throw new Error("Email is required.");
  }

  if (!input.phone.trim()) {
    throw new Error("Phone number is required.");
  }

  if (!input.address.trim()) {
    throw new Error("Address is required.");
  }

  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is missing.");
  }

  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    throw new Error("NEXT_PUBLIC_SITE_URL is missing.");
  }

  const orderNumber = generateOrderNumber();

  let customerId: string | null = null;

  const { data: existingCustomer, error: existingCustomerError } =
    await supabaseAdmin
      .from("customers")
      .select("id")
      .eq("email", input.email.trim())
      .maybeSingle();

  if (existingCustomerError) {
    throw new Error(existingCustomerError.message);
  }

  if (existingCustomer?.id) {
    customerId = existingCustomer.id;
  } else {
    const { data: newCustomer, error: newCustomerError } = await supabaseAdmin
      .from("customers")
      .insert({
        full_name: input.fullName.trim(),
        email: input.email.trim(),
        phone: input.phone.trim(),
        status: "active",
      })
      .select("id")
      .single();

    if (newCustomerError) {
      throw new Error(newCustomerError.message);
    }

    customerId = newCustomer.id;
  }

  const subtotal = input.items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const shippingFee = 0;
  const discountAmount = 0;
  const totalAmount = subtotal + shippingFee - discountAmount;

  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_id: customerId,
      status: "pending",
      payment_status: "pending",
      fulfillment_status: "unfulfilled",
      currency: "NGN",
      subtotal,
      shipping_fee: shippingFee,
      discount_amount: discountAmount,
      total: totalAmount,
      total_amount: totalAmount,
      shipping_name: input.fullName.trim(),
      shipping_email: input.email.trim(),
      shipping_phone: input.phone.trim(),
      shipping_address: input.address.trim(),
    })
    .select("id")
    .single();

  if (orderError) {
    throw new Error(orderError.message);
  }

  const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
    input.items.map((item) => ({
      order_id: order.id,
      product_id: isUuid(item.id) ? item.id : null,
      product_name: item.name,
      product_slug: item.slug,
      unit_price: Number(item.price),
      quantity: Number(item.quantity),
      line_total: Number(item.price) * Number(item.quantity),
    }))
  );

  if (itemsError) {
    throw new Error(itemsError.message);
  }

  const paystackResponse = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: input.email.trim(),
        amount: Math.round(totalAmount * 100),
        reference: orderNumber,
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/verify-payment?reference=${encodeURIComponent(orderNumber)}`,
        metadata: {
          order_number: orderNumber,
          customer_email: input.email.trim(),
        },
      }),
    }
  );

  const paystackData = await paystackResponse.json();

  console.log("Paystack initialize status:", paystackResponse.status);
  console.log("Paystack initialize response:", paystackData);

  if (!paystackResponse.ok || !paystackData.status) {
    throw new Error(paystackData?.message || "Failed to initialize payment.");
  }

  return {
    checkoutUrl: paystackData.data.authorization_url as string,
    reference: orderNumber,
  };
}