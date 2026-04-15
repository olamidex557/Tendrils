import Link from "next/link";
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

const order = {
  id: "AJK-1002",
  customer: "Ada N.",
  email: "shopper@example.com",
  phone: "+234 801 234 5678",
  paymentStatus: "Paid",
  orderStatus: "Shipped",
  placedAt: "2026-04-14 10:24 AM",
  paymentMethod: "Paystack",
  address: "14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria",
  notes: "Please call before delivery.",
  subtotal: 89000,
  shipping: 5000,
  taxes: 0,
  total: 94000,
};

const orderItems = [
  {
    id: "PRD-001",
    name: "Wireless Earbuds",
    variant: "Black",
    quantity: 1,
    price: 45000,
    image:
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: "PRD-002",
    name: "Classic T-Shirt",
    variant: "White / M",
    quantity: 2,
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=600&q=80",
  },
];

export default function AdminOrderDetailsPage() {
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
              Order {order.id}
            </h2>

            <p className="mt-2 text-sm text-stone-600">
              Placed on {order.placedAt}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="rounded-full px-5">
              Mark as Shipped
            </Button>
            <Button className="rounded-full bg-black px-5 text-white hover:bg-black/90">
              Mark as Delivered
            </Button>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          <StatusPill status={order.orderStatus} kind="order" />
          <StatusPill status={order.paymentStatus} kind="payment" />
          <MetaPill label={`Payment: ${order.paymentMethod}`} />
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
              {orderItems.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-[1.25rem] border border-stone-200 p-4 md:flex-row 
md:items-center md:justify-between"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded-2xl object-cover bg-stone-100"
                    />

                    <div>
                      <p className="font-semibold text-black">{item.name}</p>
                      <p className="mt-1 text-sm text-stone-500">
                        Variant: {item.variant}
                      </p>
                      <p className="mt-1 text-xs text-stone-400">{item.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 text-sm md:min-w-[280px]">
                    <div>
                      <p className="text-stone-500">Qty</p>
                      <p className="mt-1 font-medium text-black">{item.quantity}</p>
                    </div>

                    <div>
                      <p className="text-stone-500">Price</p>
                      <p className="mt-1 font-medium text-black">
                        ₦{item.price.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-stone-500">Subtotal</p>
                      <p className="mt-1 font-semibold text-black">
                        ₦{(item.quantity * item.price).toLocaleString()}
                      </p>
                    </div>
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
                description="Customer successfully placed the order."
                active={true}
                last={false}
              />
              <TimelineRow
                title="Payment confirmed"
                description="Payment was successfully received."
                active={true}
                last={false}
              />
              <TimelineRow
                title="Order shipped"
                description="Package has left the fulfillment point."
                active={true}
                last={false}
              />
              <TimelineRow
                title="Delivered"
                description="Waiting for final delivery confirmation."
                active={false}
                last={true}
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
            <InfoRow
              icon={<User className="h-4 w-4 text-stone-500" />}
              label="Customer"
              value={order.customer}
            />
            <InfoRow
              icon={<Mail className="h-4 w-4 text-stone-500" />}
              label="Email"
              value={order.email}
            />
            <InfoRow
              icon={<Phone className="h-4 w-4 text-stone-500" />}
              label="Phone"
              value={order.phone}
            />
          </CardShell>

          <CardShell
            icon={<MapPin className="h-5 w-5 text-black" />}
            title="Shipping Address"
            subtitle="Delivery destination and notes."
          >
            <p className="text-sm leading-7 text-stone-600">{order.address}</p>

            <div className="mt-4 rounded-2xl bg-stone-50 p-4">
              <p className="text-sm font-medium text-black">Delivery Notes</p>
              <p className="mt-2 text-sm text-stone-600">
                {order.notes || "No delivery notes added."}
              </p>
            </div>
          </CardShell>

          <CardShell
            icon={<CreditCard className="h-5 w-5 text-black" />}
            title="Payment Summary"
            subtitle="Breakdown of charges and totals."
          >
            <SummaryLine label="Subtotal" value={`₦${order.subtotal.toLocaleString()}`} />
            <SummaryLine label="Shipping" value={`₦${order.shipping.toLocaleString()}`} />
            <SummaryLine label="Taxes" value={`₦${order.taxes.toLocaleString()}`} />
            <div className="mt-4 border-t border-stone-200 pt-4">
              <SummaryLine
                label="Total"
                value={`₦${order.total.toLocaleString()}`}
                strong
              />
            </div>
          </CardShell>

          <CardShell
            icon={<PackageCheck className="h-5 w-5 text-black" />}
            title="Admin Actions"
            subtitle="Quick controls for this order."
          >
            <div className="grid gap-3">
              <ActionButton label="Update Order Status" />
              <ActionButton label="Update Payment Status" />
              <ActionButton label="Send Customer Update" />
              <ActionButton label="Print Invoice" />
            </div>
          </CardShell>

          <CardShell
            icon={<Clock3 className="h-5 w-5 text-black" />}
            title="Activity"
            subtitle="Recent admin activity timeline."
          >
            <div className="space-y-3 text-sm text-stone-600">
              <p>• Order created and payment marked as paid.</p>
              <p>• Shipment label prepared.</p>
              <p>• Order status updated to shipped.</p>
            </div>
          </CardShell>
        </div>
      </div>
    </section>
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

function StatusPill({
  status,
  kind,
}: {
  status: string;
  kind: "order" | "payment";
}) {
  const styles =
    kind === "payment"
      ? status === "Paid"
        ? "bg-green-100 text-green-700"
        : status === "Pending"
        ? "bg-amber-100 text-amber-700"
        : "bg-red-100 text-red-700"
      : status === "Delivered"
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

function MetaPill({ label }: { label: string }) {
  return (
    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
      {label}
    </span>
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
      <span className={strong ? "text-base font-semibold text-black" : "text-sm text-stone-600"}>
        {label}
      </span>
      <span className={strong ? "text-base font-bold text-black" : "text-sm font-medium text-black"}>
        {value}
      </span>
    </div>
  );
}

function ActionButton({ label }: { label: string }) {
  return (
    <Button
      type="button"
      variant="outline"
      className="justify-start rounded-2xl px-4 py-6 text-left text-sm"
    >
      {label}
    </Button>
  );
}

function TimelineRow({
  title,
  description,
  active,
  last,
}: {
  title: string;
  description: string;
  active: boolean;
  last: boolean;
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
