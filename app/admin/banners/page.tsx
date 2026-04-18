import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminBanners } from "@/lib/db/queries/admin-dashboard";

function statusPill(status: string) {
  if (status === "active") return "bg-green-100 text-green-700";
  if (status === "scheduled") return "bg-blue-100 text-blue-700";
  return "bg-stone-100 text-stone-700";
}

export default async function AdminBannersPage() {
  const banners = await getAdminBanners();

  return (
    <section className="space-y-6">
      <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-stone-500">Content</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
              Banners
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Real banner campaigns from Supabase. No mock rows.
            </p>
          </div>

          <Button asChild className="rounded-full bg-black px-5 text-white hover:bg-black/90">
            <Link href="/admin/banners/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
            </Link>
          </Button>
        </div>
      </div>

      {banners.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-black">No banners yet</h2>
          <p className="mt-2 text-sm text-stone-500">
            Create your first banner to control homepage campaigns.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-sm text-stone-500">
                  <th className="px-6 py-4 font-medium">Banner</th>
                  <th className="px-6 py-4 font-medium">Placement</th>
                  <th className="px-6 py-4 font-medium">Priority</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {banners.map((banner) => (
                  <tr key={banner.id} className="border-b border-stone-100">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={banner.imageUrl ?? ""}
                          alt={banner.title}
                          className="h-14 w-14 rounded-2xl object-cover"
                        />
                        <div>
                          <p className="font-semibold text-black">{banner.title}</p>
                          <p className="mt-1 text-xs text-stone-500">
                            {banner.subtitle ?? "No subtitle"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-stone-600">
                      {banner.placement}
                    </td>

                    <td className="px-6 py-5 text-sm text-stone-600">
                      {banner.priority}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusPill(
                          banner.status
                        )}`}
                      >
                        {banner.status}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <Button asChild variant="outline" size="icon" className="rounded-full">
                        <Link href={`/admin/banners/${banner.id}/edit`} aria-label="Edit banner">
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
