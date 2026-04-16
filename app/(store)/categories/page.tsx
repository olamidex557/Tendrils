import CategoriesPageHero from "@/components/store/categories-page-hero";
import CategoriesGrid from "@/components/store/categories-grid";
import BrandStrip from "@/components/store/brand-strip";

export default function CategoriesPage() {
  return (
    <main>
      <CategoriesPageHero />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <CategoriesGrid />
      </section>

      <BrandStrip />
    </main>
  );
}
