import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  PackageCheck,
  Phone,
  ShoppingBag,
  Truck,
  User,
  Mail,
  Clock3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminOrderById } from "@/lib/db/queries/admin-order-details";
import { markOrderAsFulfilled } from "@/lib/actions/admin-orders";
import {
  getAdminPaymentStatusLabel,
  getAdminPaymentStatusTone,
} from "@/lib/payments/admin-status";

type PageProps = {
  params: Promise<{ id: string }>;
};

function money(value: number, currency = "NGN") {
  const symbol = currency === "NGN" ? "₦" : `${currency} `;
  return `${symbol}${Number(value).toLocaleString()}`;
}

function pill(status: string) {
  if (
    status === "paid" ||
    status === "completed" ||
    status === "fulfilled" ||
    status === "delivered"
  ) {
    return "bg-green-100 text-green-700";
  }

  if (
    status === "pending" ||
    status === "processing" ||
    status === "unfulfilled"
  ) {
    return "bg-amber-100 text-amber-700";
  }

  if (status === "failed" || status === "cancelled") {
    return "bg-red-100 text-red-700";
  }

  return "bg-stone-100 text-stone-700";
}

function formatStatus(status: string) {
  return status.replaceAll("_", " ");
}

export default async function AdminOrderDetailsPage({ params }: PageProps) {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) {
    notFound();
  }

  const orderDetails = order;
  const paymentLabel = getAdminPaymentStatusLabel(
    orderDetails.paymentStatus,
    orderDetails.createdAt
  );
  const paymentTone = getAdminPaymentStatusTone(
    orderDetails.paymentStatus,
    orderDetails.createdAt
  );

  async function fulfillAction() {
    "use server";
    await markOrderAsFulfilled(orderDetails.id);
  }

  return (
    <section className="space-y-6">
      <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Link
              href="/admin/orders"
              className="inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-black"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Link>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-black">
              Order {orderDetails.orderNumber}
            </h2>

            <p className="mt-2 text-sm text-stone-600">
              Placed on {new Date(orderDetails.createdAt).toLocaleString()}
            </p>
          </div>

          <form action={fulfillAction}>
            <Button
              type="submit"
              disabled={orderDetails.fulfillmentStatus === "fulfilled"}
              className="rounded-full bg-black px-5 text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PackageCheck className="mr-2 h-4 w-4" />
              {orderDetails.fulfillmentStatus === "fulfilled"
                ? "Already Fulfilled"
                : "Mark as Fulfilled"}
            </Button>
          </form>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <StatusPill
            label={`Order: ${formatStatus(orderDetails.status)}`}
            status={orderDetails.status}
          />
          <StatusPill
            label={`Payment: ${paymentLabel}`}
            status={paymentTone}
          />
          <StatusPill
            label={`Fulfillment: ${formatStatus(
              orderDetails.fulfillmentStatus
            )}`}
            status={orderDetails.fulfillmentStatus}
          />
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <CardShell
            icon={<ShoppingBag className="h-5 w-5 text-black" />}
            title="Order Items"
            subtitle="Products included in this order."
          >
            <div className="space-y-4">
              {orderDetails.items.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-[1.25rem] border border-stone-200 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-semibold text-black">
                      {item.productName}
                    </p>
                    <p className="mt-1 text-xs text-stone-400">
                      {item.productSlug ?? item.id}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-6 text-sm md:min-w-[280px]">
                    <MiniStat label="Qty" value={String(item.quantity)} />
                    <MiniStat
                      label="Price"
                      value={money(item.unitPrice, orderDetails.currency)}
                    />
                    <MiniStat
                      label="Subtotal"
                      value={money(item.lineTotal, orderDetails.currency)}
                      strong
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardShell>

          <CardShell
            icon={<Truck className="h-5 w-5 text-black" />}
            title="Fulfillment Timeline"
            subtitle="Track where this order currently stands."
          >
            <div className="space-y-5">
              <TimelineRow
                title="Order placed"
                description="Customer placed the order."
                active
              />
              <TimelineRow
                title="Payment confirmed"
                description="Payment has been received."
                active={orderDetails.paymentStatus === "paid"}
              />
              <TimelineRow
                title="Processing"
                description="Order is being prepared."
                active={["processing", "fulfilled"].includes(
                  orderDetails.fulfillmentStatus
                )}
              />
              <TimelineRow
                title="Fulfilled"
                description="Order has been delivered or completed."
                active={orderDetails.fulfillmentStatus === "fulfilled"}
                last
              />
            </div>
          </CardShell>
        </div>

        <div className="space-y-6">
          <CardShell
            icon={<User className="h-5 w-5 text-black" />}
            title="Customer Details"
            subtitle="Contact and customer identity."
          >
            <div className="space-y-3">
              <InfoRow
                icon={<User className="h-4 w-4 text-stone-500" />}
                label="Customer"
                value={orderDetails.customerName ?? "Guest Customer"}
              />
              <InfoRow
                icon={<Mail className="h-4 w-4 text-stone-500" />}
                label="Email"
                value={orderDetails.customerEmail ?? "No email"}
              />
              <InfoRow
                icon={<Phone className="h-4 w-4 text-stone-500" />}
                label="Phone"
                value={orderDetails.customerPhone ?? "No phone"}
              />
            </div>
          </CardShell>

          <CardShell
            icon={<MapPin className="h-5 w-5 text-black" />}
            title={
              orderDetails.fulfillmentMethod === "pickup"
                ? "Pickup"
                : "Shipping Address"
            }
            subtitle={
              orderDetails.fulfillmentMethod === "pickup"
                ? "Customer chose pickup at checkout."
                : "Delivery destination."
            }
          >
            <p className="text-sm leading-7 text-stone-600">
              {orderDetails.shippingAddress ?? "No address provided."}
            </p>
          </CardShell>

          <CardShell
            icon={<CreditCard className="h-5 w-5 text-black" />}
            title="Payment Summary"
            subtitle="Breakdown of charges and totals."
          >
            <SummaryLine
              label="Subtotal"
              value={money(orderDetails.subtotal, orderDetails.currency)}
            />
            <SummaryLine
              label={
                orderDetails.fulfillmentMethod === "pickup"
                  ? "Pickup"
                  : "Shipping"
              }
              value={
                orderDetails.fulfillmentMethod === "pickup"
                  ? "Free"
                  : money(orderDetails.shippingFee, orderDetails.currency)
              }
            />
            <SummaryLine
              label="Discount"
              value={money(orderDetails.discountAmount, orderDetails.currency)}
            />
            <div className="mt-4 border-t border-stone-200 pt-4">
              <SummaryLine
                label="Total"
                value={money(orderDetails.total, orderDetails.currency)}
                strong
              />
            </div>
          </CardShell>

          <CardShell
            icon={<Clock3 className="h-5 w-5 text-black" />}
            title="Activity"
            subtitle="Current order state."
          >
            <div className="space-y-3 text-sm text-stone-600">
              <p>• Order status: {formatStatus(orderDetails.status)}</p>
              <p>
                • Payment status: {paymentLabel}
              </p>
              <p>
                • Fulfillment status:{" "}
                {formatStatus(orderDetails.fulfillmentStatus)}
              </p>
              <p>
                • Method: {formatStatus(orderDetails.fulfillmentMethod)}
              </p>
            </div>
          </CardShell>
        </div>
      </div>
    </section>
  );
}

function StatusPill({ label, status }: { label: string; status: string }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${pill(
        status
      )}`}
    >
      {label}
    </span>
  );
}

function MiniStat({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div>
      <p className="text-stone-500">{label}</p>
      <p
        className={`mt-1 ${
          strong ? "font-semibold" : "font-medium"
        } text-black`}
      >
        {value}
      </p>
    </div>
  );
}

function CardShell({
  icon,
  title,
  subtitle,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-3">
        {icon ? (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100">
            {icon}
          </div>
        ) : null}
        <div>
          <h3 className="text-xl font-semibold text-black">{title}</h3>
          <p className="mt-1 text-sm text-stone-600">{subtitle}</p>
        </div>
      </div>

      <div className="mt-6">{children}</div>
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
        <p className="text-xs uppercase tracking-wide text-stone-500">
          {label}
        </p>
        <p className="mt-1 text-sm font-medium text-black">{value}</p>
      </div>
    </div>
  );
}

function SummaryLine({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span
        className={
          strong ? "text-base font-semibold text-black" : "text-sm text-stone-600"
        }
      >
        {label}
      </span>
      <span
        className={
          strong ? "text-base font-bold text-black" : "text-sm font-medium text-black"
        }
      >
        {value}
      </span>
    </div>
  );
}

function TimelineRow({
  title,
  description,
  active,
  last = false,
}: {
  title: string;
  description: string;
  active: boolean;
  last?: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={`h-4 w-4 rounded-full ${
            active ? "bg-black" : "bg-stone-300"
          }`}
        />
        {!last ? (
          <div
            className={`mt-2 w-px flex-1 ${
              active ? "bg-black/30" : "bg-stone-200"
            }`}
          />
        ) : null}
      </div>

      <div className="pb-2">
        <h4 className="text-sm font-semibold text-black">{title}</h4>
        <p className="mt-1 text-sm leading-6 text-stone-600">{description}</p>
      </div>
    </div>
  );
}
