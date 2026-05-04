import ProductsHero from "@/components/store/products-hero";
import BrandStrip from "@/components/store/brand-strip";
import ProductsPageView from "@/components/store/products-page-view";
import { getPublishedProducts, getVisibleCategories } from "@/lib/db/queries/storefront";

type ProductsPageProps = {
  searchParams: Promise<{ search?: string | string[] }>;
};

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const search = (await searchParams).search;
  const initialSearch = Array.isArray(search) ? search[0] ?? "" : search ?? "";

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
        initialSearch={initialSearch}
      />
      <BrandStrip />
    </main>
  );
}
