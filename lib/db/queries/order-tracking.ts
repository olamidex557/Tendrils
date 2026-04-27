import { supabaseAdmin } from "@/lib/supabase/admin";

export type TrackedOrder = {
  orderNumber: string;
  customerName: string | null;
  paymentStatus: string;
  fulfillmentStatus: string;
  status: string;
  createdAt: string;
};

export async function getTrackedOrder(orderNumber: string) {
  const cleaned = orderNumber.trim();

  if (!cleaned) return null;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(`
      order_number,
      shipping_name,
      payment_status,
      fulfillment_status,
      status,
      created_at
    `)
    .eq("order_number", cleaned)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) return null;

  return {
    orderNumber: data.order_number,
    customerName: data.shipping_name ?? null,
    paymentStatus: data.payment_status ?? "pending",
    fulfillmentStatus: data.fulfillment_status ?? "unfulfilled",
    status: data.status ?? "pending",
    createdAt: data.created_at,
  };
}