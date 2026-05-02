import Link from "next/link";
import { Plus, Image as ImageIcon, Pencil, Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { deleteBanner, updateBannerStatus } from "@/lib/actions/banners";

type AdminBannerRow = {
  id: string;
  title: string;
  subtitle: string | null;
  cta_text: string | null;
  cta_link: string | null;
  placement: string;
  status: "draft" | "active" | "scheduled";
  image_url: string | null;
  priority: number | null;
  schedule_text: string | null;
  created_at: string;
};

function getPlacementLabel(value: string) {
  switch (value) {
    case "homepage_hero":
      return "Homepage Hero";
    case "homepage_secondary":
      return "Homepage Secondary";
    case "promo_strip":
      return "Promo Strip";
    case "category_banner":
      return "Category Banner";
    default:
      return value
        .replaceAll("_", " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
  }
}

function getStatusClasses(status: string) {
  switch (status) {
    case "active":
      return "bg-green-100 text-green-700";
    case "scheduled":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-stone-100 text-stone-700";
  }
}

async function getAdminBanners(): Promise<AdminBannerRow[]> {
  const { data, error } = await supabaseAdmin
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
      created_at
    `)
    .order("priority", { ascending: true })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load banners: ${error.message}`);
  }

  return (data ?? []) as AdminBannerRow[];
}

export default async function AdminBannersPage() {
  const banners = await getAdminBanners();

  return (
    <section className="space-y-6">
      <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-sm text-stone-500">Campaign management</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-black">
              Banners
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Manage homepage and promotional banners shown across Tendrils.
            </p>
          </div>

          <Button
            asChild
            className="rounded-full bg-black px-5 text-white hover:bg-black/90"
          >
            <Link href="/admin/banners/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
            </Link>
          </Button>
        </div>
      </div>

      {banners.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
            <ImageIcon className="h-6 w-6 text-stone-500" />
          </div>
          <h3 className="mt-4 text-xl font-semibold text-black">
            No banners yet
          </h3>
          <p className="mt-2 text-sm text-stone-500">
            Create your first Tendrils banner to control homepage campaigns.
          </p>

          <Button
            asChild
            className="mt-6 rounded-full bg-black px-5 text-white hover:bg-black/90"
          >
            <Link href="/admin/banners/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
            </Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-5">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm"
            >
              <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
                <div className="relative min-h-[220px] bg-stone-100">
                  {banner.image_url ? (
                    <img
                      src={banner.image_url}
                      alt={banner.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <ImageIcon className="mx-auto h-8 w-8 text-stone-400" />
                        <p className="mt-3 text-sm text-stone-500">
                          No banner image
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="max-w-3xl">
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClasses(
                            banner.status
                          )}`}
                        >
                          {banner.status.charAt(0).toUpperCase() +
                            banner.status.slice(1)}
                        </span>

                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                          {getPlacementLabel(banner.placement)}
                        </span>

                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                          Priority {banner.priority ?? 1}
                        </span>
                      </div>

                      <h3 className="mt-4 text-2xl font-semibold tracking-tight text-black">
                        {banner.title}
                      </h3>

                      {banner.subtitle ? (
                        <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600">
                          {banner.subtitle}
                        </p>
                      ) : (
                        <p className="mt-3 text-sm text-stone-400">
                          No subtitle added.
                        </p>
                      )}

                      <div className="mt-5 grid gap-3 sm:grid-cols-2">
                        <MetaRow
                          label="CTA Text"
                          value={banner.cta_text ?? "—"}
                        />
                        <MetaRow
                          label="CTA Link"
                          value={banner.cta_link ?? "—"}
                        />
                        <MetaRow
                          label="Schedule"
                          value={banner.schedule_text ?? "—"}
                        />
                        <MetaRow
                          label="Created"
                          value={new Date(banner.created_at).toLocaleString()}
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <form action={updateBannerStatus.bind(null, banner.id, "active")}>
                        <Button
                          type="submit"
                          variant={banner.status === "active" ? "default" : "outline"}
                          className={`rounded-full px-5 ${
                            banner.status === "active"
                              ? "bg-black text-white hover:bg-black/90"
                              : ""
                          }`}
                        >
                          Activate
                        </Button>
                      </form>

                      <form action={updateBannerStatus.bind(null, banner.id, "draft")}>
                        <Button
                          type="submit"
                          variant={banner.status === "draft" ? "default" : "outline"}
                          className={`rounded-full px-5 ${
                            banner.status === "draft"
                              ? "bg-black text-white hover:bg-black/90"
                              : ""
                          }`}
                        >
                          Draft
                        </Button>
                      </form>

                      <form action={updateBannerStatus.bind(null, banner.id, "scheduled")}>
                        <Button
                          type="submit"
                          variant={banner.status === "scheduled" ? "default" : "outline"}
                          className={`rounded-full px-5 ${
                            banner.status === "scheduled"
                              ? "bg-black text-white hover:bg-black/90"
                              : ""
                          }`}
                        >
                          Schedule
                        </Button>
                      </form>

                      {banner.cta_link ? (
                        <Button asChild variant="outline" className="rounded-full px-5">
                          <Link href={banner.cta_link}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Link
                          </Link>
                        </Button>
                      ) : null}

                      <Button
                        asChild
                        className="rounded-full bg-black px-5 text-white hover:bg-black/90"
                      >
                        <Link href={`/admin/banners/${banner.id}/edit`}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit Banner
                        </Link>
                      </Button>

                      <form action={deleteBanner.bind(null, banner.id)}>
                        <Button
                          type="submit"
                          variant="outline"
                          className="rounded-full border-red-200 px-5 text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function MetaRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-stone-50 px-4 py-3">
      <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-medium text-black">
        {value}
      </p>
    </div>
  );
}