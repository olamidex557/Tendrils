import { notFound } from "next/navigation";
import EditProductForm from "@/components/admin/edit-product-form";
import { getAdminProductById } from "@/lib/db/queries/admin-products";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const product = await getAdminProductById(id);

  if (!product) {
    notFound();
  }

  return <EditProductForm product={product} />;
}