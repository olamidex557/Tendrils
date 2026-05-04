import { getAdminPayments } from "@/lib/db/queries/admin-commerce";

function money(amount: number, currency: string) {
  const symbol = currency === "NGN" ? "₦" : `${currency} `;
  return `${symbol}${amount.toLocaleString()}`;
}

function pill(status: string) {
  if (status === "success") return "bg-green-100 text-green-700";
  if (status === "pending") return "bg-amber-100 text-amber-700";
  if (["abandoned", "amount_mismatch", "failed"].includes(status)) {
    return "bg-red-100 text-red-700";
  }
  return "bg-stone-100 text-stone-700";
}

function label(payment: { status: string; paystackStatus: string | null }) {
  if (payment.status === "failed" && payment.paystackStatus === "abandoned") {
    return "Payment abandoned";
  }

  return payment.status.replaceAll("_", " ");
}

export default async function AdminPaymentsPage() {
  const payments = await getAdminPayments();

  return (
    <section className="space-y-6">
      <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
        <p className="text-sm text-stone-500">Commerce</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
          Payments
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Live payment records from Supabase.
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-black">No payments yet</h2>
          <p className="mt-2 text-sm text-stone-500">
            Payment records will appear here once Paystack verification is wired.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-sm text-stone-500">
                  <th className="px-6 py-4 font-medium">Reference</th>
                  <th className="px-6 py-4 font-medium">Provider</th>
                  <th className="px-6 py-4 font-medium">Order</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Amount</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Paid At</th>
                </tr>
              </thead>

              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-stone-100">
                    <td className="px-6 py-5">
                      <p className="font-semibold text-black">{payment.reference}</p>
                    </td>

                    <td className="px-6 py-5 text-sm capitalize text-stone-600">
                      {payment.provider}
                    </td>

                    <td className="px-6 py-5 text-sm text-stone-600">
                      {payment.orderNumber ?? "—"}
                    </td>

                    <td className="px-6 py-5 text-sm text-stone-600">
                      {payment.customerName ?? "—"}
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-black">
                      {money(payment.amount, payment.currency)}
                    </td>

                    <td className="px-6 py-5">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${pill(payment.paystackStatus ?? payment.status)}`}>
                        {label(payment)}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-stone-600">
                      {payment.paidAt
                        ? new Date(payment.paidAt).toLocaleString()
                        : "—"}
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
