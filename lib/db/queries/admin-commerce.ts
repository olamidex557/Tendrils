import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isStalePendingPayment } from "@/lib/payments/admin-status";

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

export type AdminPaymentListItem = {
  id: string;
  reference: string;
  provider: string | null;
  status: string;
  amount: number;
  currency: string;
  orderNumber: string | null;
  customerName: string | null;
  customerEmail: string | null;
  paystackStatus: string | null;
  paidAt: string | null;
  createdAt: string | null;
};

export const getAdminPayments = cache(
  async (): Promise<AdminPaymentListItem[]> => {
    const { data, error } = await supabaseAdmin
      .from("payments")
      .select(`
        id,
        reference,
        provider,
        status,
        amount,
        metadata,
        paid_at,
        created_at,
        orders (
          order_number,
          currency,
          shipping_name,
          shipping_email
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to load admin payments: ${error.message}`);
    }

    return (data ?? []).map((payment: any) => ({
      id: payment.id,
      reference: payment.reference,
      provider: payment.provider ?? "paystack",
      status: payment.status ?? "pending",
      amount: Number(payment.amount ?? 0),
      currency: payment.orders?.currency ?? "NGN",
      orderNumber: payment.orders?.order_number ?? null,
      customerName: payment.orders?.shipping_name ?? null,
      customerEmail: payment.orders?.shipping_email ?? null,
      paystackStatus:
        typeof payment.metadata?.paystack_status === "string"
          ? payment.metadata.paystack_status
          : null,
      paidAt: payment.paid_at ?? null,
      createdAt: payment.created_at ?? null,
    }));
  }
);

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

export type AdminAnalyticsSnapshot = {
  totalRevenue: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  abandonedPayments: number;
  fulfilledOrders: number;
  averageOrderValue: number;
  totalCustomers: number;
  totalProducts: number;

  totalPayments: number;
  successfulPayments: number;
  failedPayments: number;

  recentRevenue: {
    label: string;
    revenue: number;
  }[];
};

export const getAdminAnalyticsSnapshot = cache(
  async (): Promise<AdminAnalyticsSnapshot> => {
    const [ordersResult, customersResult, productsResult] = await Promise.all([
      supabaseAdmin
        .from("orders")
        .select("id, total, total_amount, payment_status, fulfillment_status, created_at"),

      supabaseAdmin
        .from("customers")
        .select("id", { count: "exact", head: true }),

      supabaseAdmin
        .from("products")
        .select("id", { count: "exact", head: true }),
    ]);

    if (ordersResult.error) {
      throw new Error(`Failed to load analytics orders: ${ordersResult.error.message}`);
    }

    if (customersResult.error) {
      throw new Error(`Failed to load analytics customers: ${customersResult.error.message}`);
    }

    if (productsResult.error) {
      throw new Error(`Failed to load analytics products: ${productsResult.error.message}`);
    }

    const orders = ordersResult.data ?? [];
    const paidOrders = orders.filter((order: any) => order.payment_status === "paid");

    const totalRevenue = paidOrders.reduce((sum: number, order: any) => {
      const total =
        order.total !== null && order.total !== undefined
          ? Number(order.total)
          : Number(order.total_amount ?? 0);

      return sum + total;
    }, 0);

    const recentRevenue = Array.from({ length: 7 }).map((_, index) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - index));

      const label = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      const revenue = paidOrders
        .filter((order: any) => {
          const orderDate = new Date(order.created_at);
          return orderDate.toDateString() === date.toDateString();
        })
        .reduce((sum: number, order: any) => {
          const total =
            order.total !== null && order.total !== undefined
              ? Number(order.total)
              : Number(order.total_amount ?? 0);

          return sum + total;
        }, 0);

      return { label, revenue };
    });

    return {
  totalRevenue,
  totalOrders: orders.length,
  paidOrders: paidOrders.length,
  pendingOrders: orders.filter(
    (order: any) =>
      order.payment_status === "pending" &&
      !isStalePendingPayment(order.payment_status, order.created_at)
  ).length,
  abandonedPayments: orders.filter((order: any) =>
    isStalePendingPayment(order.payment_status, order.created_at)
  ).length,
  fulfilledOrders: orders.filter(
    (order: any) => order.fulfillment_status === "fulfilled"
  ).length,

  totalCustomers: customersResult.count ?? 0,
  totalProducts: productsResult.count ?? 0,
  averageOrderValue: paidOrders.length > 0 ? totalRevenue / paidOrders.length : 0,

  totalPayments: paidOrders.length,
  successfulPayments: paidOrders.length,
  failedPayments: orders.filter(
    (order: any) => order.payment_status === "failed"
  ).length,

  recentRevenue,
};
  }
);
