"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

type BannerInput = {
  title: string;
  subtitle?: string;
  cta_text?: string;
  cta_link?: string;
  placement: string;
  status: string;
  image_url?: string;
  priority?: number;
  schedule_text?: string;
  starts_at?: string;
  ends_at?: string;
};

export async function createBanner(input: BannerInput) {
  const { error } = await supabaseAdmin.from("banners").insert({
    title: input.title,
    subtitle: input.subtitle || null,
    cta_text: input.cta_text || null,
    cta_link: input.cta_link || null,
    placement: input.placement,
    status: input.status.toLowerCase(),
    image_url: input.image_url || null,
    priority: input.priority ?? 1,
    schedule_text: input.schedule_text || null,
    starts_at: input.starts_at || null,
    ends_at: input.ends_at || null,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function updateBanner(bannerId: string, input: BannerInput) {
  const { error } = await supabaseAdmin
    .from("banners")
    .update({
      title: input.title,
      subtitle: input.subtitle || null,
      cta_text: input.cta_text || null,
      cta_link: input.cta_link || null,
      placement: input.placement,
      status: input.status.toLowerCase(),
      image_url: input.image_url || null,
      priority: input.priority ?? 1,
      schedule_text: input.schedule_text || null,
      starts_at: input.starts_at || null,
      ends_at: input.ends_at || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bannerId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function updateBannerStatus(
  bannerId: string,
  status: "active" | "draft" | "scheduled"
) {
  const { error } = await supabaseAdmin
    .from("banners")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", bannerId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function deleteBanner(bannerId: string) {
  const { error } = await supabaseAdmin
    .from("banners")
    .delete()
    .eq("id", bannerId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
}