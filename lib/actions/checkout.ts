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
    productId?: string | null;
    variantId?: string | null;
    name: string;
    slug: string;
    price: number;
    quantity: number;
  }[];
};

function generateOrderNumber() {
  return `AJK-${Date.now()}`;
}

function isUuid(value: string | null | undefined) {
  if (!value) return false;

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

  for (const item of input.items) {
    if (item.variantId && isUuid(item.variantId)) {
      const { data: variant, error } = await supabaseAdmin
        .from("product_variants")
        .select("stock_quantity")
        .eq("id", item.variantId)
        .maybeSingle();

      if (error) {
        throw new Error(error.message);
      }

      const stock = Number(variant?.stock_quantity ?? 0);

      if (item.quantity > stock) {
        throw new Error(`${item.name} no longer has enough stock available.`);
      }
    } else {
      const productId = isUuid(item.productId)
        ? item.productId
        : isUuid(item.id)
        ? item.id
        : null;

      if (productId) {
        const { data: product, error } = await supabaseAdmin
          .from("products")
          .select("stock_quantity")
          .eq("id", productId)
          .maybeSingle();

        if (error) {
          throw new Error(error.message);
        }

        const stock = Number(product?.stock_quantity ?? 0);

        if (item.quantity > stock) {
          throw new Error(`${item.name} no longer has enough stock available.`);
        }
      }
    }
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
      product_id: isUuid(item.productId)
        ? item.productId
        : isUuid(item.id)
        ? item.id
        : null,
      variant_id: isUuid(item.variantId) ? item.variantId : null,
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
        callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/verify-payment?reference=${encodeURIComponent(
          orderNumber
        )}`,
        metadata: {
          order_number: orderNumber,
          customer_email: input.email.trim(),
        },
      }),
    }
  );

  const paystackData = await paystackResponse.json();

  if (!paystackResponse.ok || !paystackData.status) {
    throw new Error(paystackData?.message || "Failed to initialize payment.");
  }

  return {
    checkoutUrl: paystackData.data.authorization_url as string,
    reference: orderNumber,
  };
}