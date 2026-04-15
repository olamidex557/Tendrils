"use client";

import Link from "next/link";
import { Eye, Truck, PackageCheck, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const adminOrders = [
  {
    id: "AJK-1001",
    customer: "Olamide",
    email: "customer@example.com",
    items: 3,
    amount: 145000,
    paymentStatus: "Paid",
    orderStatus: "Processing",
    date: "2026-04-14",
  },
  {
    id: "AJK-1002",
    customer: "Ada",
    email: "shopper@example.com",
    items: 2,
    amount: 89000,
    paymentStatus: "Pending",
    orderStatus: "Pending",
    date: "2026-04-14",
  },
  {
    id: "AJK-1003",
    customer: "David",
    email: "buyer@example.com",
    items: 1,
    amount: 42000,
    paymentStatus: "Paid",
    orderStatus: "Delivered",
    date: "2026-04-13",
  },
  {
    id: "AJK-1004",
    customer: "Sarah",
    email: "sarah@example.com",
    items: 4,
    amount: 199000,
    paymentStatus: "Paid",
    orderStatus: "Shipped",
    date: "2026-04-13",
  },
  {
    id: "AJK-1005",
    customer: "Femi",
    email: "femi@example.com",
    items: 2,
    amount: 67000,
    paymentStatus: "Failed",
    orderStatus: "Pending",
    date: "2026-04-12",
  },
];

export default function OrdersManagementTable() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Orders" value="342" subtitle="All recorded orders" />
        <SummaryCard title="Pending Orders" value="18" subtitle="Awaiting action" />
        <SummaryCard title="Shipped Today" value="12" subtitle="Out for delivery" />
        <SummaryCard title="Paid Orders" value="291" subtitle="Successful payments" />
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] text-left">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-sm text-stone-500">
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Items</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Fulfillment</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {adminOrders.map((order) => (
                <tr key={order.id} className="border-b border-stone-100">
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-semibold text-black">{order.id}</p>
                      <p className="mt-1 text-xs text-stone-500">
                        {order.items} item{order.items > 1 ? "s" : ""}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <div>
                      <p className="text-sm font-medium text-black">{order.customer}</p>
                      <p className="mt-1 text-xs text-stone-500">{order.email}</p>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm text-stone-600">
                    {order.items}
                  </td>

                  <td className="px-6 py-5 text-sm font-medium text-black">
                    ₦{order.amount.toLocaleString()}
                  </td>

                  <td className="px-6 py-5">
                    <PaymentPill status={order.paymentStatus} />
                  </td>

                  <td className="px-6 py-5">
                    <OrderStatusPill status={order.orderStatus} />
                  </td>

                  <td className="px-6 py-5 text-sm text-stone-600">
                    {order.date}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <IconActionLink
                        href={`/admin/orders/${order.id}`}
                        label="View order"
                      >
                        <Eye className="h-4 w-4" />
                      </IconActionLink>

                      <IconActionButton label="Mark as shipped">
                        <Truck className="h-4 w-4" />
                      </IconActionButton>

                      <IconActionButton label="Mark as delivered">
                        <PackageCheck className="h-4 w-4" />
                      </IconActionButton>

                      <IconActionButton label="Payment details">
                        <CreditCard className="h-4 w-4" />
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
            Showing 1–{adminOrders.length} of {adminOrders.length} orders
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

function PaymentPill({ status }: { status: string }) {
  const styles =
    status === "Paid"
      ? "bg-green-100 text-green-700"
      : status === "Pending"
      ? "bg-amber-100 text-amber-700"
      : "bg-red-100 text-red-700";

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles}`}>
      {status}
    </span>
  );
}

function OrderStatusPill({ status }: { status: string }) {
  const styles =
    status === "Delivered"
      ? "bg-green-100 text-green-700"
      : status === "Shipped"
      ? "bg-blue-100 text-blue-700"
      : status === "Processing"
      ? "bg-stone-100 text-stone-700"
      : "bg-amber-100 text-amber-700";

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

function IconActionLink({
  children,
  label,
  href,
}: {
  children: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Button
      asChild
      type="button"
      size="icon"
      variant="outline"
      className="rounded-full text-stone-700"
    >
      <Link href={href} aria-label={label}>
        {children}
      </Link>
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
