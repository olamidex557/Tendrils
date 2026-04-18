import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminCategories } from "@/lib/db/queries/admin-dashboard";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <section className="space-y-6">
      <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-stone-500">Catalog</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
              Categories
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Real categories from Supabase. No mock rows.
            </p>
          </div>

          <Button asChild className="rounded-full bg-black px-5 text-white hover:bg-black/90">
            <Link href="/admin/categories/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Link>
          </Button>
        </div>
      </div>

      {categories.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-black">No categories yet</h2>
          <p className="mt-2 text-sm text-stone-500">
            Create your first category to organize products.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-sm text-stone-500">
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Slug</th>
                  <th className="px-6 py-4 font-medium">Visibility</th>
                  <th className="px-6 py-4 font-medium">Featured</th>
                  <th className="px-6 py-4 font-medium">Sort</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr key={category.id} className="border-b border-stone-100">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={category.imageUrl ?? ""}
                          alt={category.name}
                          className="h-14 w-14 rounded-2xl object-cover"
                        />
                        <div>
                          <p className="font-semibold text-black">{category.name}</p>
                          <p className="mt-1 text-xs text-stone-500">
                            {category.description ?? "No description"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-stone-600">
                      {category.slug}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          category.isVisible
                            ? "bg-green-100 text-green-700"
                            : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {category.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          category.isFeatured
                            ? "bg-amber-100 text-amber-700"
                            : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {category.isFeatured ? "Yes" : "No"}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-stone-600">
                      {category.sortOrder}
                    </td>

                    <td className="px-6 py-5">
                      <Button asChild variant="outline" size="icon" className="rounded-full">
                        <Link href={`/admin/categories/${category.id}/edit`} aria-label="Edit category">
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
