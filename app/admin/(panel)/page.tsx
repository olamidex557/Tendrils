import Link from "next/link";
import {
  Package,
  ShoppingCart,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { getAdminDashboardStats } from "@/lib/db/queries/admin-dashboard";

function money(value: number) {
  return `₦${Number(value).toLocaleString()}`;
}

function pill(status: string) {
  if (status === "paid" || status === "completed" || status === "fulfilled") {
    return "bg-green-100 text-green-700";
  }

  if (status === "pending" || status === "processing") {
    return "bg-amber-100 text-amber-700";
  }

  if (status === "failed" || status === "cancelled") {
    return "bg-red-100 text-red-700";
  }

  return "bg-stone-100 text-stone-700";
}

export default async function AdminDashboardPage() {
  const dashboard = await getAdminDashboardStats();

  const stats = [
    {
      title: "Total Products",
      value: String(dashboard.totalProducts),
      change: `${dashboard.visibleProducts} visible`,
      icon: Package,
    },
    {
      title: "Orders",
      value: String(dashboard.totalOrders),
      change: `${dashboard.todayOrders} today`,
      icon: ShoppingCart,
    },
    {
      title: "Revenue",
      value: money(dashboard.totalRevenue),
      change: `${money(dashboard.todayRevenue)} today`,
      icon: CreditCard,
    },
    {
      title: "Growth",
      value: `${dashboard.completedOrders}`,
      change: "Completed orders",
      icon: TrendingUp,
    },
  ];

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm text-stone-500">
          Welcome back. Here’s what’s happening in your store today.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-stone-500">{stat.title}</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-black">
                    {stat.value}
                  </h2>
                  <p className="mt-2 text-sm text-stone-500">{stat.change}</p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-black">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-black">Recent Orders</h3>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-stone-500 transition hover:text-black"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left">
              <thead>
                <tr className="border-b border-stone-200 text-sm text-stone-500">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {dashboard.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-6 text-sm text-stone-500">
                      No recent orders yet.
                    </td>
                  </tr>
                ) : (
                  dashboard.recentOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-stone-100 text-sm"
                    >
                      <td className="py-4 font-medium text-black">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="underline-offset-4 hover:underline"
                        >
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-4 text-stone-600">
                        {order.customerName ?? "Guest Customer"}
                      </td>
                      <td className="py-4 text-stone-600">
                        {money(order.total)}
                      </td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${pill(
                            order.paymentStatus
                          )}`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-black">Store Health</h3>
            <div className="mt-5 space-y-4">
              <HealthRow
                label="Inventory status"
                value={dashboard.lowStockProducts > 0 ? "Needs attention" : "Stable"}
              />
              <HealthRow
                label="Pending orders"
                value={String(dashboard.pendingOrders)}
              />
              <HealthRow
                label="Paid orders"
                value={String(dashboard.paidOrders)}
              />
              <HealthRow
                label="Active categories"
                value={String(dashboard.activeCategories)}
              />
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-black">Quick Actions</h3>
            <div className="mt-5 grid gap-3">
              <QuickAction href="/admin/products/new" label="Add New Product" />
              <QuickAction href="/admin/orders" label="Review Orders" />
              <QuickAction href="/admin/banners" label="Update Homepage Banner" />
              <QuickAction href="/admin/orders" label="Check Payments" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HealthRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
      <span className="text-sm text-stone-600">{label}</span>
      <span className="text-sm font-semibold text-black">{value}</span>
    </div>
  );
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-left text-sm font-medium text-stone-700 transition hover:border-black/20 hover:text-black"
    >
      {label}
    </Link>
  );
}