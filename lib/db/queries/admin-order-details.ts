import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type AdminOrderDetails = {
  id: string;
  orderNumber: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  shippingAddress: string | null;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  fulfillmentMethod: "delivery" | "pickup";
  currency: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  total: number;
  createdAt: string;
  items: {
    id: string;
    productName: string;
    productSlug: string | null;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
};

export const getAdminOrderById = cache(
  async (orderId: string): Promise<AdminOrderDetails | null> => {
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        order_number,
        shipping_name,
        shipping_email,
        shipping_phone,
        shipping_address,
        status,
        payment_status,
        fulfillment_status,
        currency,
        subtotal,
        shipping_fee,
        discount_amount,
        total,
        total_amount,
        created_at,
        order_items (
          id,
          product_name,
          product_slug,
          quantity,
          unit_price,
          line_total
        )
      `)
      .eq("id", orderId)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to load order: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      orderNumber: data.order_number,
      customerName: data.shipping_name ?? null,
      customerEmail: data.shipping_email ?? null,
      customerPhone: data.shipping_phone ?? null,
      shippingAddress: data.shipping_address ?? null,
      status: data.status ?? "pending",
      paymentStatus: data.payment_status ?? "pending",
      fulfillmentStatus: data.fulfillment_status ?? "unfulfilled",
      fulfillmentMethod:
        data.shipping_address === "Pickup" ? "pickup" : "delivery",
      currency: data.currency ?? "NGN",
      subtotal: Number(data.subtotal ?? 0),
      shippingFee: Number(data.shipping_fee ?? 0),
      discountAmount: Number(data.discount_amount ?? 0),
      total:
        data.total !== null && data.total !== undefined
          ? Number(data.total)
          : Number(data.total_amount ?? 0),
      createdAt: data.created_at,
      items: (data.order_items ?? []).map((item: any) => ({
        id: item.id,
        productName: item.product_name,
        productSlug: item.product_slug ?? null,
        quantity: Number(item.quantity ?? 0),
        unitPrice: Number(item.unit_price ?? 0),
        lineTotal: Number(item.line_total ?? 0),
      })),
    };
  }
);
