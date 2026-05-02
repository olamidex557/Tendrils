import type { ReactNode } from "react";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AdminHeader from "@/components/admin/admin-header";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
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
