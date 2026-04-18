import { getAdminAnalyticsSnapshot } from "@/lib/db/queries/admin-commerce";

function money(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

export default async function AdminAnalyticsPage() {
  const analytics = await getAdminAnalyticsSnapshot();

  return (
    <section className="space-y-6">
      <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
        <p className="text-sm text-stone-500">Commerce</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
          Analytics
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Live commerce snapshot from Supabase.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Revenue" value={money(analytics.totalRevenue)} />
        <MetricCard label="Orders" value={String(analytics.totalOrders)} />
        <MetricCard label="Customers" value={String(analytics.totalCustomers)} />
        <MetricCard label="Payments" value={String(analytics.totalPayments)} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Paid Orders" value={String(analytics.paidOrders)} />
        <MetricCard label="Pending Orders" value={String(analytics.pendingOrders)} />
        <MetricCard
          label="Successful Payments"
          value={String(analytics.successfulPayments)}
        />
        <MetricCard
          label="Failed Payments"
          value={String(analytics.failedPayments)}
        />
      </div>

      {analytics.totalOrders === 0 &&
      analytics.totalCustomers === 0 &&
      analytics.totalPayments === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-black">No commerce data yet</h2>
          <p className="mt-2 text-sm text-stone-500">
            Analytics will populate automatically as orders, customers, and payments come in.
          </p>
        </div>
      ) : null}
    </section>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-sm text-stone-500">{label}</p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-black">
        {value}
      </h2>
    </div>
  );
}
