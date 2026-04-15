"use client";

import Link from "next/link";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BannersToolbar() {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-black">
            Banners Management
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Control homepage promos, campaign placements, and banner visibility.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-[240px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search banners..."
              className="h-11 w-full rounded-full border border-stone-200 bg-stone-50 pl-10 pr-4 text-sm outline-none 
transition focus:border-black/20"
            />
          </div>

          <Button
            asChild
            className="h-11 rounded-full bg-black px-5 text-white hover:bg-black/90"
          >
            <Link href="/admin/banners/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Banner
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <FilterPill>
          <SlidersHorizontal className="h-4 w-4" />
          All Banners
        </FilterPill>
        <FilterPill>Active</FilterPill>
        <FilterPill>Draft</FilterPill>
        <FilterPill>Scheduled</FilterPill>
        <FilterPill>Homepage</FilterPill>
        <FilterPill>Promo Strip</FilterPill>

        <select className="h-10 rounded-full border border-stone-200 bg-white px-4 text-sm text-stone-700 outline-none">
          <option>Sort By</option>
          <option>Newest</option>
          <option>Oldest</option>
          <option>Priority</option>
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
