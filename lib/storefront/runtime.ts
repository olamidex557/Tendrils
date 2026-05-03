import { supabaseAdmin } from "@/lib/supabase/admin";
import { STORE_SUPPORT_EMAIL } from "@/lib/storefront/contact-info";

export type StoreRuntimeState = {
  storefrontLive: boolean;
  maintenanceMode: boolean;
  storeName: string;
  supportEmail: string | null;
};

export async function getStoreRuntimeState(): Promise<StoreRuntimeState> {
  const { data, error } = await supabaseAdmin
    .from("store_settings")
    .select("store_name, support_email, storefront_live, maintenance_mode")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load runtime store settings: ${error.message}`);
  }

  return {
    storefrontLive: data?.storefront_live ?? true,
    maintenanceMode: data?.maintenance_mode ?? false,
    storeName: data?.store_name ?? "Ajike+",
    supportEmail: data?.support_email ?? STORE_SUPPORT_EMAIL,
  };
}

export async function assertStorefrontAvailableForCheckout() {
  const settings = await getStoreRuntimeState();

  if (settings.maintenanceMode) {
    throw new Error(
      "Checkout is temporarily unavailable because the storefront is in maintenance mode."
    );
  }

  if (!settings.storefrontLive) {
    throw new Error(
      "Checkout is currently unavailable because the storefront is offline."
    );
  }

  return settings;
}
