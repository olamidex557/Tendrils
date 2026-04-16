"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

type CategoryInput = {
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  parent_category_id?: string | null;
  is_featured?: boolean;
  is_visible?: boolean;
  sort_order?: number;
};

export async function createCategory(input: CategoryInput) {
  const { error } = await supabaseAdmin.from("categories").insert({
    name: input.name,
    slug: input.slug,
    description: input.description || null,
    image_url: input.image_url || null,
    parent_category_id: input.parent_category_id || null,
    is_featured: input.is_featured ?? false,
    is_visible: input.is_visible ?? true,
    sort_order: input.sort_order ?? 100,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/");
}

export async function updateCategory(categoryId: string, input: CategoryInput) {
  const { error } = await supabaseAdmin
    .from("categories")
    .update({
      name: input.name,
      slug: input.slug,
      description: input.description || null,
      image_url: input.image_url || null,
      parent_category_id: input.parent_category_id || null,
      is_featured: input.is_featured ?? false,
      is_visible: input.is_visible ?? true,
      sort_order: input.sort_order ?? 100,
      updated_at: new Date().toISOString(),
    })
    .eq("id", categoryId);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/categories");
  revalidatePath("/");
}