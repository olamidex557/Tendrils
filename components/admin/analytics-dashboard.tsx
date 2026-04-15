const topProducts = [
  { name: "Wireless Earbuds", sales: "₦540,000", units: 24, growth: "+12%" },
  { name: "Classic T-Shirt", sales: "₦312,000", units: 26, growth: "+8%" },
  { name: "Noise Cancelling Headphones", sales: "₦398,000", units: 12, growth: "+15%" },
  { name: "Modern Desk Lamp", sales: "₦148,000", units: 9, growth: "+5%" },
];

const categoryStats = [
  { category: "Electronics", revenue: "₦1,240,000", orders: 42, share: "42%" },
  { category: "Fashion", revenue: "₦920,000", orders: 57, share: "31%" },
  { category: "Home Essentials", revenue: "₦410,000", orders: 19, share: "14%" },
  { category: "Sports", revenue: "₦380,000", orders: 15, share: "13%" },
];

const recentActivity = [
  "Revenue grew by 8.2% compared to the previous period.",
  "Electronics remained the highest-performing category.",
  "Classic T-Shirt variants generated the most unit sales.",
  "Failed payments dropped by 3% this week.",
];

export default function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value="₦2,450,000"
          change="+8.2%"
          subtitle="Compared to previous period"
        />
        <MetricCard
          title="Total Orders"
          value="342"
          change="+18"
          subtitle="Orders in this period"
        />
        <MetricCard
          title="Average Order Value"
          value="₦71,600"
          change="+4.1%"
          subtitle="Per completed order"
        />
        <MetricCard
          title="Conversion Health"
          value="97%"
          change="+2.3%"
          subtitle="Successful payments"
        />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-black">Revenue Overview</h3>
              <p className="mt-1 text-sm text-stone-600">
                Visual placeholder for revenue trends.
              </p>
            </div>

            <div className="rounded-full bg-stone-100 px-4 py-2 text-sm text-stone-700">
              Monthly
            </div>
          </div>

          <div className="mt-8">
            <div className="flex h-[320px] items-end gap-4 rounded-[1.5rem] bg-stone-50 p-6">
              <Bar height="38%" label="Jan" />
              <Bar height="52%" label="Feb" />
              <Bar height="47%" label="Mar" />
              <Bar height="68%" label="Apr" />
              <Bar height="56%" label="May" />
              <Bar height="76%" label="Jun" active />
              <Bar height="62%" label="Jul" />
              <Bar height="84%" label="Aug" />
              <Bar height="72%" label="Sep" />
              <Bar height="90%" label="Oct" />
              <Bar height="78%" label="Nov" />
              <Bar height="96%" label="Dec" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-black">Order Snapshot</h3>
            <div className="mt-5 space-y-4">
              <SnapshotRow label="Pending Orders" value="18" />
              <SnapshotRow label="Shipped Orders" value="74" />
              <SnapshotRow label="Delivered Orders" value="250" />
              <SnapshotRow label="Returned Orders" value="6" />
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-semibold text-black">Payment Snapshot</h3>
            <div className="mt-5 space-y-4">
              <SnapshotRow label="Paid" value="291" />
              <SnapshotRow label="Pending" value="21" />
              <SnapshotRow label="Failed" value="28" />
              <SnapshotRow label="Refunded" value="4" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-black">Top Products</h3>
            <button className="text-sm font-medium text-stone-500 transition hover:text-black">
              View all
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {topProducts.map((product) => (
              <div
                key={product.name}
                className="flex items-center justify-between rounded-[1.25rem] bg-stone-50 p-4"
              >
                <div>
                  <p className="font-semibold text-black">{product.name}</p>
                  <p className="mt-1 text-sm text-stone-500">
                    {product.units} units sold
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-black">{product.sales}</p>
                  <p className="mt-1 text-sm text-green-600">{product.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-black">Category Performance</h3>
            <button className="text-sm font-medium text-stone-500 transition hover:text-black">
              Details
            </button>
          </div>

          <div className="mt-6 space-y-4">
            {categoryStats.map((item) => (
              <div
                key={item.category}
                className="rounded-[1.25rem] border border-stone-200 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-black">{item.category}</p>
                  <p className="text-sm font-medium text-stone-600">{item.share}</p>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm text-stone-500">
                  <span>{item.orders} orders</span>
                  <span>{item.revenue}</span>
                </div>

                <div className="mt-3 h-2 rounded-full bg-stone-100">
                  <div
                    className="h-2 rounded-full bg-black"
                    style={{ width: item.share }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-black">Insights & Activity</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {recentActivity.map((item) => (
            <div
              key={item}
              className="rounded-[1.25rem] bg-stone-50 p-4 text-sm leading-7 text-stone-600"
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  title,
  value,
  change,
  subtitle,
}: {
  title: string;
  value: string;
  change: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-sm text-stone-500">{title}</p>
      <h3 className="mt-2 text-3xl font-semibold tracking-tight text-black">
        {value}
      </h3>
      <p className="mt-2 text-sm text-green-600">{change}</p>
      <p className="mt-1 text-sm text-stone-500">{subtitle}</p>
    </div>
  );
}

function SnapshotRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
      <span className="text-sm text-stone-600">{label}</span>
      <span className="text-sm font-semibold text-black">{value}</span>
    </div>
  );
}

function Bar({
  height,
  label,
  active = false,
}: {
  height: string;
  label: string;
  active?: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col items-center justify-end gap-3">
      <div
        className={`w-full rounded-t-2xl ${
          active ? "bg-black" : "bg-stone-300"
        }`}
        style={{ height }}
      />
      <span className="text-xs text-stone-500">{label}</span>
    </div>
  );
}
