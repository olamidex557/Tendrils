"use client";

import { CalendarRange, Download, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AnalyticsToolbar() {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-black">
            Analytics Overview
          </h2>
          <p className="mt-1 text-sm text-stone-600">
            Track revenue, orders, top-performing products, and category growth.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="inline-flex h-11 items-center gap-2 rounded-full border border-stone-200 bg-white px-4 
text-sm text-stone-700 transition hover:border-black/20 hover:text-black">
            <CalendarRange className="h-4 w-4" />
            Last 30 Days
          </button>

          <button className="inline-flex h-11 items-center gap-2 rounded-full border border-stone-200 bg-white px-4 
text-sm text-stone-700 transition hover:border-black/20 hover:text-black">
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>

          <Button className="h-11 rounded-full bg-black px-5 text-white hover:bg-black/90">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>
    </div>
  );
}
