"use client";

import { useState } from "react";
import { Search, PackageCheck, Clock3, Truck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type OrderStatus = "processing" | "shipped" | "delivered";

type MockOrder = {
  orderId: string;
  email: string;
  customer: string;
  status: OrderStatus;
  estimatedDelivery: string;
  items: number;
  total: number;
};

const mockOrders: MockOrder[] = [
  {
    orderId: "AJK-1001",
    email: "customer@example.com",
    customer: "Olamide",
    status: "processing",
    estimatedDelivery: "2026-04-20",
    items: 3,
    total: 145000,
  },
  {
    orderId: "AJK-1002",
    email: "shopper@example.com",
    customer: "Ada",
    status: "shipped",
    estimatedDelivery: "2026-04-18",
    items: 2,
    total: 89000,
  },
  {
    orderId: "AJK-1003",
    email: "buyer@example.com",
    customer: "David",
    status: "delivered",
    estimatedDelivery: "2026-04-14",
    items: 1,
    total: 42000,
  },
];

export default function OrderTrackingForm() {
  const [orderId, setOrderId] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<MockOrder | null>(null);
  const [searched, setSearched] = useState(false);

  function handleTrackOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const found = mockOrders.find(
      (order) =>
        order.orderId.toLowerCase() === orderId.trim().toLowerCase() &&
        order.email.toLowerCase() === email.trim().toLowerCase()
    );

    setResult(found ?? null);
    setSearched(true);
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] bg-stone-50 p-6 md:p-8">
          <h2 className="text-2xl font-semibold tracking-tight text-black">
            Find your order
          </h2>
          <p className="mt-3 text-sm leading-7 text-stone-600">
            Enter your order ID and the email address used during checkout to
            view your order status.
          </p>

          <form onSubmit={handleTrackOrder} className="mt-8 space-y-4">
            <div>
              <label htmlFor="orderId" className="mb-2 block text-sm font-medium text-black">
                Order ID
              </label>
              <input
                id="orderId"
                type="text"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                placeholder="e.g. AJK-1002"
                className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-black/30"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-black">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. shopper@example.com"
                className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition focus:border-black/30"
                required
              />
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-full bg-black text-white hover:bg-black/90"
            >
              <Search className="mr-2 h-4 w-4" />
              Track Order
            </Button>
          </form>

          <div className="mt-8 rounded-[1.5rem] border border-black/5 bg-white p-5">
            <p className="text-sm font-semibold text-black">Try demo values</p>
            <div className="mt-3 space-y-2 text-sm text-stone-600">
              <p>Order ID: <span className="font-medium text-black">AJK-1001</span> | Email: customer@example.com</p>
              <p>Order ID: <span className="font-medium text-black">AJK-1002</span> | Email: shopper@example.com</p>
              <p>Order ID: <span className="font-medium text-black">AJK-1003</span> | Email: buyer@example.com</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm md:p-8">
          {!searched ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-stone-100">
                <PackageCheck className="h-8 w-8 text-stone-700" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-black">
                Order status will appear here
              </h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-stone-600">
                Search with your order ID and email to see the latest delivery
                progress and summary.
              </p>
            </div>
          ) : !result ? (
            <div className="flex h-full min-h-[320px] flex-col items-center justify-center text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <Search className="h-8 w-8 text-red-500" />
              </div>
              <h3 className="mt-5 text-2xl font-semibold text-black">
                Order not found
              </h3>
              <p className="mt-3 max-w-md text-sm leading-7 text-stone-600">
                We could not find an order that matches those details. Double-check
                your order ID and email, then try again.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-stone-500">
                    Order Summary
                  </p>
                  <h3 className="mt-2 text-3xl font-semibold tracking-tight text-black">
                    {result.orderId}
                  </h3>
                  <p className="mt-2 text-sm text-stone-600">
                    Customer: {result.customer}
                  </p>
                </div>

                <StatusPill status={result.status} />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <InfoCard label="Items" value={`${result.items}`} />
                <InfoCard label="Total" value={`₦${result.total.toLocaleString()}`} />
                <InfoCard label="Estimated Delivery" value={result.estimatedDelivery} />
              </div>

              <div className="rounded-[1.5rem] bg-stone-50 p-5">
                <h4 className="text-lg font-semibold text-black">Tracking progress</h4>

                <div className="mt-6 space-y-5">
                  <TimelineRow
                    icon={<Clock3 className="h-5 w-5" />}
                    title="Order placed"
                    description="Your order has been received and is being prepared."
                    active={true}
                  />

                  <TimelineRow
                    icon={<Truck className="h-5 w-5" />}
                    title="Shipped"
                    description="Your order has left our processing center."
                    active={result.status === "shipped" || result.status === "delivered"}
                  />

                  <TimelineRow
                    icon={<CheckCircle2 className="h-5 w-5" />}
                    title="Delivered"
                    description="Your package has arrived successfully."
                    active={result.status === "delivered"}
                    last
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StatusPill({ status }: { status: OrderStatus }) {
  const styles =
    status === "processing"
      ? "bg-amber-100 text-amber-800"
      : status === "shipped"
      ? "bg-blue-100 text-blue-800"
      : "bg-green-100 text-green-800";

  return (
    <span className={`rounded-full px-4 py-2 text-sm font-medium capitalize ${styles}`}>
      {status}
    </span>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.25rem] border border-black/5 bg-stone-50 p-4">
      <p className="text-xs uppercase tracking-wide text-stone-500">{label}</p>
      <p className="mt-2 text-base font-semibold text-black">{value}</p>
    </div>
  );
}

function TimelineRow({
  icon,
  title,
  description,
  active,
  last = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  active: boolean;
  last?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full ${
            active ? "bg-black text-white" : "bg-white text-stone-400"
          }`}
        >
          {icon}
        </div>
        {!last ? (
          <div className={`mt-2 w-px flex-1 ${active ? "bg-black/30" : "bg-stone-200"}`} />
        ) : null}
      </div>

      <div className="pb-2">
        <h5 className="text-base font-semibold text-black">{title}</h5>
        <p className="mt-1 text-sm leading-6 text-stone-600">{description}</p>
      </div>
    </div>
  );
}