import CategoriesPageHero from "@/components/store/categories-page-hero";
import CategoriesGrid from "@/components/store/categories-grid";
import BrandStrip from "@/components/store/brand-strip";
import { getVisibleCategories } from "@/lib/db/queries/storefront";

export default async function CategoriesPage() {
  const categories = await getVisibleCategories();

  return (
    <main>
      <CategoriesPageHero />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <CategoriesGrid categories={categories} />
      </section>

      <BrandStrip />
    </main>
  );
}