import AdminMobileNav from "@/components/admin/admin-mobile-nav";

export default function AdminHeader() {
  return (
    <header className="sticky top-0 z-40 rounded-[1.5rem] border border-black/5 bg-white/90 px-4 py-4 shadow-sm 
backdrop-blur md:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <AdminMobileNav />

          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
              Ajike+ Admin
            </p>
            <h1 className="text-lg font-semibold tracking-tight text-black md:text-xl">
              Store Control Center
            </h1>
          </div>
        </div>

        <div className="hidden rounded-full bg-stone-100 px-4 py-2 text-sm text-stone-600 md:block">
          Live Supabase Data
        </div>
      </div>
    </header>
  );
}
