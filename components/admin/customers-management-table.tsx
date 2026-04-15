"use client";

import Link from "next/link";
import { Eye, Mail, ShoppingBag, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

const customers = [
  {
    id: "CUS-001",
    name: "Olamide A.",
    email: "customer@example.com",
    orders: 8,
    totalSpend: 345000,
    lastOrder: "2026-04-14",
    status: "Active",
  },
  {
    id: "CUS-002",
    name: "Ada N.",
    email: "shopper@example.com",
    orders: 5,
    totalSpend: 214000,
    lastOrder: "2026-04-14",
    status: "Active",
  },
  {
    id: "CUS-003",
    name: "David O.",
    email: "buyer@example.com",
    orders: 2,
    totalSpend: 76000,
    lastOrder: "2026-04-13",
    status: "Recent",
  },
  {
    id: "CUS-004",
    name: "Sarah K.",
    email: "sarah@example.com",
    orders: 11,
    totalSpend: 502000,
    lastOrder: "2026-04-12",
    status: "VIP",
  },
  {
    id: "CUS-005",
    name: "Femi T.",
    email: "femi@example.com",
    orders: 1,
    totalSpend: 67000,
    lastOrder: "2026-03-28",
    status: "Inactive",
  },
];

export default function CustomersManagementTable() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Customers" value="184" subtitle="Registered order records" />
        <SummaryCard title="Repeat Buyers" value="72" subtitle="More than one order" />
        <SummaryCard title="VIP Customers" value="14" subtitle="Highest total spend" />
        <SummaryCard title="Inactive" value="23" subtitle="No recent orders" />
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1080px] text-left">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-sm text-stone-500">
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Orders</th>
                <th className="px-6 py-4 font-medium">Total Spend</th>
                <th className="px-6 py-4 font-medium">Last Order</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-stone-100">
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-semibold text-black">{customer.name}</p>
                      <p className="mt-1 text-xs text-stone-500">{customer.email}</p>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs 
font-medium text-stone-700">
                      <ShoppingBag className="h-3.5 w-3.5" />
                      {customer.orders}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <span className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-3 py-1 text-xs 
font-medium text-stone-700">
                      <Wallet className="h-3.5 w-3.5" />
                      ₦{customer.totalSpend.toLocaleString()}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-sm text-stone-600">
                    {customer.lastOrder}
                  </td>

                  <td className="px-6 py-5">
                    <StatusPill status={customer.status} />
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <Button
                        asChild
                        type="button"
                        size="icon"
                        variant="outline"
                        className="rounded-full text-stone-700"
                      >
                        <Link href={`/admin/customers/${customer.id}`} aria-label="View customer">
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>

                      <IconActionButton label="Contact customer">
                        <Mail className="h-4 w-4" />
                      </IconActionButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-stone-500">
            Showing 1–{customers.length} of {customers.length} customers
          </p>

          <div className="flex items-center gap-2">
            <PaginationButton active>1</PaginationButton>
            <PaginationButton>2</PaginationButton>
            <PaginationButton>3</PaginationButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle: string;
}) {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-sm text-stone-500">{title}</p>
      <h3 className="mt-2 text-3xl font-semibold tracking-tight text-black">
        {value}
      </h3>
      <p className="mt-2 text-sm text-stone-500">{subtitle}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles =
    status === "VIP"
      ? "bg-amber-100 text-amber-700"
      : status === "Active"
      ? "bg-green-100 text-green-700"
      : status === "Recent"
      ? "bg-blue-100 text-blue-700"
      : "bg-stone-100 text-stone-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
}

function IconActionButton({
  children,
  label,
}: {
  children: React.ReactNode;
  label: string;
}) {
  return (
    <Button
      type="button"
      size="icon"
      variant="outline"
      aria-label={label}
      className="rounded-full text-stone-700"
    >
      {children}
    </Button>
  );
}

function PaginationButton({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm transition ${
        active
          ? "bg-black text-white"
          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
      }`}
    >
      {children}
    </button>
  );
}
