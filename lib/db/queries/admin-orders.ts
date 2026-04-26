import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type AdminOrderRecord = {
  id: string;
  orderNumber: string;
  customerName: string | null;
  customerEmail: string | null;
  total: number;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
};

export const getAdminOrders = cache(async (): Promise<AdminOrderRecord[]> => {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      order_number,
      shipping_name,
      shipping_email,
      total,
      total_amount,
      status,
      payment_status,
      fulfillment_status,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load admin orders: ${error.message}`);
  }

  return (data ?? []).map((order: any) => ({
    id: order.id,
    orderNumber: order.order_number,
    customerName: order.shipping_name ?? null,
    customerEmail: order.shipping_email ?? null,
    total:
      order.total !== null && order.total !== undefined
        ? Number(order.total)
        : Number(order.total_amount ?? 0),
    status: order.status ?? "pending",
    paymentStatus: order.payment_status ?? "pending",
    fulfillmentStatus: order.fulfillment_status ?? "unfulfilled",
    createdAt: order.created_at,
  }));
});