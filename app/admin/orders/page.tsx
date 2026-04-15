import OrdersToolbar from "@/components/admin/orders-toolbar";
import OrdersManagementTable from "@/components/admin/orders-management-table";

export default function AdminOrdersPage() {
  return (
    <section className="space-y-6">
      <OrdersToolbar />
      <OrdersManagementTable />
    </section>
  );
}
