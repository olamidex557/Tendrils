import HeroV2 from "@/components/store/hero-v2";
import CategorySlider from "@/components/store/category-slider";
import CategoriesShowcase from "@/components/store/category-showcase";
import FeaturedProductsSection from "@/components/store/featured-products-section";
import ProductHighlightSection from "@/components/store/product-highlight-section";
import BrandStrip from "@/components/store/brand-strip";

export default function HomePage() {
  return (
    <main>
      <HeroV2 />
      <CategorySlider />
      <CategoriesShowcase />
      <FeaturedProductsSection />
      <ProductHighlightSection />
      <BrandStrip />
    </main>
  );
}