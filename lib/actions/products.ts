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

export async function createProduct(input: ProductInput) {
  console.log("createProduct received:", input);

  let categoryId: string | null = null;

  const normalizedCategorySlug = slugify(input.category);

  const { data: categoryBySlug, error: categorySlugError } = await supabaseAdmin
    .from("categories")
    .select("id")
    .eq("slug", normalizedCategorySlug)
    .maybeSingle();

  if (categorySlugError) {
    throw new Error(categorySlugError.message);
  }

  if (categoryBySlug?.id) {
    categoryId = categoryBySlug.id;
  } else {
    const { data: categoryByName, error: categoryNameError } = await supabaseAdmin
      .from("categories")
      .select("id")
      .eq("name", input.category)
      .maybeSingle();

    if (categoryNameError) {
      throw new Error(categoryNameError.message);
    }

    categoryId = categoryByName?.id ?? null;
  }

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
    })
    .select("id, slug")
    .single();

  console.log("Supabase product insert data:", product);
  console.log("Supabase product insert error:", productError);

  if (productError) {
    throw new Error(productError.message);
  }

  if (input.product_type === "variable" && input.attributes?.length) {
    const { data: attributesData, error: attributesError } = await supabaseAdmin
      .from("product_attributes")
      .insert(
        input.attributes.map((attribute) => ({
          product_id: product.id,
          name: attribute.name,
          values: attribute.values,
        }))
      )
      .select();

    console.log("Supabase attribute insert data:", attributesData);
    console.log("Supabase attribute insert error:", attributesError);

    if (attributesError) {
      throw new Error(attributesError.message);
    }
  }

  if (input.product_type === "variable" && input.variants?.length) {
    const { data: variantsData, error: variantsError } = await supabaseAdmin
      .from("product_variants")
      .insert(
        input.variants.map((variant) => ({
          product_id: product.id,
          label: variant.label,
          sku: variant.sku ?? null,
          price: variant.price ?? null,
          stock_quantity: variant.stock_quantity ?? 0,
          status: variant.status,
        }))
      )
      .select();

    console.log("Supabase variant insert data:", variantsData);
    console.log("Supabase variant insert error:", variantsError);

    if (variantsError) {
      throw new Error(variantsError.message);
    }
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}