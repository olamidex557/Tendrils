import CustomersToolbar from "@/components/admin/customers-toolbar";
import CustomersManagementTable from "@/components/admin/customers-management-table";

export default function AdminCustomersPage() {
  return (
    <section className="space-y-6">
      <CustomersToolbar />
      <CustomersManagementTable />
    </section>
  );
}
