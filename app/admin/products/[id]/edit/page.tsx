import { notFound } from "next/navigation";
import { getAdminProductById } from "@/lib/db/queries/admin-products";
import EditProductForm from "@/components/admin/edit-product-form";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) {
    notFound();
  }

  return <EditProductForm product={product} />;
}