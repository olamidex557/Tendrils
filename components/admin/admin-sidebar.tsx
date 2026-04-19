"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Image as ImageIcon,
  ShoppingBag,
  Users,
  CreditCard,
  BarChart3,
  Settings,
} from "lucide-react";
import Logo from "@/components/shared/logo";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Categories", href: "/admin/categories", icon: FolderTree },
  { label: "Banners", href: "/admin/banners", icon: ImageIcon },
  { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-fit rounded-[1.75rem] border border-black/5 bg-white p-4 shadow-sm">
      {/* BRAND */}
      <div className="border-b border-stone-200 px-3 pb-5 pt-3">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
          Admin Panel
        </p>

        {/* LOGO */}
        <div className="mt-4 flex justify-center">
          <Logo size="xl" className="scale-220" />
        </div>

        <p className="mt-4 text-sm leading-6 text-stone-500 text-center">
          Manage Tendrils storefront, products, payments, and growth.
        </p>
      </div>

      {/* NAV */}
      <nav className="mt-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-black text-white shadow-sm"
                  : "text-stone-700 hover:bg-stone-100 hover:text-black"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}