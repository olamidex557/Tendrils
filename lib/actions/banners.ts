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
};

export async function createBanner(input: BannerInput) {
  console.log("createBanner received:", input);

  const { data, error } = await supabaseAdmin
    .from("banners")
    .insert({
      title: input.title,
      subtitle: input.subtitle || null,
      cta_text: input.cta_text || null,
      cta_link: input.cta_link || null,
      placement: input.placement,
      status: input.status.toLowerCase(),
      image_url: input.image_url || null,
      priority: input.priority ?? 1,
      schedule_text: input.schedule_text || null,
    })
    .select();

  console.log("Supabase banner insert data:", data);
  console.log("Supabase banner insert error:", error);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/banners");
  revalidatePath("/");
}