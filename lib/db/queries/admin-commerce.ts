import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type AdminOrderListItem = {
  id: string;
  orderNumber: string;
  customerName: string | null;
  customerEmail: string | null;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  totalAmount: number;
  currency: string;
  createdAt: string;
};

export type AdminCustomerListItem = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  status: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: string;
};

export type AdminPaymentListItem = {
  id: string;
  reference: string;
  provider: string;
  amount: number;
  currency: string;
  status: string;
  paidAt: string | null;
  createdAt: string;
  orderNumber: string | null;
  customerName: string | null;
};

export type AdminAnalyticsSnapshot = {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalPayments: number;
  paidOrders: number;
  pendingOrders: number;
  successfulPayments: number;
  failedPayments: number;
};

export const getAdminOrders = cache(async (): Promise<AdminOrderListItem[]> => {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(`
      id,
      order_number,
      status,
      payment_status,
      fulfillment_status,
      total_amount,
      currency,
      created_at,
      customers (
        full_name,
        email
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load admin orders: ${error.message}`);
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    orderNumber: row.order_number,
    customerName: row.customers?.full_name ?? null,
    customerEmail: row.customers?.email ?? null,
    status: row.status,
    paymentStatus: row.payment_status,
    fulfillmentStatus: row.fulfillment_status,
    totalAmount: Number(row.total_amount ?? 0),
    currency: row.currency ?? "NGN",
    createdAt: row.created_at,
  }));
});

export const getAdminCustomers = cache(async (): Promise<AdminCustomerListItem[]> => {
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select(`
      id,
      full_name,
      email,
      phone,
      status,
      total_orders,
      total_spent,
      created_at
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load admin customers: ${error.message}`);
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    fullName: row.full_name,
    email: row.email ?? null,
    phone: row.phone ?? null,
    status: row.status,
    totalOrders: Number(row.total_orders ?? 0),
    totalSpent: Number(row.total_spent ?? 0),
    createdAt: row.created_at,
  }));
});

export const getAdminPayments = cache(async (): Promise<AdminPaymentListItem[]> => {
  const { data, error } = await supabaseAdmin
    .from("payments")
    .select(`
      id,
      reference,
      provider,
      amount,
      currency,
      status,
      paid_at,
      created_at,
      orders (
        order_number
      ),
      customers (
        full_name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load admin payments: ${error.message}`);
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    reference: row.reference,
    provider: row.provider,
    amount: Number(row.amount ?? 0),
    currency: row.currency ?? "NGN",
    status: row.status,
    paidAt: row.paid_at ?? null,
    createdAt: row.created_at,
    orderNumber: row.orders?.order_number ?? null,
    customerName: row.customers?.full_name ?? null,
  }));
});

export const getAdminAnalyticsSnapshot = cache(
  async (): Promise<AdminAnalyticsSnapshot> => {
    const [
      { data: orders, error: ordersError },
      { data: customers, error: customersError },
      { data: payments, error: paymentsError },
    ] = await Promise.all([
      supabaseAdmin
        .from("orders")
        .select("id, total_amount, payment_status, status"),
      supabaseAdmin
        .from("customers")
        .select("id"),
      supabaseAdmin
        .from("payments")
        .select("id, status, amount"),
    ]);

    if (ordersError) {
      throw new Error(`Failed to load analytics orders: ${ordersError.message}`);
    }

    if (customersError) {
      throw new Error(`Failed to load analytics customers: ${customersError.message}`);
    }

    if (paymentsError) {
      throw new Error(`Failed to load analytics payments: ${paymentsError.message}`);
    }

    const safeOrders = orders ?? [];
    const safeCustomers = customers ?? [];
    const safePayments = payments ?? [];

    const totalRevenue = safeOrders.reduce(
      (sum: number, order: any) =>
        sum + Number(order.payment_status === "paid" ? order.total_amount ?? 0 : 0),
      0
    );

    return {
      totalRevenue,
      totalOrders: safeOrders.length,
      totalCustomers: safeCustomers.length,
      totalPayments: safePayments.length,
      paidOrders: safeOrders.filter((order: any) => order.payment_status === "paid").length,
      pendingOrders: safeOrders.filter((order: any) => order.status === "pending").length,
      successfulPayments: safePayments.filter((payment: any) => payment.status === "success").length,
      failedPayments: safePayments.filter((payment: any) => payment.status === "failed").length,
    };
  }
);
