"use client";

import { useState } from "react";
import {
  PackageSearch,
  Search,
  Truck,
  CreditCard,
  MapPin,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

type TrackedOrder = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  currency: string;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  shippingName: string | null;
  shippingEmail: string | null;
  shippingPhone: string | null;
  shippingAddress: string | null;
  createdAt: string;
  items: {
    id: string;
    productName: string;
    productSlug: string | null;
    unitPrice: number;
    quantity: number;
    lineTotal: number;
    variantLabel: string | null;
  }[];
};

function money(amount: number, currency: string) {
  const symbol = currency === "NGN" ? "₦" : `${currency} `;
  return `${symbol}${amount.toLocaleString()}`;
}

function pill(status: string) {
  if (status === "paid" || status === "delivered" || status === "fulfilled") {
    return "bg-green-100 text-green-700";
  }

  if (status === "pending" || status === "processing" || status === "unfulfilled") {
    return "bg-amber-100 text-amber-700";
  }

  if (status === "failed" || status === "cancelled" || status === "refunded") {
    return "bg-red-100 text-red-700";
  }

  return "bg-stone-100 text-stone-700";
}

export default function OrderTrackingPage() {
  const [form, setForm] = useState({
    orderNumber: "",
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setOrder(null);

    try {
      const response = await fetch("/api/order-tracking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNumber: form.orderNumber,
          email: form.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Unable to track order.");
      }

      setOrder(data.order);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to track order.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-[100svh] bg-stone-50 px-4 py-10 md:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm md:p-10"
        >
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-stone-100 px-4 py-2 text-xs font-medium 
uppercase tracking-[0.18em] text-stone-600">
              <PackageSearch className="h-4 w-4" />
              Track Your Order
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-black md:text-5xl">
              Order tracking made simple
            </h1>
            <p className="mt-4 text-sm leading-7 text-stone-600 md:text-base">
              Enter your order number and the email used during checkout to view your latest order status and payment 
progress.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 grid gap-4 md:grid-cols-[1fr_1fr_auto]"
            >
              <Field
                label="Order Number"
                name="orderNumber"
                value={form.orderNumber}
                onChange={handleChange}
                placeholder="e.g. AJK-1776545568154"
              />
              <Field
                label="Email Address"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                type="email"
              />
              <div className="flex items-end">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 w-full rounded-full bg-black px-6 text-white hover:bg-black/90 md:w-auto"
                >
                  <Search className="mr-2 h-4 w-4" />
                  {isLoading ? "Checking..." : "Track Order"}
                </Button>
              </div>
            </form>

            {error ? (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}
          </div>
        </motion.section>

        {order ? (
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="grid gap-6 lg:grid-cols-[1.08fr_0.92fr]"
          >
            <div className="space-y-6">
              <Card title="Order Overview" subtitle="Live order details from your purchase record.">
                <div className="grid gap-4 md:grid-cols-3">
                  <StatusBox label="Order Status" value={order.status} />
                  <StatusBox label="Payment Status" value={order.paymentStatus} />
                  <StatusBox label="Fulfillment" value={order.fulfillmentStatus} />
                </div>

                <div className="mt-6 rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Order Number
                  </p>
                  <p className="mt-2 text-lg font-semibold text-black">
                    {order.orderNumber}
                  </p>
                  <p className="mt-2 text-sm text-stone-500">
                    Placed on {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              </Card>

              <Card title="Order Items" subtitle="Products included in this order.">
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                        <div>
                          <p className="text-base font-semibold text-black">
                            {item.productName}
                          </p>
                          <p className="mt-1 text-sm text-stone-500">
                            Qty: {item.quantity}
                            {item.variantLabel ? ` • ${item.variantLabel}` : ""}
                          </p>
                        </div>

                        <div className="text-left md:text-right">
                          <p className="text-sm text-stone-500">
                            Unit: {money(item.unitPrice, order.currency)}
                          </p>
                          <p className="mt-1 text-base font-semibold text-black">
                            {money(item.lineTotal, order.currency)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <Card title="Delivery Information" subtitle="Shipping details provided during checkout.">
                <InfoRow icon={<MapPin className="h-5 w-5 text-black" />} label="Name" value={order.shippingName || "—"} 
/>
                <InfoRow icon={<CheckCircle2 className="h-5 w-5 text-black" />} label="Email" value={order.shippingEmail 
|| "—"} />
                <InfoRow icon={<Truck className="h-5 w-5 text-black" />} label="Phone" value={order.shippingPhone || 
"—"} />
                <div className="rounded-[1.5rem] bg-stone-50 p-4">
                  <p className="text-sm font-medium text-black">Address</p>
                  <p className="mt-2 text-sm leading-7 text-stone-600">
                    {order.shippingAddress || "—"}
                  </p>
                </div>
              </Card>

              <Card title="Payment Summary" subtitle="Breakdown of your order total.">
                <SummaryRow label="Subtotal" value={money(order.subtotal, order.currency)} />
                <SummaryRow label="Shipping Fee" value={money(order.shippingFee, order.currency)} />
                <SummaryRow label="Discount" value={money(order.discountAmount, order.currency)} />
                <SummaryRow
                  label="Total"
                  value={money(order.totalAmount, order.currency)}
                  bold
                />

                <div className="mt-5 rounded-[1.5rem] border border-stone-200 bg-stone-50 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                      <CreditCard className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-black">Payment Status</p>
                      <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium capitalize 
${pill(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </motion.section>
        ) : null}
      </div>
    </main>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-black/5 bg-white p-6 shadow-sm md:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-black">{title}</h2>
      <p className="mt-2 text-sm text-stone-600">{subtitle}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-black">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-12 w-full rounded-2xl border border-stone-200 bg-white px-4 text-sm outline-none transition 
focus:border-black/30"
      />
    </div>
  );
}

function StatusBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[1.5rem] bg-stone-50 p-4">
      <p className="text-xs uppercase tracking-[0.18em] text-stone-500">{label}</p>
      <p className="mt-3 text-base font-semibold capitalize text-black">
        {value.replaceAll("_", " ")}
      </p>
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
    <div className="flex items-start gap-3 rounded-[1.5rem] bg-stone-50 p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-black">{label}</p>
        <p className="mt-1 text-sm text-stone-600">{value}</p>
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-stone-50 px-4 py-3">
      <span className={`text-sm ${bold ? "font-semibold text-black" : "text-stone-600"}`}>
        {label}
      </span>
      <span className={`text-sm ${bold ? "font-semibold text-black" : "text-stone-700"}`}>
        {value}
      </span>
    </div>
  );
}
