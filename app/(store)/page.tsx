export const dynamic = "force-dynamic";

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

  const heroBanners = banners
    .filter((banner) => banner.placement === "homepage_hero")
    .slice(0, 3);

  return (
    <main>
      <HomepageHero banners={heroBanners} />
      <HomepageCategories categories={categories} />
      <HomepageProducts products={products} />
      <BrandStrip />
    </main>
  );
}