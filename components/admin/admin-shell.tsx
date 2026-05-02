"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import AdminHeader from "@/components/admin/admin-header";
import AdminSidebar from "@/components/admin/admin-sidebar";

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (pathname.startsWith("/admin/sign-in")) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 md:px-6 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <div className="sticky top-6">
            <AdminSidebar />
          </div>
        </div>

        <main className="min-w-0 space-y-6">
          <AdminHeader />
          {children}
        </main>
      </div>
    </div>
  );
}
