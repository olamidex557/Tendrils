import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type AdminOrderListItem = {
  id: string;
  orderNumber: string;
  customerName: string | null;
  customerEmail: string | null;
  total: number;
  currency: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  createdAt: string;
};

export type AdminCustomerListItem = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  status: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
};

export const getAdminOrders = cache(async (): Promise<AdminOrderListItem[]> => {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      order_number,
      shipping_name,
      shipping_email,
      total,
      total_amount,
      currency,
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
    currency: order.currency ?? "NGN",
    status: order.status ?? "pending",
    paymentStatus: order.payment_status ?? "pending",
    fulfillmentStatus: order.fulfillment_status ?? "unfulfilled",
    createdAt: order.created_at,
  }));
});

export const getAdminCustomers = cache(
  async (): Promise<AdminCustomerListItem[]> => {
    const { data, error } = await supabaseAdmin
      .from("customers")
      .select(`
        id,
        full_name,
        email,
        phone,
        status,
        created_at,
        orders (
          id,
          total,
          total_amount
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to load admin customers: ${error.message}`);
    }

    return (data ?? []).map((customer: any) => {
      const orders = customer.orders ?? [];

      return {
        id: customer.id,
        fullName: customer.full_name ?? "Unnamed Customer",
        email: customer.email ?? "No email",
        phone: customer.phone ?? null,
        status: customer.status ?? "active",
        totalOrders: orders.length,
        totalSpent: orders.reduce((sum: number, order: any) => {
          const total =
            order.total !== null && order.total !== undefined
              ? Number(order.total)
              : Number(order.total_amount ?? 0);

          return sum + total;
        }, 0),
        createdAt: customer.created_at,
      };
    });
  }
);