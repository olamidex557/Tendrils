import WishlistHero from "@/components/store/wishlist-hero";
import WishlistGrid from "@/components/store/wishlist-grid";
import BrandStrip from "@/components/store/brand-strip";

export default function WishlistPage() {
  return (
    <main>
      <WishlistHero />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <WishlistGrid />
      </section>

      <BrandStrip />
    </main>
  );
}
