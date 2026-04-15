import CheckoutHero from "@/components/store/checkout-hero";
import CheckoutForm from "@/components/store/checkout-form";
import CheckoutSummary from "@/components/store/checkout-summary";
import BrandStrip from "@/components/store/brand-strip";

export default function CheckoutPage() {
  return (
    <main>
      <CheckoutHero />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
          <CheckoutForm />
          <CheckoutSummary />
        </div>
      </section>

      <BrandStrip />
    </main>
  );
}
