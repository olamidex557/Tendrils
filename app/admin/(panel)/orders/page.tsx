import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAdminOrders } from "@/lib/db/queries/admin-commerce";

function formatMoney(amount: number, currency: string) {
  const symbol = currency === "NGN" ? "₦" : `${currency} `;
  return `${symbol}${Number(amount).toLocaleString()}`;
}

function pill(status: string) {
  if (
    status === "paid" ||
    status === "completed" ||
    status === "delivered" ||
    status === "fulfilled"
  ) {
    return "bg-green-100 text-green-700";
  }

  if (status === "pending" || status === "processing") {
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

export default async function AdminOrdersPage() {
  const orders = await getAdminOrders();

  return (
    <section className="space-y-6">
      <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
        <p className="text-sm text-stone-500">Commerce</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
          Orders
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Manage paid orders, fulfillment progress, and customer delivery status.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-black">No orders yet</h2>
          <p className="mt-2 text-sm text-stone-500">
            Orders will appear here once customers complete checkout.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1120px] text-left">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-sm text-stone-500">
                  <th className="px-6 py-4 font-medium">Order</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Order Status</th>
                  <th className="px-6 py-4 font-medium">Payment</th>
                  <th className="px-6 py-4 font-medium">Fulfillment</th>
                  <th className="px-6 py-4 font-medium">Created</th>
                  <th className="px-6 py-4 font-medium">Action</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-stone-100">
                    <td className="px-6 py-5">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-semibold text-black underline-offset-4 transition hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm font-medium text-black">
                        {order.customerName ?? "Guest Customer"}
                      </p>
                      <p className="mt-1 text-xs text-stone-500">
                        {order.customerEmail ?? "No email"}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-black">
                      {formatMoney(order.total, order.currency)}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${pill(
                          order.status
                        )}`}
                      >
                        {formatStatus(order.status)}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${pill(
                          order.paymentStatus
                        )}`}
                      >
                        {formatStatus(order.paymentStatus)}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${pill(
                          order.fulfillmentStatus
                        )}`}
                      >
                        {formatStatus(order.fulfillmentStatus)}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-stone-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>

                    <td className="px-6 py-5">
                      <Button
                        asChild
                        variant="outline"
                        size="icon"
                        className="rounded-full"
                      >
                        <Link
                          href={`/admin/orders/${order.id}`}
                          aria-label="View order"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
