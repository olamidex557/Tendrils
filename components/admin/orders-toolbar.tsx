"use client";

import { Search, SlidersHorizontal } from "lucide-react";

export default function OrdersToolbar() {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-black">
            Orders Management
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Track customer orders, payments, delivery progress, and fulfillment status.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-[260px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search order ID or customer..."
              className="h-11 w-full rounded-full border border-stone-200 bg-stone-50 pl-10 pr-4 text-sm outline-none 
transition focus:border-black/20"
            />
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <FilterPill>
          <SlidersHorizontal className="h-4 w-4" />
          All Orders
        </FilterPill>

        <FilterPill>Pending</FilterPill>
        <FilterPill>Paid</FilterPill>
        <FilterPill>Shipped</FilterPill>
        <FilterPill>Delivered</FilterPill>
        <FilterPill>Failed</FilterPill>

        <select className="h-10 rounded-full border border-stone-200 bg-white px-4 text-sm text-stone-700 outline-none">
          <option>All Payment Status</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Failed</option>
        </select>

        <select className="h-10 rounded-full border border-stone-200 bg-white px-4 text-sm text-stone-700 outline-none">
          <option>Sort By</option>
          <option>Newest</option>
          <option>Oldest</option>
          <option>Highest Amount</option>
          <option>Lowest Amount</option>
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
