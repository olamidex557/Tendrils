import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Image as ImageIcon,
  Settings,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    label: "Categories",
    href: "/admin/categories",
    icon: FolderTree,
  },
  {
    label: "Banners",
    href: "/admin/banners",
    icon: ImageIcon,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  return (
    <aside className="h-fit rounded-[1.75rem] border border-black/5 bg-white p-4 shadow-sm">
      <div className="px-3 pb-4 pt-2">
        <p className="text-xs uppercase tracking-[0.2em] text-stone-500">
          Admin Panel
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black">
          Ajike+
        </h2>
        <p className="mt-2 text-sm text-stone-500">
          Live deployment-ready sections only.
        </p>
      </div>

      <nav className="mt-3 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-stone-700 transition 
hover:bg-stone-100 hover:text-black"
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
