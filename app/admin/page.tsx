import {
  Package,
  ShoppingCart,
  CreditCard,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Total Products",
    value: "128",
    change: "+12 this week",
    icon: Package,
  },
  {
    title: "Orders",
    value: "342",
    change: "+18 today",
    icon: ShoppingCart,
  },
  {
    title: "Revenue",
    value: "₦2,450,000",
    change: "+8.2%",
    icon: CreditCard,
  },
  {
    title: "Growth",
    value: "24%",
    change: "This month",
    icon: TrendingUp,
  },
];

const recentOrders = [
  { id: "AJK-1001", customer: "Olamide", amount: "₦145,000", status: "Paid" },
  { id: "AJK-1002", customer: "Ada", amount: "₦89,000", status: "Pending" },
  { id: "AJK-1003", customer: "David", amount: "₦42,000", status: "Delivered" },
  { id: "AJK-1004", customer: "Sarah", amount: "₦199,000", status: "Paid" },
];

export default function AdminDashboardPage() {
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
            <button className="text-sm font-medium text-stone-500 transition hover:text-black">
              View all
            </button>
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
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b border-stone-100 text-sm">
                    <td className="py-4 font-medium text-black">{order.id}</td>
                    <td className="py-4 text-stone-600">{order.customer}</td>
                    <td className="py-4 text-stone-600">{order.amount}</td>
                    <td className="py-4">
                      <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-black">Store Health</h3>
            <div className="mt-5 space-y-4">
              <HealthRow label="Inventory status" value="Stable" />
              <HealthRow label="Pending orders" value="12" />
              <HealthRow label="Payment success rate" value="97%" />
              <HealthRow label="Active categories" value="8" />
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-black">Quick Actions</h3>
            <div className="mt-5 grid gap-3">
              <QuickAction label="Add New Product" />
              <QuickAction label="Review Orders" />
              <QuickAction label="Update Homepage Banner" />
              <QuickAction label="Check Payments" />
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

function QuickAction({ label }: { label: string }) {
  return (
    <button className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-left text-sm font-medium 
text-stone-700 transition hover:border-black/20 hover:text-black">
      {label}
    </button>
  );
}
