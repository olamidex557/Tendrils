import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { STORE_SUPPORT_EMAIL } from "@/lib/storefront/contact-info";

export type StorefrontRuntimeSettings = {
  storefrontLive: boolean;
  maintenanceMode: boolean;
  storeName: string;
  storeEmail: string | null;
  storePhone: string | null;
  supportEmail: string | null;
};

export const getStorefrontRuntimeSettings = cache(
  async (): Promise<StorefrontRuntimeSettings> => {
    const { data, error } = await supabaseAdmin
      .from("store_settings")
      .select(
        "store_name, store_email, store_phone, support_email, storefront_live, maintenance_mode"
      )
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to load storefront runtime settings: ${error.message}`);
    }

    return {
      storefrontLive: data?.storefront_live ?? true,
      maintenanceMode: data?.maintenance_mode ?? false,
      storeName: data?.store_name ?? "Ajike+",
      storeEmail: data?.store_email ?? STORE_SUPPORT_EMAIL,
      storePhone: data?.store_phone ?? "+234 703 904 1074",
      supportEmail: data?.support_email ?? STORE_SUPPORT_EMAIL,
    };
  }
);
