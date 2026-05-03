import Link from "next/link";
import {
  Package,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <section className="space-y-4 sm:space-y-6">
      <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:rounded-[1.5rem] sm:p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-stone-500">Overview</p>
            <h1 className="mt-2 text-2xl font-semibold text-black sm:text-3xl">
              Dashboard
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
              Store performance, recent orders, and quick admin actions.
            </p>
          </div>

          <Button
            asChild
            className="h-10 w-full rounded-full bg-black px-5 text-white hover:bg-black/90 sm:w-auto"
          >
            <Link href="/admin/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 2xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:rounded-[1.5rem] sm:p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm text-stone-500">{stat.title}</p>
                  <h2 className="mt-2 break-words text-2xl font-semibold text-black sm:text-3xl">
                    {stat.value}
                  </h2>
                  <p className="mt-2 text-sm text-stone-500">{stat.change}</p>
                </div>

                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-stone-100 text-black sm:h-11 sm:w-11">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:rounded-[1.5rem] sm:p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-black sm:text-xl">
              Recent Orders
            </h3>
            <Link
              href="/admin/orders"
              className="text-sm font-medium text-stone-500 transition hover:text-black"
            >
              View all
            </Link>
          </div>

          <div className="mt-5 space-y-3 md:hidden">
            {dashboard.recentOrders.length === 0 ? (
              <div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-500">
                No recent orders yet.
              </div>
            ) : (
              dashboard.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="block rounded-2xl border border-stone-100 bg-stone-50 p-4 transition hover:border-black/10"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-black">
                        {order.orderNumber}
                      </p>
                      <p className="mt-1 truncate text-sm text-stone-600">
                        {order.customerName ?? "Guest Customer"}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium capitalize ${pill(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>

                  <p className="mt-3 text-sm font-semibold text-black">
                    {money(order.total)}
                  </p>
                </Link>
              ))
            )}
          </div>

          <div className="mt-6 hidden overflow-x-auto md:block">
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
          <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:rounded-[1.5rem] sm:p-6">
            <h3 className="text-lg font-semibold text-black sm:text-xl">
              Store Health
            </h3>
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

          <div className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm sm:rounded-[1.5rem] sm:p-6">
            <h3 className="text-lg font-semibold text-black sm:text-xl">
              Quick Actions
            </h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
              <QuickAction href="/admin/products/new" label="Add New Product" />
              <QuickAction href="/admin/orders" label="Review Orders" />
              <QuickAction href="/admin/banners" label="Update Homepage Banner" />
              <QuickAction href="/admin/payments" label="Check Payments" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HealthRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-stone-50 px-4 py-3">
      <span className="min-w-0 text-sm text-stone-600">{label}</span>
      <span className="shrink-0 text-sm font-semibold text-black">{value}</span>
    </div>
  );
}

function QuickAction({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-white px-4 py-3 text-left text-sm font-medium text-stone-700 transition hover:border-black/20 hover:text-black"
    >
      <span className="min-w-0">{label}</span>
      <ArrowUpRight className="h-4 w-4 shrink-0" />
    </Link>
  );
}
