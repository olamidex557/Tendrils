import ProductsToolbar from "@/components/admin/products-toolbar";
import ProductsManagementTable from "@/components/admin/products-management-table";

export default function AdminProductsPage() {
  return (
    <section className="space-y-6">
      <ProductsToolbar />
      <ProductsManagementTable />
    </section>
  );
}
