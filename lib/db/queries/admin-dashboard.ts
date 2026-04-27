import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type AdminProductListItem = {
  id: string;
  name: string;
  slug: string;
  categoryName: string | null;
  status: "published" | "draft" | "out_of_stock";
  productType: "simple" | "variable";
  imageUrl: string | null;
  price: number | null;
  stockQuantity: number | null;
  isVisible: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
};

export type AdminCategoryListItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  isVisible: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
};

export type AdminBannerListItem = {
  id: string;
  title: string;
  subtitle: string | null;
  placement: string;
  status: "draft" | "active" | "scheduled";
  imageUrl: string | null;
  priority: number;
  createdAt: string;
};

function fallbackImage() {
  return "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1200&q=80";
}

export async function getAdminDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    productsResult,
    visibleProductsResult,
    categoriesResult,
    ordersResult,
    todayOrdersResult,
    paidOrdersResult,
    pendingOrdersResult,
    completedOrdersResult,
    recentOrdersResult,
  ] = await Promise.all([
    supabaseAdmin.from("products").select("id", { count: "exact", head: true }),

    supabaseAdmin
      .from("products")
      .select("id", { count: "exact", head: true })
      .eq("is_visible", true),

    supabaseAdmin
      .from("categories")
      .select("id", { count: "exact", head: true })
      .eq("is_visible", true),

    supabaseAdmin
      .from("orders")
      .select("id, total, total_amount, payment_status, created_at"),

    supabaseAdmin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .gte("created_at", today.toISOString()),

    supabaseAdmin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("payment_status", "paid"),

    supabaseAdmin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("payment_status", "pending"),

    supabaseAdmin
      .from("orders")
      .select("id", { count: "exact", head: true })
      .eq("fulfillment_status", "fulfilled"),

    supabaseAdmin
      .from("orders")
      .select(`
        id,
        order_number,
        shipping_name,
        total,
        total_amount,
        payment_status,
        created_at
      `)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const results = [
    productsResult,
    visibleProductsResult,
    categoriesResult,
    ordersResult,
    todayOrdersResult,
    paidOrdersResult,
    pendingOrdersResult,
    completedOrdersResult,
    recentOrdersResult,
  ];

  for (const result of results) {
    if (result.error) throw new Error(result.error.message);
  }

  const orders = ordersResult.data ?? [];

  const totalRevenue = orders
    .filter((order: any) => order.payment_status === "paid")
    .reduce((sum: number, order: any) => {
      const total =
        order.total !== null && order.total !== undefined
          ? Number(order.total)
          : Number(order.total_amount ?? 0);

      return sum + total;
    }, 0);

  const todayRevenue = orders
    .filter((order: any) => {
      return (
        order.payment_status === "paid" &&
        new Date(order.created_at).getTime() >= today.getTime()
      );
    })
    .reduce((sum: number, order: any) => {
      const total =
        order.total !== null && order.total !== undefined
          ? Number(order.total)
          : Number(order.total_amount ?? 0);

      return sum + total;
    }, 0);

  return {
    totalProducts: productsResult.count ?? 0,
    visibleProducts: visibleProductsResult.count ?? 0,
    activeCategories: categoriesResult.count ?? 0,
    totalOrders: orders.length,
    todayOrders: todayOrdersResult.count ?? 0,
    paidOrders: paidOrdersResult.count ?? 0,
    pendingOrders: pendingOrdersResult.count ?? 0,
    completedOrders: completedOrdersResult.count ?? 0,
    totalRevenue,
    todayRevenue,
    lowStockProducts: 0,
    recentOrders: (recentOrdersResult.data ?? []).map((order: any) => ({
      id: order.id,
      orderNumber: order.order_number,
      customerName: order.shipping_name ?? null,
      total:
        order.total !== null && order.total !== undefined
          ? Number(order.total)
          : Number(order.total_amount ?? 0),
      paymentStatus: order.payment_status ?? "pending",
    })),
  };
}

export const getAdminProducts = cache(async (): Promise<AdminProductListItem[]> => {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select(`
      id,
      name,
      slug,
      status,
      product_type,
      image_url,
      base_price,
      price,
      stock_quantity,
      is_visible,
      is_featured,
      sort_order,
      created_at,
      categories (
        name
      )
    `)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load admin products: ${error.message}`);
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    categoryName: row.categories?.name ?? null,
    status: row.status,
    productType: row.product_type,
    imageUrl: row.image_url ?? fallbackImage(),
    price:
      row.base_price !== null && row.base_price !== undefined
        ? Number(row.base_price)
        : row.price !== null && row.price !== undefined
        ? Number(row.price)
        : null,
    stockQuantity:
      row.stock_quantity !== null && row.stock_quantity !== undefined
        ? Number(row.stock_quantity)
        : null,
    isVisible: Boolean(row.is_visible),
    isFeatured: Boolean(row.is_featured),
    sortOrder: row.sort_order ?? 100,
    createdAt: row.created_at,
  }));
});

export const getAdminCategories = cache(async (): Promise<AdminCategoryListItem[]> => {
  const { data, error } = await supabaseAdmin
    .from("categories")
    .select(`
      id,
      name,
      slug,
      description,
      image_url,
      is_visible,
      is_featured,
      sort_order,
      created_at
    `)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load admin categories: ${error.message}`);
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description ?? null,
    imageUrl: row.image_url ?? fallbackImage(),
    isVisible: Boolean(row.is_visible),
    isFeatured: Boolean(row.is_featured),
    sortOrder: row.sort_order ?? 100,
    createdAt: row.created_at,
  }));
});

export const getAdminBanners = cache(async (): Promise<AdminBannerListItem[]> => {
  const { data, error } = await supabaseAdmin
    .from("banners")
    .select(`
      id,
      title,
      subtitle,
      placement,
      status,
      image_url,
      priority,
      created_at
    `)
    .order("priority", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load admin banners: ${error.message}`);
  }

  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle ?? null,
    placement: row.placement,
    status: row.status,
    imageUrl: row.image_url ?? fallbackImage(),
    priority: row.priority ?? 1,
    createdAt: row.created_at,
  }));
});
