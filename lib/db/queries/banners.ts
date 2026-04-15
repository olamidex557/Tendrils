import { createClient } from "@/lib/supabase/server";

export async function getActiveBanners() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .in("status", ["active", "scheduled"])
    .order("priority", { ascending: true });

  if (error) throw error;
  return data;
}