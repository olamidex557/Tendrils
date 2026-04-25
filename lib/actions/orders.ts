"use server";

import { supabaseAdmin } from "@/lib/supabase/admin";

export async function markOrderAsPaid(orderId: string) {
  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status: "paid" })
    .eq("id", orderId);

  if (error) {
    throw new Error(error.message);
  }
}