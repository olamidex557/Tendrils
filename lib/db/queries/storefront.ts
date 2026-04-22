import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export type StorefrontCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
};

export type StorefrontProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  imageUrl: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  price: number;
  comparePrice: number | null;
  stockQuantity: number;
  productType: "simple" | "variable";
  status: "published" | "draft" | "out_of_stock";
  isVisible: boolean;
  isFeatured: boolean;
  sortOrder: number;
};

export type StorefrontBanner = {
  id: string;
  title: string;
  subtitle: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  placement: string;
  status: "draft" | "active" | "scheduled";
  imageUrl: string | null;
  priority: number;
  scheduleText: string | null;
  startsAt: string | null;
  endsAt: string | null;
};

function fallbackCategoryImage(slug: string) {
  const map: Record<string, string> = {
    electronics:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80",
    fashion:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1600&q=80",
    sports:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1600&q=80",
    "home-essentials":
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    beauty:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80",
    grocery:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80",
    skincare:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1600&q=80",
  };

  return (
    map[slug] ??
    "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1600&q=80"
  );
}

function fallbackProductImage(categorySlug: string | null) {
  const map: Record<string, string> = {
    electronics:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80",
    fashion:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1600&q=80",
    sports:
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=1600&q=80",
    "home-essentials":
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80",
    beauty:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1600&q=80",
    grocery:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1600&q=80",
    skincare:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1600&q=80",
  };

  return (
    map[categorySlug ?? ""] ??
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1600&q=80"
  );
}

function fallbackBannerImage(placement: string) {
  const normalized = placement.toLowerCase();

  if (normalized.includes("hero")) {
    return "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1800&q=80";
  }

  if (normalized.includes("promo")) {
    return "https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&w=1800&q=80";
  }

  return "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1800&q=80";
}

function normalizeCategory(row: any): StorefrontCategory {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? null,
    imageUrl: row.image_url ?? fallbackCategoryImage(row.slug),
    isFeatured: Boolean(row.is_featured),
    isVisible: Boolean(row.is_visible),
    sortOrder: row.sort_order ?? 100,
  };
}

function normalizeProduct(row: any): StorefrontProduct {
  const activeMatrixRows = (row.product_inventory_matrix ?? []).filter(
    (entry: any) => Boolean(entry.is_active)
  );

  const matrixStockTotal = activeMatrixRows.reduce(
    (sum: number, entry: any) => sum + Number(entry.stock_quantity ?? 0),
    0
  );

  const basePrice =
    row.base_price !== null && row.base_price !== undefined
      ? Number(row.base_price)
      : row.price !== null && row.price !== undefined
      ? Number(row.price)
      : 0;

  const comparePrice =
    row.compare_price !== null && row.compare_price !== undefined
      ? Number(row.compare_price)
      : null;

  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.short_description ?? null,
    description: row.description ?? null,
    imageUrl:
      row.image_url ??
      fallbackProductImage(row.categories?.slug ?? row.category_slug ?? null),
    categoryName: row.categories?.name ?? null,
    categorySlug: row.categories?.slug ?? null,
    price: basePrice,
    comparePrice,
    stockQuantity:
      row.product_type === "variable"
        ? matrixStockTotal
        : Number(row.stock_quantity ?? 0),
    productType: row.product_type,
    status: row.status,
    isVisible: Boolean(row.is_visible),
    isFeatured: Boolean(row.is_featured),
    sortOrder: row.sort_order ?? 100,
  };
}

function normalizeBanner(row: any): StorefrontBanner {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? null,
    ctaText: row.cta_text ?? null,
    ctaLink: row.cta_link ?? null,
    placement: row.placement,
    status: row.status,
    imageUrl: row.image_url ?? fallbackBannerImage(row.placement),
    priority: row.priority ?? 1,
    scheduleText: row.schedule_text ?? null,
    startsAt: row.starts_at ?? null,
    endsAt: row.ends_at ?? null,
  };
}

export const getVisibleCategories = cache(
  async (): Promise<StorefrontCategory[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select(
        "id, name, slug, description, image_url, is_featured, is_visible, sort_order"
      )
      .eq("is_visible", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (error) {
      throw new Error(`Failed to load categories: ${error.message}`);
    }

    return (data ?? []).map(normalizeCategory);
  }
);

export const getFeaturedCategories = cache(
  async (): Promise<StorefrontCategory[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select(
        "id, name, slug, description, image_url, is_featured, is_visible, sort_order"
      )
      .eq("is_visible", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true })
      .limit(8);

    if (error) {
      throw new Error(`Failed to load featured categories: ${error.message}`);
    }

    return (data ?? []).map(normalizeCategory);
  }
);

export const getCategoryBySlug = cache(
  async (slug: string): Promise<StorefrontCategory | null> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("categories")
      .select(
        "id, name, slug, description, image_url, is_featured, is_visible, sort_order"
      )
      .eq("slug", slug)
      .eq("is_visible", true)
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to load category: ${error.message}`);
    }

    if (!data) return null;

    return normalizeCategory(data);
  }
);

export const getPublishedProducts = cache(
  async (): Promise<StorefrontProduct[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        slug,
        name,
        short_description,
        description,
        image_url,
        status,
        product_type,
        base_price,
        compare_price,
        price,
        stock_quantity,
        is_visible,
        is_featured,
        sort_order,
        categories (
          name,
          slug
        ),
        product_inventory_matrix (
          stock_quantity,
          is_active
        )
      `)
      .eq("status", "published")
      .eq("is_visible", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to load products: ${error.message}`);
    }

    return (data ?? []).map(normalizeProduct);
  }
);

export const getFeaturedProducts = cache(
  async (): Promise<StorefrontProduct[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        slug,
        name,
        short_description,
        description,
        image_url,
        status,
        product_type,
        base_price,
        compare_price,
        price,
        stock_quantity,
        is_visible,
        is_featured,
        sort_order,
        categories (
          name,
          slug
        ),
        product_inventory_matrix (
          stock_quantity,
          is_active
        )
      `)
      .eq("status", "published")
      .eq("is_visible", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false })
      .limit(8);

    if (error) {
      throw new Error(`Failed to load featured products: ${error.message}`);
    }

    return (data ?? []).map(normalizeProduct);
  }
);

export const getPublishedProductsByCategorySlug = cache(
  async (categorySlug: string): Promise<StorefrontProduct[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("products")
      .select(`
        id,
        slug,
        name,
        short_description,
        description,
        image_url,
        status,
        product_type,
        base_price,
        compare_price,
        price,
        stock_quantity,
        is_visible,
        is_featured,
        sort_order,
        categories!inner (
          name,
          slug
        ),
        product_inventory_matrix (
          stock_quantity,
          is_active
        )
      `)
      .eq("status", "published")
      .eq("is_visible", true)
      .eq("categories.slug", categorySlug)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to load category products: ${error.message}`);
    }

    return (data ?? []).map(normalizeProduct);
  }
);

export const getProductBySlug = cache(async (slug: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      name,
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
      is_visible,
      is_featured,
      sort_order,
      categories (
        id,
        name,
        slug
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
    .eq("slug", slug)
    .eq("status", "published")
    .eq("is_visible", true)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to load product: ${error.message}`);
  }

  if (!data) return null;

  return {
    ...normalizeProduct(data),
    sku: data.sku ?? null,
    attributes: (data.product_attributes ?? []).map((attribute: any) => ({
      id: attribute.id,
      name: attribute.name,
      values: Array.isArray(attribute.values) ? attribute.values : [],
    })),
    inventoryMatrix: (data.product_inventory_matrix ?? []).map((entry: any) => ({
      id: entry.id,
      size: entry.size_value ?? "",
      color: entry.color_value ?? "",
      stockQuantity: Number(entry.stock_quantity ?? 0),
      sku: entry.sku ?? null,
      isActive: Boolean(entry.is_active),
    })),
  };
});

export const getActiveBanners = cache(
  async (): Promise<StorefrontBanner[]> => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("banners")
      .select(`
        id,
        title,
        subtitle,
        cta_text,
        cta_link,
        placement,
        status,
        image_url,
        priority,
        schedule_text,
        starts_at,
        ends_at,
        created_at
      `)
      .in("status", ["active", "scheduled"])
      .order("priority", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(`Failed to load banners: ${error.message}`);
    }

    const now = new Date();

    return (data ?? [])
      .map(normalizeBanner)
      .filter((banner) => {
        const startsOk =
          !banner.startsAt ||
          new Date(banner.startsAt).getTime() <= now.getTime();

        const endsOk =
          !banner.endsAt ||
          new Date(banner.endsAt).getTime() >= now.getTime();

        return startsOk && endsOk;
      });
  }
);