import { getAdminCustomers } from "@/lib/db/queries/admin-commerce";

function money(amount: number) {
  return `₦${amount.toLocaleString()}`;
}

function pill(status: string) {
  if (status === "vip") return "bg-amber-100 text-amber-700";
  if (status === "active") return "bg-green-100 text-green-700";
  return "bg-stone-100 text-stone-700";
}

export default async function AdminCustomersPage() {
  const customers = await getAdminCustomers();

  return (
    <section className="space-y-6">
      <div className="rounded-[1.5rem] border border-black/5 bg-white p-5 shadow-sm">
        <p className="text-sm text-stone-500">Commerce</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-black">
          Customers
        </h1>
        <p className="mt-2 text-sm text-stone-600">
          Live customer records from Supabase.
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
          <h2 className="text-2xl font-semibold text-black">No customers yet</h2>
          <p className="mt-2 text-sm text-stone-500">
            Customer records will appear here once checkout creates them.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1020px] text-left">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-sm text-stone-500">
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Phone</th>
                  <th className="px-6 py-4 font-medium">Orders</th>
                  <th className="px-6 py-4 font-medium">Spent</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id} className="border-b border-stone-100">
                    <td className="px-6 py-5">
                      <p className="font-semibold text-black">{customer.fullName}</p>
                      <p className="mt-1 text-xs text-stone-500">
                        {customer.email ?? "No email"}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-stone-600">
                      {customer.phone ?? "—"}
                    </td>

                    <td className="px-6 py-5 text-sm text-stone-600">
                      {customer.totalOrders}
                    </td>

                    <td className="px-6 py-5 text-sm font-medium text-black">
                      {money(customer.totalSpent)}
                    </td>

                    <td className="px-6 py-5">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize 
${pill(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-sm text-stone-600">
                      {new Date(customer.createdAt).toLocaleDateString()}
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
