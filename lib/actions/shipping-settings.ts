"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

type ShippingZoneInput = {
  id?: string;
  name: string;
  amount: number;
  isActive: boolean;
  sortOrder: number;
};

export async function saveShippingZones(zones: ShippingZoneInput[]) {
  const cleaned = zones
    .map((zone) => ({
      id: zone.id,
      name: zone.name.trim(),
      amount: Number(zone.amount || 0),
      is_active: zone.isActive,
      sort_order: Number(zone.sortOrder || 100),
      updated_at: new Date().toISOString(),
    }))
    .filter((zone) => zone.name);

  const { error } = await supabaseAdmin
    .from("shipping_zones")
    .upsert(cleaned, { onConflict: "id" });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/settings");
}

export async function deleteShippingZone(id: string) {
  const { error } = await supabaseAdmin
    .from("shipping_zones")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/settings");
}