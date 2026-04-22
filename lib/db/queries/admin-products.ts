import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type AdminEditProductRecord = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  description: string | null;
  imageUrl: string | null;
  status: "published" | "draft" | "out_of_stock";
  productType: "simple" | "variable";
  basePrice: number | null;
  comparePrice: number | null;
  stockQuantity: number | null;
  sku: string | null;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
  categoryName: string | null;
  attributes: {
    id: string;
    name: string;
    values: string[];
  }[];
  inventoryMatrix: {
    id: string;
    size: string;
    color: string;
    stockQuantity: number;
    sku: string;
    isActive: boolean;
  }[];
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

function normalizeProduct(data: any): AdminEditProductRecord {
  const resolvedBasePrice =
    data.base_price !== null && data.base_price !== undefined
      ? Number(data.base_price)
      : data.price !== null && data.price !== undefined
      ? Number(data.price)
      : null;

  return {
    id: data.id,
    name: data.name,
    slug: data.slug,
    shortDescription: data.short_description ?? null,
    description: data.description ?? null,
    imageUrl: data.image_url ?? null,
    status: data.status,
    productType: data.product_type,
    basePrice: resolvedBasePrice,
    comparePrice:
      data.compare_price !== null && data.compare_price !== undefined
        ? Number(data.compare_price)
        : null,
    stockQuantity:
      data.stock_quantity !== null && data.stock_quantity !== undefined
        ? Number(data.stock_quantity)
        : null,
    sku: data.sku ?? null,
    isFeatured: Boolean(data.is_featured),
    isVisible: Boolean(data.is_visible),
    sortOrder: data.sort_order ?? 100,
    categoryName: data.categories?.name ?? null,
    attributes: (data.product_attributes ?? []).map((attribute: any) => ({
      id: attribute.id,
      name: attribute.name,
      values: Array.isArray(attribute.values) ? attribute.values : [],
    })),
    inventoryMatrix: (data.product_inventory_matrix ?? []).map((row: any) => ({
      id: row.id,
      size: row.size_value ?? "",
      color: row.color_value ?? "",
      stockQuantity: Number(row.stock_quantity ?? 0),
      sku: row.sku ?? "",
      isActive: Boolean(row.is_active),
    })),
  };
}

async function fetchProductByField(field: "id" | "slug" | "sku", value: string) {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select(`
      id,
      name,
      slug,
      short_description,
      description,
      image_url,
      status,
      product_type,
      base_price,
      compare_price,
      price,
      stock_quantity,
      sku,
      is_featured,
      is_visible,
      sort_order,
      categories (
        name
      ),
      product_attributes (
        id,
        name,
        values
      ),
      product_inventory_matrix (
        id,
        size_value,
        color_value,
        stock_quantity,
        sku,
        is_active
      )
    `)
    .eq(field, value)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load admin product: ${error.message}`);
  }

  return data;
}

export const getAdminProductById = cache(
  async (productIdentifier: string): Promise<AdminEditProductRecord | null> => {
    if (!productIdentifier?.trim()) {
      return null;
    }

    let data: any = null;

    if (isUuid(productIdentifier)) {
      data = await fetchProductByField("id", productIdentifier);
    }

    if (!data) {
      data = await fetchProductByField("slug", productIdentifier);
    }

    if (!data) {
      data = await fetchProductByField("sku", productIdentifier);
    }

    if (!data) {
      return null;
    }

    return normalizeProduct(data);
  }
);