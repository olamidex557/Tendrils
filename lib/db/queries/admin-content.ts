import { cache } from "react";
import { supabaseAdmin } from "@/lib/supabase/admin";

export type AdminEditCategoryRecord = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  parentCategoryId: string | null;
  parentCategoryName: string | null;
  isFeatured: boolean;
  isVisible: boolean;
  sortOrder: number;
};

export type AdminEditBannerRecord = {
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
};

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value
  );
}

export const getAdminCategoryById = cache(
  async (identifier: string): Promise<AdminEditCategoryRecord | null> => {
    if (!identifier?.trim()) return null;

    const query = supabaseAdmin.from("categories").select(`
      id,
      name,
      slug,
      description,
      image_url,
      parent_category_id,
      is_featured,
      is_visible,
      sort_order
    `);

    const { data, error } = isUuid(identifier)
      ? await query.eq("id", identifier).maybeSingle()
      : await query.eq("slug", identifier).maybeSingle();

    if (error) {
      throw new Error(`Failed to load admin category: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description ?? null,
      imageUrl: data.image_url ?? null,
      parentCategoryId: data.parent_category_id ?? null,
      parentCategoryName: null,
      isFeatured: Boolean(data.is_featured),
      isVisible: Boolean(data.is_visible),
      sortOrder: data.sort_order ?? 100,
    };
  }
);

export const getAdminBannerById = cache(
  async (identifier: string): Promise<AdminEditBannerRecord | null> => {
    if (!identifier?.trim()) return null;

    const query = supabaseAdmin.from("banners").select(`
      id,
      title,
      subtitle,
      cta_text,
      cta_link,
      placement,
      status,
      image_url,
      priority,
      schedule_text
    `);

    const { data, error } = isUuid(identifier)
      ? await query.eq("id", identifier).maybeSingle()
      : await query.eq("title", identifier).maybeSingle();

    if (error) {
      throw new Error(`Failed to load admin banner: ${error.message}`);
    }

    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      subtitle: data.subtitle ?? null,
      ctaText: data.cta_text ?? null,
      ctaLink: data.cta_link ?? null,
      placement: data.placement,
      status: data.status,
      imageUrl: data.image_url ?? null,
      priority: data.priority ?? 1,
      scheduleText: data.schedule_text ?? null,
    };
  }
);