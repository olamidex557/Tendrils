import { notFound } from "next/navigation";
import { getAdminCategoryById } from "@/lib/db/queries/admin-content";
import EditCategoryForm from "@/components/admin/edit-category-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const category = await getAdminCategoryById(id);

  if (!category) {
    notFound();
  }

  return <EditCategoryForm category={category} />;
}