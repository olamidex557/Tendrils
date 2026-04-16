import BrandStrip from "@/components/store/brand-strip";
import HomepageHero from "@/components/store/homepage-hero";
import HomepageCategories from "@/components/store/homepage-categories";
import HomepageProducts from "@/components/store/homepage-products";
import {
  getActiveBanners,
  getFeaturedCategories,
  getFeaturedProducts,
} from "@/lib/db/queries/storefront";

export default async function HomePage() {
  const [banners, categories, products] = await Promise.all([
    getActiveBanners(),
    getFeaturedCategories(),
    getFeaturedProducts(),
  ]);

  const heroBanner =
    banners.find((banner) =>
      banner.placement.toLowerCase().includes("hero")
    ) ?? banners[0] ?? null;

  return (
    <main>
      <HomepageHero banner={heroBanner} />
      <HomepageCategories categories={categories} />
      <HomepageProducts products={products} />
      <BrandStrip />
    </main>
  );
}
