"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { headers } from "next/headers";

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

export async function createCheckoutSession(input: CheckoutInput) {
  const orderNumber = generateOrderNumber();

  // 1. Find or create customer
  let customerId: string | null = null;

  const { data: existingCustomer } = await supabaseAdmin
    .from("customers")
    .select("id")
    .eq("email", input.email)
    .maybeSingle();

  if (existingCustomer?.id) {
    customerId = existingCustomer.id;
  } else {
    const { data: newCustomer, error } = await supabaseAdmin
      .from("customers")
      .insert({
        full_name: input.fullName,
        email: input.email,
        phone: input.phone,
      })
      .select("id")
      .single();

    if (error) throw new Error(error.message);

    customerId = newCustomer.id;
  }

  // 2. Calculate total
  const subtotal = input.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const total = subtotal;

  // 3. Create order
  const { data: order, error: orderError } = await supabaseAdmin
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_id: customerId,
      subtotal,
      total_amount: total,
      shipping_name: input.fullName,
      shipping_email: input.email,
      shipping_phone: input.phone,
      shipping_address: input.address,
    })
    .select("id")
    .single();

  if (orderError) throw new Error(orderError.message);

  // 4. Insert order items
  const { error: itemsError } = await supabaseAdmin
    .from("order_items")
    .insert(
      input.items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        product_name: item.name,
        product_slug: item.slug,
        unit_price: item.price,
        quantity: item.quantity,
        line_total: item.price * item.quantity,
      }))
    );

  if (itemsError) throw new Error(itemsError.message);

  // 5. Initialize Paystack
  const res = await fetch("https://api.paystack.co/transaction/initialize", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: total * 100,
      reference: orderNumber,
      callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?ref=${orderNumber}`,
    }),
  });

  const data = await res.json();

  if (!data.status) {
    throw new Error("Failed to initialize payment");
  }

  return {
    checkoutUrl: data.data.authorization_url,
  };
}
