import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("shipping_zones")
    .select("id, name, amount, is_active")
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    zones: (data ?? []).map((zone) => ({
      id: zone.id,
      name: zone.name,
      amount: Number(zone.amount ?? 0),
    })),
  });
}