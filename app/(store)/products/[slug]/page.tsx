import { notFound } from "next/navigation";
import BrandStrip from "@/components/store/brand-strip";
import ProductDetailsView from "@/components/store/product-details-view";
import { getProductBySlug } from "@/lib/db/queries/storefront";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Ajike+",
    };
  }

  return {
    title: `${product.name} | Ajike+`,
    description:
      product.shortDescription ??
      product.description ??
      `Shop ${product.name} on Ajike+.`,
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <main>
      <ProductDetailsView product={product} />
      <BrandStrip />
    </main>
  );
}