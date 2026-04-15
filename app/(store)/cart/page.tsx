import CartHero from "@/components/store/cart-hero";
import CartTable from "@/components/store/cart-table";
import CartSummary from "@/components/store/cart-summary";
import BrandStrip from "@/components/store/brand-strip";

export default function CartPage() {
  return (
    <main>
      <CartHero />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr] lg:items-start">
          <CartTable />
          <CartSummary />
        </div>
      </section>

      <BrandStrip />
    </main>
  );
}