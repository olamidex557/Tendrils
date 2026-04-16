import ProductsHero from "@/components/store/products-hero";
import BrandStrip from "@/components/store/brand-strip";
import ProductsPageView from "@/components/store/products-page-view";
import { getPublishedProducts, getVisibleCategories } from "@/lib/db/queries/storefront";

export default async function ProductsPage() {
  const [products, categories] = await Promise.all([
    getPublishedProducts(),
    getVisibleCategories(),
  ]);

  const categoryOptions = ["All", ...categories.map((category) => category.name)];

  return (
    <main>
      <ProductsHero />
      <ProductsPageView
        products={products}
        categoryOptions={categoryOptions}
      />
      <BrandStrip />
    </main>
  );
}
