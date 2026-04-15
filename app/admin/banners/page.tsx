import BannersToolbar from "@/components/admin/banners-toolbar";
import BannersManagementTable from "@/components/admin/banners-management-table";

export default function AdminBannersPage() {
  return (
    <section className="space-y-6">
      <BannersToolbar />
      <BannersManagementTable />
    </section>
  );
}
