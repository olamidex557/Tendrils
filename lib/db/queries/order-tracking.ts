import { supabaseAdmin } from "@/lib/supabase/admin";

export type TrackedOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  currency: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  shippingName: string | null;
  shippingEmail: string | null;
  shippingPhone: string | null;
  shippingAddress: string | null;
  createdAt: string;
  items: {
    id: string;
    productName: string;
    productSlug: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    variantLabel: string | null;
  }[];
};

export async function trackOrderByNumberAndEmail(input: {
  orderNumber: string;
  email: string;
}): Promise<TrackedOrder | null> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      order_number,
      status,
      payment_status,
      fulfillment_status,
      currency,
      subtotal,
      shipping_fee,
      discount_amount,
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
        line_total,
        variant_label
      )
    `)
    .eq("order_number", input.orderNumber.trim())
    .ilike("shipping_email", input.email.trim())
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to track order: ${error.message}`);
  }

  if (!data) {
    return null;
  }

  return {
    id: data.id,
    orderNumber: data.order_number,
    status: data.status,
    paymentStatus: data.payment_status,
    fulfillmentStatus: data.fulfillment_status,
    currency: data.currency ?? "NGN",
    subtotal: Number(data.subtotal ?? 0),
    shippingFee: Number(data.shipping_fee ?? 0),
    discountAmount: Number(data.discount_amount ?? 0),
    totalAmount: Number(data.total_amount ?? 0),
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
      variantLabel: item.variant_label ?? null,
    })),
  };
}
