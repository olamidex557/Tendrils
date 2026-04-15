"use client";

import { Bell, Search } from "lucide-react";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between gap-4 px-4 py-4 md:px-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
            Ajike+ Admin
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-black">
            Control Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search admin..."
              className="h-11 w-64 rounded-full border border-stone-200 bg-stone-50 pl-10 pr-4 text-sm outline-none"
            />
          </div>

          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-stone-200 bg-white 
text-stone-700 transition hover:text-black"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
          </button>

          <div className="flex h-11 min-w-11 items-center justify-center rounded-full bg-black px-4 text-sm 
font-semibold text-white">
            AD
          </div>
        </div>
      </div>
    </header>
  );
}
