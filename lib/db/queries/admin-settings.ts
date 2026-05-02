import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type AdminStoreSettings = {
  id: string;
  storeName: string;
  storeEmail: string;
  storePhone: string;
  supportEmail: string;
  currency: string;
  locale: string;
  timezone: string;
  shippingFee: string;
  freeShippingThreshold: string;
  orderEmailNotifications: boolean;
  paymentEmailNotifications: boolean;
  marketingEmails: boolean;
  storefrontLive: boolean;
  maintenanceMode: boolean;
  updatedAt: string | null;
};

export const getAdminStoreSettings = cache(
  async (): Promise<AdminStoreSettings> => {
    const { data, error } = await supabaseAdmin
      .from("store_settings")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to load store settings: ${error.message}`);
    }

    if (!data) {
      return {
        id: "",
        storeName: "Ajike+",
        storeEmail: "info@ajikeplus.com",
        storePhone: "+234 703 904 1074",
        supportEmail: "support@ajikeplus.com",
        currency: "NGN",
        locale: "en-NG",
        timezone: "Africa/Lagos",
        shippingFee: "5000",
        freeShippingThreshold: "100000",
        orderEmailNotifications: true,
        paymentEmailNotifications: true,
        marketingEmails: false,
        storefrontLive: true,
        maintenanceMode: false,
        updatedAt: null,
      };
    }

    return {
      id: data.id,
      storeName: data.store_name ?? "Ajike+",
      storeEmail: data.store_email ?? "",
      storePhone: data.store_phone ?? "",
      supportEmail: data.support_email ?? "",
      currency: data.currency ?? "NGN",
      locale: data.locale ?? "en-NG",
      timezone: data.timezone ?? "Africa/Lagos",
      shippingFee: String(data.shipping_fee ?? 0),
      freeShippingThreshold: String(data.free_shipping_threshold ?? 0),
      orderEmailNotifications: Boolean(data.order_email_notifications),
      paymentEmailNotifications: Boolean(data.payment_email_notifications),
      marketingEmails: Boolean(data.marketing_emails),
      storefrontLive: Boolean(data.storefront_live),
      maintenanceMode: Boolean(data.maintenance_mode),
      updatedAt: data.updated_at ?? null,
    };
  }
);
