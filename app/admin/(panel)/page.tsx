import Link from "next/link";
import {
  Package,
  ShoppingCart,
  CreditCard,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Target,
  BarChart3,
} from "lucide-react";
import { getAdminDashboardStats } from "@/lib/db/queries/admin-dashboard";

function money(value: number) {
  return `₦${Number(value).toLocaleString()}`;
}

function pill(status: string) {
  if (status === "paid" || status === "completed" || status === "fulfilled") {
    return "bg-emerald-100 text-emerald-700";
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
      tone: "emerald",
      trend: "up",
    },
    {
      title: "Total Orders",
      value: String(dashboard.totalOrders),
      change: `${dashboard.todayOrders} today`,
      icon: ShoppingCart,
      tone: "sky",
      trend: "up",
    },
    {
      title: "Revenue",
      value: money(dashboard.totalRevenue),
      change: `${money(dashboard.todayRevenue)} today`,
      icon: CreditCard,
      tone: "amber",
      trend: "up",
    },
    {
      title: "Completed",
      value: String(dashboard.completedOrders),
      change: "Completed orders",
      icon: TrendingUp,
      tone: "rose",
      trend: "down",
    },
  ];

  const chartBars = [32, 48, 38, 72, 58, 86, 64, 92, 74, 100, 68, 82];

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
          const TrendIcon = stat.trend === "up" ? ArrowUpRight : ArrowDownRight;

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

                  <div className="mt-3 flex items-center gap-2">
                    <span className="text-sm text-stone-500">
                      {stat.change}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                      <TrendIcon className="h-3 w-3" />
                      11%
                    </span>
                  </div>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-black">
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-black">
                Sales Analytics
              </h3>
              <p className="mt-1 text-sm text-stone-500">
                Revenue and order activity overview.
              </p>
            </div>

            <span className="rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-600">
              Last 30 days
            </span>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <MiniMetric
              label="Income"
              value={money(dashboard.totalRevenue)}
              trend="+0.05%"
            />
            <MiniMetric
              label="Today"
              value={money(dashboard.todayRevenue)}
              trend="+0.05%"
            />
            <MiniMetric
              label="Orders"
              value={String(dashboard.totalOrders)}
              trend="+11%"
            />
          </div>

          <div className="mt-8 h-[230px] rounded-[1.25rem] bg-gradient-to-b from-emerald-50 to-white p-5">
            <div className="flex h-full items-end gap-3">
              {chartBars.map((height, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div
                    className="w-full rounded-t-xl bg-emerald-300/80 transition-all"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-[10px] text-stone-400">
                    {index + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-black">Sales Target</h3>
            <Target className="h-5 w-5 text-stone-400" />
          </div>

          <div className="mt-8 flex justify-center">
            <div className="relative flex h-44 w-44 items-center justify-center rounded-full border-[18px] border-stone-100">
              <div className="absolute inset-[-18px] rounded-full border-[18px] border-emerald-300 border-l-transparent border-b-transparent" />
              <div className="text-center">
                <p className="text-3xl font-semibold text-black">
                  {dashboard.completedOrders}
                </p>
                <p className="text-xs text-stone-500">Completed</p>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <TargetRow label="Pending Orders" value={String(dashboard.pendingOrders)} />
            <TargetRow label="Paid Orders" value={String(dashboard.paidOrders)} />
            <TargetRow label="Low Stock" value={String(dashboard.lowStockProducts)} />
          </div>
        </div>
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
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-black">Store Health</h3>
              <Activity className="h-5 w-5 text-stone-400" />
            </div>

            <div className="mt-5 space-y-4">
              <HealthRow
                label="Inventory status"
                value={
                  dashboard.lowStockProducts > 0 ? "Needs attention" : "Stable"
                }
              />
              <HealthRow label="Pending orders" value={String(dashboard.pendingOrders)} />
              <HealthRow label="Paid orders" value={String(dashboard.paidOrders)} />
              <HealthRow label="Active categories" value={String(dashboard.activeCategories)} />
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-black">Quick Actions</h3>
              <BarChart3 className="h-5 w-5 text-stone-400" />
            </div>

            <div className="mt-5 grid gap-3">
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

function MiniMetric({
  label,
  value,
  trend,
}: {
  label: string;
  value: string;
  trend: string;
}) {
  return (
    <div className="rounded-2xl border border-stone-100 bg-stone-50 px-4 py-3">
      <p className="text-xs text-stone-500">{label}</p>
      <div className="mt-2 flex items-end justify-between gap-3">
        <p className="text-lg font-semibold text-black">{value}</p>
        <span className="rounded-full bg-emerald-100 px-2 py-1 text-[11px] font-medium text-emerald-700">
          {trend}
        </span>
      </div>
    </div>
  );
}

function TargetRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
      <span className="text-sm text-stone-600">{label}</span>
      <span className="text-sm font-semibold text-black">{value}</span>
    </div>
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
      className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-left text-sm font-medium text-stone-700 transition hover:border-black/20 hover:bg-stone-50 hover:text-black"
    >
      {label}
    </Link>
  );
}