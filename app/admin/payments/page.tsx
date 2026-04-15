import PaymentsToolbar from "@/components/admin/payments-toolbar";
import PaymentsManagementTable from "@/components/admin/payments-management-table";

export default function AdminPaymentsPage() {
  return (
    <section className="space-y-6">
      <PaymentsToolbar />
      <PaymentsManagementTable />
    </section>
  );
}
