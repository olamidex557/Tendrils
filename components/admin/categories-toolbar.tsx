"use client";

import Link from "next/link";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CategoriesToolbar() {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-black">
            Categories Management
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Organize storefront browsing with categories, featured collections, and visibility settings.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search categories..."
              className="h-11 w-full rounded-full border border-stone-200 bg-stone-50 pl-10 pr-4 text-sm outline-none 
transition focus:border-black/20"
            />
          </div>

          <Button
            asChild
            className="h-11 rounded-full bg-black px-5 text-white hover:bg-black/90"
          >
            <Link href="/admin/categories/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <FilterPill>
          <SlidersHorizontal className="h-4 w-4" />
          All Categories
        </FilterPill>

        <FilterPill>Featured</FilterPill>
        <FilterPill>Visible</FilterPill>
        <FilterPill>Hidden</FilterPill>
        <FilterPill>Low Products</FilterPill>

        <select className="h-10 rounded-full border border-stone-200 bg-white px-4 text-sm text-stone-700 outline-none">
          <option>Sort By</option>
          <option>Newest</option>
          <option>Alphabetical</option>
          <option>Most Products</option>
          <option>Fewest Products</option>
        </select>
      </div>
    </div>
  );
}

function FilterPill({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <button className="inline-flex h-10 items-center gap-2 rounded-full bg-stone-100 px-4 text-sm text-stone-700 
transition hover:bg-stone-200 hover:text-black">
      {children}
    </button>
  );
}
