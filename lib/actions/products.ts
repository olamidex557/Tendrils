"use server";

import { revalidatePath } from "next/cache";
import { supabaseAdmin } from "@/lib/supabase/admin";

type ProductAttributeInput = {
  name: string;
  values: string[];
};

type ProductInventoryMatrixInput = {
  size: string;
  color: string;
  stock_quantity?: number | null;
  is_active?: boolean;
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
  inventoryMatrix?: ProductInventoryMatrixInput[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function normalizeSkuPart(value: string) {
  return value
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

function generateMatrixSku(params: {
  baseSku?: string | null;
  productName: string;
  size: string;
  color: string;
}) {
  const base =
    params.baseSku && params.baseSku.trim()
      ? normalizeSkuPart(params.baseSku)
      : normalizeSkuPart(params.productName);

  const sizePart = normalizeSkuPart(params.size);
  const colorPart = normalizeSkuPart(params.color);

  return `${base}-${sizePart}-${colorPart}`;
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

function getAttributeValues(
  attributes: ProductAttributeInput[] | undefined,
  attributeName: string
) {
  const match = (attributes ?? []).find(
    (attribute) => attribute.name.trim().toLowerCase() === attributeName.toLowerCase()
  );

  return match?.values ?? [];
}

function validateMatrixInput(input: ProductInput) {
  if (input.product_type !== "variable") return;

  const sizeValues = getAttributeValues(input.attributes, "Size");
  const colorValues = getAttributeValues(input.attributes, "Color");

  if (sizeValues.length === 0) {
    throw new Error("Matrix products must include a Size attribute.");
  }

  if (colorValues.length === 0) {
    throw new Error("Matrix products must include a Color attribute.");
  }

  if (!input.inventoryMatrix || input.inventoryMatrix.length === 0) {
    throw new Error("Matrix products must include inventory rows.");
  }

  const expectedKeys = new Set(
    sizeValues.flatMap((size) =>
      colorValues.map((color) => `${size}__${color}`)
    )
  );

  const receivedKeys = new Set(
    input.inventoryMatrix.map((row) => `${row.size}__${row.color}`)
  );

  for (const key of expectedKeys) {
    if (!receivedKeys.has(key)) {
      throw new Error("Inventory matrix is incomplete. Please fill all size and color combinations.");
    }
  }
}

async function insertProductAttributes(
  productId: string,
  attributes: ProductAttributeInput[] | undefined
) {
  if (!attributes?.length) return;

  const { error } = await supabaseAdmin.from("product_attributes").insert(
    attributes.map((attribute) => ({
      product_id: productId,
      name: attribute.name,
      values: attribute.values,
    }))
  );

  if (error) {
    throw new Error(error.message);
  }
}

async function insertInventoryMatrix(
  productId: string,
  input: ProductInput
) {
  if (input.product_type !== "variable") return;
  if (!input.inventoryMatrix?.length) return;

  const rows = input.inventoryMatrix.map((row) => ({
    product_id: productId,
    size_value: row.size,
    color_value: row.color,
    stock_quantity: row.stock_quantity ?? 0,
    sku: generateMatrixSku({
      baseSku: input.sku ?? null,
      productName: input.name,
      size: row.size,
      color: row.color,
    }),
    is_active: row.is_active ?? true,
  }));

  const { error } = await supabaseAdmin
    .from("product_inventory_matrix")
    .insert(rows);

  if (error) {
    throw new Error(error.message);
  }
}

export async function createProduct(input: ProductInput) {
  validateMatrixInput(input);

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
      stock_quantity: input.product_type === "simple" ? input.stock_quantity ?? null : null,
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

  if (input.product_type === "variable") {
    await insertProductAttributes(product.id, input.attributes);
    await insertInventoryMatrix(product.id, input);
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}

export async function updateProduct(productId: string, input: ProductInput) {
  validateMatrixInput(input);

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
      stock_quantity: input.product_type === "simple" ? input.stock_quantity ?? null : null,
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

  const { error: deleteAttributesError } = await supabaseAdmin
    .from("product_attributes")
    .delete()
    .eq("product_id", productId);

  if (deleteAttributesError) {
    throw new Error(deleteAttributesError.message);
  }

  const { error: deleteMatrixError } = await supabaseAdmin
    .from("product_inventory_matrix")
    .delete()
    .eq("product_id", productId);

  if (deleteMatrixError) {
    throw new Error(deleteMatrixError.message);
  }

  if (input.product_type === "variable") {
    await insertProductAttributes(productId, input.attributes);
    await insertInventoryMatrix(productId, input);
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
}