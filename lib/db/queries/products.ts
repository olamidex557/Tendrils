"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

type ProductAttributeInput = {
  name: string;
  values: string[];
};

type ProductVariantInput = {
  label: string;
  sku?: string | null;
  price?: number | null;
  stock_quantity?: number | null;
  status: "active" | "inactive";
};

type ProductInput = {
  name: string;
  category: string;
  short_description?: string;
  description?: string;
  image_url?: string;
  status: "published" | "draft" | "out_of_stock";
  product_type: "simple" | "variable";
  base_price?: number | null;
  compare_price?: number | null;
  stock_quantity?: number | null;
  sku?: string | null;
  is_featured?: boolean;
  is_visible?: boolean;
  sort_order?: number;
  attributes?: ProductAttributeInput[];
  variants?: ProductVariantInput[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

async function resolveCategoryId(category: string) {
  const normalizedCategorySlug = slugify(category);

  const { data: categoryBySlug, error: categorySlugError } = await supabaseAdmin
    .from("categories")
    .select("id")
    .eq("slug", normalizedCategorySlug)
    .maybeSingle();

  if (categorySlugError) {
    throw new Error(categorySlugError.message);
  }

  if (categoryBySlug?.id) {
    return categoryBySlug.id;
  }

  const { data: categoryByName, error: categoryNameError } = await supabaseAdmin
    .from("categories")
    .select("id")
    .eq("name", category)
    .maybeSingle();

  if (categoryNameError) {
    throw new Error(categoryNameError.message);
  }

  return categoryByName?.id ?? null;
}

export async function createProduct(input: ProductInput) {
  const categoryId = await resolveCategoryId(input.category);
  const productSlug = slugify(input.name);

  const { data: product, error: productError } = await supabaseAdmin
    .from("products")
    .insert({
      name: input.name,
      slug: productSlug,
      short_description: input.short_description || null,
      description: input.description || null,
      category_id: categoryId,
      image_url: input.image_url || null,
      status: input.status,
      product_type: input.product_type,
      price: input.base_price ?? null,
      base_price: input.base_price ?? null,
      compare_price: input.compare_price ?? null,
      stock_quantity: input.stock_quantity ?? null,
      sku: input.sku ?? null,
      is_featured: input.is_featured ?? false,
      is_visible: input.is_visible ?? true,
      sort_order: input.sort_order ?? 100,
    })
    .select("id, slug")
    .single();

  if (productError) {
    throw new Error(productError.message);
  }

  if (input.product_type === "variable" && input.attributes?.length) {
    const { error } = await supabaseAdmin.from("product_attributes").insert(
      input.attributes.map((attribute) => ({
        product_id: product.id,
        name: attribute.name,
        values: attribute.values,
      }))
    );

    if (error) {
      throw new Error(error.message);
    }
  }

  if (input.product_type === "variable" && input.variants?.length) {
    const { error } = await supabaseAdmin.from("product_variants").insert(
      input.variants.map((variant) => ({
        product_id: product.id,
        label: variant.label,
        sku: variant.sku ?? null,
        price: variant.price ?? null,
        stock_quantity: variant.stock_quantity ?? 0,
        status: variant.status,
      }))
    );

    if (error) {
      throw new Error(error.message);
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function updateProduct(productId: string, input: ProductInput) {
  const categoryId = await resolveCategoryId(input.category);

  const { error: productError } = await supabaseAdmin
    .from("products")
    .update({
      name: input.name,
      slug: slugify(input.name),
      short_description: input.short_description || null,
      description: input.description || null,
      category_id: categoryId,
      image_url: input.image_url || null,
      status: input.status,
      product_type: input.product_type,
      price: input.base_price ?? null,
      base_price: input.base_price ?? null,
      compare_price: input.compare_price ?? null,
      stock_quantity: input.stock_quantity ?? null,
      sku: input.sku ?? null,
      is_featured: input.is_featured ?? false,
      is_visible: input.is_visible ?? true,
      sort_order: input.sort_order ?? 100,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId);

  if (productError) {
    throw new Error(productError.message);
  }

  if (input.product_type === "variable") {
    await supabaseAdmin.from("product_attributes").delete().eq("product_id", productId);
    await supabaseAdmin.from("product_variants").delete().eq("product_id", productId);

    if (input.attributes?.length) {
      const { error } = await supabaseAdmin.from("product_attributes").insert(
        input.attributes.map((attribute) => ({
          product_id: productId,
          name: attribute.name,
          values: attribute.values,
        }))
      );

      if (error) {
        throw new Error(error.message);
      }
    }

    if (input.variants?.length) {
      const { error } = await supabaseAdmin.from("product_variants").insert(
        input.variants.map((variant) => ({
          product_id: productId,
          label: variant.label,
          sku: variant.sku ?? null,
          price: variant.price ?? null,
          stock_quantity: variant.stock_quantity ?? 0,
          status: variant.status,
        }))
      );

      if (error) {
        throw new Error(error.message);
      }
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}