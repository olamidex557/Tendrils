import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminProducts } from "@/lib/db/queries/admin-dashboard";

function formatMoney(value: number | null) {
  if (value === null) return "—";
  return `₦${value.toLocaleString()}`;
}

function statusPill(status: string) {
  if (status === "published") return "bg-green-100 text-green-700";
  if (status === "draft") return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export default async function AdminProductsPage() {
  const products = await getAdminProducts();

  return (
    <section className="space-y-6">
      <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-stone-500">Catalog</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
              Products
            </h1>
            <p className="mt-2 text-sm text-stone-600">
              Real products from Supabase. No mock rows.
            </p>
          </div>

          <Button asChild className="rounded-full bg-black px-5 text-white hover:bg-black/90">
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-black">No products yet</h2>
          <p className="mt-2 text-sm text-stone-500">
            Create your first product to populate the catalog.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-left">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-sm text-stone-500">
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">Category</th>
                  <th className="px-6 py-4 font-medium">Type</th>
                  <th className="px-6 py-4 font-medium">Price</th>
                  <th className="px-6 py-4 font-medium">Stock</th>
                  <th className="px-6 py-4 font-medium">Visibility</th>
                  <th className="px-6 py-4 font-medium">Featured</th>
                  <th className="px-6 py-4 font-medium">Sort</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-stone-100">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.imageUrl ?? ""}
                          alt={product.name}
                          className="h-14 w-14 rounded-2xl object-cover"
                        />
                        <div>
                          <p className="font-semibold text-black">{product.name}</p>
                          <p className="mt-1 text-xs text-stone-500">{product.slug}</p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5 text-sm text-stone-600">
                      {product.categoryName ?? "—"}
                    </td>

                    <td className="px-6 py-5">
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium capitalize 
text-stone-700">
                        {product.productType}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-black">
                      {formatMoney(product.price)}
                    </td>

                    <td className="px-6 py-5 text-sm text-stone-600">
                      {product.stockQuantity ?? "—"}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.isVisible
                            ? "bg-green-100 text-green-700"
                            : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {product.isVisible ? "Visible" : "Hidden"}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          product.isFeatured
                            ? "bg-amber-100 text-amber-700"
                            : "bg-stone-100 text-stone-700"
                        }`}
                      >
                        {product.isFeatured ? "Yes" : "No"}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-stone-600">
                      {product.sortOrder}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusPill(
                          product.status
                        )}`}
                      >
                        {product.status.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <Button asChild variant="outline" size="icon" className="rounded-full">
                        <Link href={`/admin/products/${product.id}/edit`} aria-label="Edit product">
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
