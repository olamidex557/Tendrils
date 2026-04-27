"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";
import { assertStorefrontAvailableForCheckout } from "@/lib/storefront/runtime";

type CheckoutInput = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  shippingZoneId?: string | null;
  shippingZoneName?: string | null;
  shippingFee?: number;
  items: {
    id: string;
    productId?: string | null;
    variantId?: string | null;
    sku?: string | null;
    name: string;
    slug: string;
    price: number;
    quantity: number;
    image?: string | null;
    category?: string | null;
    selectedOptions?: Record<string, string> | null;
  }[];
};

function generateOrderNumber() {
  return `AJK-${Date.now()}`;
}

function isUuid(value: string | null | undefined) {
  if (!value) return false;

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
    value.trim()
  );
}

export async function createCheckoutSession(input: CheckoutInput) {
  await assertStorefrontAvailableForCheckout();

  if (!input.items.length) throw new Error("Your cart is empty.");
  if (!input.fullName.trim()) throw new Error("Full name is required.");
  if (!input.email.trim()) throw new Error("Email is required.");
  if (!input.phone.trim()) throw new Error("Phone number is required.");
  if (!input.address.trim()) throw new Error("Address is required.");
  if (!process.env.PAYSTACK_SECRET_KEY) {
    throw new Error("PAYSTACK_SECRET_KEY is missing.");
  }
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    throw new Error("NEXT_PUBLIC_SITE_URL is missing.");
  }

  let verifiedShippingFee = Number(input.shippingFee ?? 0);
  let verifiedShippingZoneName = input.shippingZoneName?.trim() || null;

  if (input.shippingZoneId && isUuid(input.shippingZoneId)) {
    const { data: zone, error: zoneError } = await supabaseAdmin
      .from("shipping_zones")
      .select("name, amount, is_active")
      .eq("id", input.shippingZoneId)
      .maybeSingle();

    if (zoneError) throw new Error(zoneError.message);

    if (!zone || !zone.is_active) {
      throw new Error("Selected delivery area is unavailable.");
    }

    verifiedShippingFee = Number(zone.amount ?? 0);
    verifiedShippingZoneName = zone.name;
  }

  for (const item of input.items) {
    if (item.variantId && isUuid(item.variantId)) {
      const { data: matrixRow, error: matrixError } = await supabaseAdmin
        .from("product_inventory_matrix")
        .select("stock_quantity, is_active")
        .eq("id", item.variantId)
        .maybeSingle();

      if (matrixError) throw new Error(matrixError.message);

      if (matrixRow) {
        const stock = Number(matrixRow.stock_quantity ?? 0);

        if (!matrixRow.is_active || item.quantity > stock) {
          throw new Error(`${item.name} no longer has enough stock available.`);
        }

        continue;
      }
    }

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

      if (error) throw new Error(error.message);

      const stock = Number(product?.stock_quantity ?? 0);

      if (item.quantity > stock) {
        throw new Error(`${item.name} no longer has enough stock available.`);
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

  if (existingCustomerError) throw new Error(existingCustomerError.message);

  if (existingCustomer?.id) {
    customerId = existingCustomer.id;

    await supabaseAdmin
      .from("customers")
      .update({
        full_name: input.fullName.trim(),
        phone: input.phone.trim(),
      })
      .eq("id", customerId);
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

    if (newCustomerError) throw new Error(newCustomerError.message);

    customerId = newCustomer.id;
  }

  const subtotal = input.items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const shippingFee = verifiedShippingFee;
  const discountAmount = 0;
  const totalAmount = subtotal + shippingFee - discountAmount;

  const shippingAddress = verifiedShippingZoneName
    ? `${input.address.trim()}\n\nDelivery Area: ${verifiedShippingZoneName}`
    : input.address.trim();

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
      shipping_address: shippingAddress,
    })
    .select("id")
    .single();

  if (orderError) throw new Error(orderError.message);

  const { error: itemsError } = await supabaseAdmin.from("order_items").insert(
    input.items.map((item) => ({
      order_id: order.id,
      product_id: isUuid(item.productId)
        ? item.productId
        : isUuid(item.id)
          ? item.id
          : null,
      variant_id: null,
      matrix_id: isUuid(item.variantId) ? item.variantId : null,
      product_name: item.name,
      product_slug: item.slug,
      unit_price: Number(item.price),
      quantity: Number(item.quantity),
      line_total: Number(item.price) * Number(item.quantity),
      image: item.image ?? null,
      sku: item.sku ?? null,
      selected_options: item.selectedOptions ?? null,
    }))
  );

  if (itemsError) throw new Error(itemsError.message);

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
          order_id: order.id,
          order_number: orderNumber,
          customer_email: input.email.trim(),
          shipping_zone_id: input.shippingZoneId ?? null,
          shipping_zone_name: verifiedShippingZoneName,
          shipping_fee: shippingFee,
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