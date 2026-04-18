import { notFound } from "next/navigation";
import { getAdminBannerById } from "@/lib/db/queries/admin-content";
import EditBannerForm from "@/components/admin/edit-banner-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditBannerPage({ params }: PageProps) {
  const { id } = await params;
  const banner = await getAdminBannerById(id);

  if (!banner) {
    notFound();
  }

  return <EditBannerForm banner={banner} />;
}