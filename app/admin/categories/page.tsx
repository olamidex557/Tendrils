import CategoriesToolbar from "@/components/admin/categories-toolbar";
import CategoriesManagementTable from "@/components/admin/categories-management-table";

export default function AdminCategoriesPage() {
  return (
    <section className="space-y-6">
      <CategoriesToolbar />
      <CategoriesManagementTable />
    </section>
  );
}
