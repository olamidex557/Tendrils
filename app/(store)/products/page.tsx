import ProductsHero from "@/components/store/products-hero";
import ProductsFilters from "@/components/store/products-filters";
import ProductsGrid from "@/components/store/products-grid";
import BrandStrip from "@/components/store/brand-strip";

export default function ProductsPage() {
  return (
    <main>
      <ProductsHero />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          
          {/* Sidebar */}
          <ProductsFilters />

          {/* Products */}
          <ProductsGrid />
        </div>
      </section>

      <BrandStrip />
    </main>
  );
}