"use client";

import Link from "next/link";
import { Eye, CreditCard, ReceiptText, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

const payments = [
  {
    id: "PAY-001",
    orderId: "AJK-1001",
    customer: "Olamide",
    method: "Paystack",
    channel: "Card",
    reference: "PSK_84JD92KLM",
    amount: 145000,
    status: "Paid",
    date: "2026-04-14",
  },
  {
    id: "PAY-002",
    orderId: "AJK-1002",
    customer: "Ada",
    method: "Paystack",
    channel: "Transfer",
    reference: "PSK_28LMX11PQ",
    amount: 89000,
    status: "Pending",
    date: "2026-04-14",
  },
  {
    id: "PAY-003",
    orderId: "AJK-1003",
    customer: "David",
    method: "Paystack",
    channel: "Card",
    reference: "PSK_74KLP20ZA",
    amount: 42000,
    status: "Paid",
    date: "2026-04-13",
  },
  {
    id: "PAY-004",
    orderId: "AJK-1004",
    customer: "Sarah",
    method: "Paystack",
    channel: "Card",
    reference: "PSK_91ABC76LM",
    amount: 199000,
    status: "Paid",
    date: "2026-04-13",
  },
  {
    id: "PAY-005",
    orderId: "AJK-1005",
    customer: "Femi",
    method: "Paystack",
    channel: "Bank",
    reference: "PSK_53QWE87RT",
    amount: 67000,
    status: "Failed",
    date: "2026-04-12",
  },
];

export default function PaymentsManagementTable() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Total Transactions" value="517" subtitle="Across all orders" />
        <SummaryCard title="Successful Payments" value="468" subtitle="Completed payments" />
        <SummaryCard title="Pending Payments" value="21" subtitle="Awaiting confirmation" />
        <SummaryCard title="Failed Payments" value="28" subtitle="Needs review" danger />
      </div>

      <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] text-left">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-sm text-stone-500">
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Order</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Method</th>
                <th className="px-6 py-4 font-medium">Reference</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id} className="border-b border-stone-100">
                  <td className="px-6 py-5">
                    <div>
                      <p className="font-semibold text-black">{payment.id}</p>
                      <p className="mt-1 text-xs text-stone-500">{payment.channel}</p>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-sm font-medium text-black">
                    {payment.orderId}
                  </td>

                  <td className="px-6 py-5 text-sm text-stone-600">
                    {payment.customer}
                  </td>

                  <td className="px-6 py-5">
                    <MethodPill method={payment.method} />
                  </td>

                  <td className="px-6 py-5 text-sm text-stone-600">
                    {payment.reference}
                  </td>

                  <td className="px-6 py-5 text-sm font-medium text-black">
                    ₦{payment.amount.toLocaleString()}
                  </td>

                  <td className="px-6 py-5">
                    <StatusPill status={payment.status} />
                  </td>

                  <td className="px-6 py-5 text-sm text-stone-600">
                    {payment.date}
                  </td>

                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                      <IconActionLink
                        href={`/admin/payments/${payment.reference}`}
                        label="View payment"
                      >
                        <Eye className="h-4 w-4" />
                      </IconActionLink>

                      <IconActionButton label="View receipt">
                        <ReceiptText className="h-4 w-4" />
                      </IconActionButton>

                      <IconActionButton label="Retry verification">
                        <RefreshCcw className="h-4 w-4" />
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
            Showing 1–{payments.length} of {payments.length} payments
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
  danger = false,
}: {
  title: string;
  value: string;
  subtitle: string;
  danger?: boolean;
}) {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
      <p className="text-sm text-stone-500">{title}</p>
      <h3 className={`mt-2 text-3xl font-semibold tracking-tight ${danger ? "text-red-600" : "text-black"}`}>
        {value}
      </h3>
      <p className="mt-2 text-sm text-stone-500">{subtitle}</p>
    </div>
  );
}

function MethodPill({ method }: { method: string }) {
  return (
    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
      {method}
    </span>
  );
}

function StatusPill({ status }: { status: string }) {
  const styles =
    status === "Paid"
      ? "bg-green-100 text-green-700"
      : status === "Pending"
      ? "bg-amber-100 text-amber-700"
      : status === "Refunded"
      ? "bg-blue-100 text-blue-700"
      : "bg-red-100 text-red-700";

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
