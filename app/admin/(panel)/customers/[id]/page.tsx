import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  ShoppingBag,
  Wallet,
  Clock3,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const customer = {
  id: "CUS-001",
  name: "Olamide A.",
  email: "customer@example.com",
  phone: "+234 801 234 5678",
  totalOrders: 8,
  totalSpend: 345000,
  lastOrder: "2026-04-14",
  address: "14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
  status: "Active",
};

const recentOrders = [
  { id: "AJK-1001", amount: "₦145,000", status: "Paid" },
  { id: "AJK-0977", amount: "₦42,000", status: "Delivered" },
  { id: "AJK-0911", amount: "₦58,000", status: "Paid" },
];

export default function AdminCustomerDetailsPage() {
  return (
    <section className="space-y-6">
      <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/admin/customers"
              className="inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Customers
            </Link>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
              {customer.name}
            </h2>
            <p className="mt-2 text-sm text-stone-600">
              Customer details and activity overview.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-full px-5">
              Contact Customer
            </Button>
            <Button className="rounded-full bg-black px-5 text-white hover:bg-black/90">
              View Orders
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <CardShell title="Customer Profile" subtitle="Basic identity and contact information.">
            <InfoRow icon={<Mail className="h-4 w-4 text-stone-500" />} label="Email" value={customer.email} />
            <InfoRow icon={<Phone className="h-4 w-4 text-stone-500" />} label="Phone" value={customer.phone} />
            <InfoRow icon={<MapPin className="h-4 w-4 text-stone-500" />} label="Address" value={customer.address} />
          </CardShell>

          <CardShell title="Customer Summary" subtitle="Order and spend overview.">
            <InfoRow icon={<ShoppingBag className="h-4 w-4 text-stone-500" />} label="Total Orders" 
value={String(customer.totalOrders)} />
            <InfoRow icon={<Wallet className="h-4 w-4 text-stone-500" />} label="Total Spend" 
value={`₦${customer.totalSpend.toLocaleString()}`} />
            <InfoRow icon={<Clock3 className="h-4 w-4 text-stone-500" />} label="Last Order" value={customer.lastOrder} 
/>
          </CardShell>
        </div>

        <div className="space-y-6">
          <CardShell title="Recent Orders" subtitle="Latest orders placed by this customer.">
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-2xl bg-stone-50 p-4"
                >
                  <div>
                    <p className="font-semibold text-black">{order.id}</p>
                    <p className="mt-1 text-sm text-stone-500">{order.amount}</p>
                  </div>
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </CardShell>

          <CardShell title="Customer Status" subtitle="Current account activity level.">
            <div className="rounded-2xl bg-stone-50 p-4">
              <p className="text-sm font-medium text-black">Status</p>
              <p className="mt-2 text-sm text-stone-600">{customer.status}</p>
            </div>
          </CardShell>
        </div>
      </div>
    </section>
  );
}

function CardShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-black">{title}</h3>
      <p className="mt-1 text-sm text-stone-600">{subtitle}</p>
      <div className="mt-6 space-y-4">{children}</div>
    </div>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-stone-50 p-4">
      <div className="mt-0.5">{icon}</div>
      <div>
        <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
        <p className="mt-1 text-sm font-medium text-black">{value}</p>
      </div>
    </div>
  );
}
