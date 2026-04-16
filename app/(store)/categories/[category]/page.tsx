import { notFound } from "next/navigation";
import CategoryHero from "@/components/store/category-hero";
import CategoryProductsView from "@/components/store/category-products-view";
import BrandStrip from "@/components/store/brand-strip";
import {
  getCategoryBySlug,
  getPublishedProductsByCategorySlug,
} from "@/lib/db/queries/storefront";

type PageProps = {
  params: {
    category: string;
  };
};

export async function generateMetadata({ params }: PageProps) {
  const category = await getCategoryBySlug(params.category);

  if (!category) {
    return {
      title: "Category Not Found | Ajike+",
    };
  }

  return {
    title: `${category.name} | Ajike+`,
    description: category.description ?? `Browse ${category.name} products on Ajike+.`,
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const [category, products] = await Promise.all([
    getCategoryBySlug(params.category),
    getPublishedProductsByCategorySlug(params.category),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <main>
      <CategoryHero
        name={category.name}
        description={category.description}
        image={category.imageUrl}
      />

      <CategoryProductsView
        categoryName={category.name}
        products={products}
      />

      <BrandStrip />
    </main>
  );
}