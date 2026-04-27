import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type ShippingZone = {
  id: string;
  name: string;
  amount: string;
  isActive: boolean;
  sortOrder: number;
};

export const getShippingZones = cache(async (): Promise<ShippingZone[]> => {
  const { data, error } = await supabaseAdmin
    .from("shipping_zones")
    .select("id, name, amount, is_active, sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to load shipping zones: ${error.message}`);
  }

  return (data ?? []).map((zone: any) => ({
    id: zone.id,
    name: zone.name,
    amount: String(zone.amount ?? 0),
    isActive: Boolean(zone.is_active),
    sortOrder: Number(zone.sort_order ?? 100),
  }));
});