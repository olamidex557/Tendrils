"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

type SettingsInput = {
  id?: string;
  storeName: string;
  storeEmail: string;
  storePhone: string;
  supportEmail: string;
  currency: string;
  locale: string;
  timezone: string;
  shippingFee: number;
  freeShippingThreshold: number;
  orderEmailNotifications: boolean;
  paymentEmailNotifications: boolean;
  marketingEmails: boolean;
  storefrontLive: boolean;
  maintenanceMode: boolean;
};

export async function saveStoreSettings(input: SettingsInput) {
  const payload = {
    store_name: input.storeName,
    store_email: input.storeEmail || null,
    store_phone: input.storePhone || null,
    support_email: input.supportEmail || null,
    currency: input.currency,
    locale: input.locale,
    timezone: input.timezone,
    shipping_fee: input.shippingFee,
    free_shipping_threshold: input.freeShippingThreshold,
    order_email_notifications: input.orderEmailNotifications,
    payment_email_notifications: input.paymentEmailNotifications,
    marketing_emails: input.marketingEmails,
    storefront_live: input.storefrontLive,
    maintenance_mode: input.maintenanceMode,
    updated_at: new Date().toISOString(),
  };

  if (input.id) {
    const { error } = await supabaseAdmin
      .from("store_settings")
      .update(payload)
      .eq("id", input.id);

    if (error) {
      throw new Error(error.message);
    }
  } else {
    const { error } = await supabaseAdmin
      .from("store_settings")
      .insert(payload);

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath("/admin/settings");
}
