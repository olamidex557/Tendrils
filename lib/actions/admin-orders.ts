"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { sendOrderDeliveredEmail } from "@/lib/email/order-emails";

export async function markOrderAsFulfilled(orderId: string) {
    const { data: order, error: orderError } = await supabaseAdmin
        .from("orders")
        .select("id, order_number, shipping_name, shipping_email, fulfillment_status")
        .eq("id", orderId)
        .maybeSingle();

    if (orderError) {
        throw new Error(orderError.message);
    }

    if (!order) {
        throw new Error("Order not found.");
    }

    const { error: updateError } = await supabaseAdmin
        .from("orders")
        .update({
            status: "processing",
            fulfillment_status: "fulfilled",
            updated_at: new Date().toISOString(),
        })
        .eq("id", orderId);

    if (updateError) {
        throw new Error(updateError.message);
    }

    if (order.shipping_email && order.fulfillment_status !== "fulfilled") {
        await sendOrderDeliveredEmail({
            orderNumber: order.order_number,
            customerName: order.shipping_name ?? "Customer",
            customerEmail: order.shipping_email,
        });
    }

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
}