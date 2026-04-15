"use client";

import Link from "next/link";
import { Eye, Pencil, Trash2, Star, FolderTree } from "lucide-react";
import { Button } from "@/components/ui/button";

const categories = [
  {
    id: "CAT-001",
    name: "Electronics",
    slug: "electronics",
    productCount: 42,
    featured: true,
    visibility: "Visible",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "CAT-002",
    name: "Fashion",
    slug: "fashion",
    productCount: 57,
    featured: true,
    visibility: "Visible",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "CAT-003",
    name: "Home Essentials",
    slug: "home-essentials",
    productCount: 19,
    featured: false,
    visibility: "Visible",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "CAT-004",
    name: "Sports",
    slug: "sports",
    productCount: 15,
    featured: false,
    visibility: "Hidden",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: "CAT-005",
    name: "Beauty",
    slug: "beauty",
    productCount: 8,
    featured: true,
    visibility: "Visible",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80",
  },
];

export default function CategoriesManagementTable() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Categories" value="12" subtitle="Across the storefront" />
        <SummaryCard title="Featured Categories" value="5" subtitle="Highlighted on homepage" />
        <SummaryCard title="Visible Categories" value="10" subtitle="Currently shown to shoppers" />
        <SummaryCard title="Needs Review" value="2" subtitle="Low products or hidden" danger />
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-sm text-stone-500">
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Products</th>
                <th className="px-6 py-4 font-medium">Featured</th>
                <th className="px-6 py-4 font-medium">Visibility</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b border-stone-100">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="h-14 w-14 rounded-2xl object-cover bg-stone-100"
                      />

                      <div>
                        <p className="font-semibold text-black">{category.name}</p>
                        <p className="mt-1 text-xs text-stone-500">{category.id}</p>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-stone-600">
                    {category.slug}
                  </td>

                  <td className="px-6 py-5">
                    <ProductsPill count={category.productCount} />
                  </td>

                  <td className="px-6 py-5">
                    <FeaturedPill featured={category.featured} />
                  </td>

                  <td className="px-6 py-5">
                    <VisibilityPill visibility={category.visibility} />
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <IconActionButton label="Preview category">
                        <Eye className="h-4 w-4" />
                      </IconActionButton>

                      <Button
                        asChild
                        type="button"
                        size="icon"
                        variant="outline"
                        className="rounded-full text-stone-700"
                      >
                        <Link href={`/admin/categories/${category.id}/edit`} aria-label="Edit category">
                          <Pencil className="h-4 w-4" />
                        </Link>
                      </Button>

                      <IconActionButton label="Delete category" danger>
                        <Trash2 className="h-4 w-4" />
                      </IconActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-stone-500">
            Showing 1–{categories.length} of {categories.length} categories
          </p>

          <div className="flex items-center gap-2">
            <PaginationButton active>1</PaginationButton>
            <PaginationButton>2</PaginationButton>
            <PaginationButton>3</PaginationButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  danger = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-sm text-stone-500">{title}</p>
      <h3 className={`mt-2 text-3xl font-semibold tracking-tight ${danger ? "text-red-600" : "text-black"}`}>
        {value}
      </h3>
      <p className="mt-2 text-sm text-stone-500">{subtitle}</p>
    </div>
  );
}

function ProductsPill({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium 
text-stone-700">
      <FolderTree className="h-3.5 w-3.5" />
      {count} products
    </span>
  );
}

function FeaturedPill({ featured }: { featured: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ${
        featured ? "bg-amber-100 text-amber-700" : "bg-stone-100 text-stone-700"
      }`}
    >
      <Star className="h-3.5 w-3.5" />
      {featured ? "Featured" : "Standard"}
    </span>
  );
}

function VisibilityPill({ visibility }: { visibility: string }) {
  const styles =
    visibility === "Visible"
      ? "bg-green-100 text-green-700"
      : "bg-stone-100 text-stone-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles}`}>
      {visibility}
    </span>
  );
}

function IconActionButton({
  children,
  label,
  danger = false,
}: {
  children: React.ReactNode;
  label: string;
  danger?: boolean;
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      aria-label={label}
      className={`rounded-full ${
        danger ? "text-red-600 hover:text-red-700" : "text-stone-700"
      }`}
    >
      {children}
    </Button>
  );
}

function PaginationButton({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm transition ${
        active
          ? "bg-black text-white"
          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
      }`}
    >
      {children}
    </button>
  );
}
