import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StorefrontBanner } from "@/lib/db/queries/storefront";

type HomepageHeroProps = {
  banner: StorefrontBanner | null;
};

export default function HomepageHero({ banner }: HomepageHeroProps) {
  const title = banner?.title ?? "Shop smarter, faster, and better";
  const subtitle =
    banner?.subtitle ??
    "Discover top products, trusted categories, and everyday essentials designed to convert browsing into buying.";
  const ctaText = banner?.ctaText ?? "Shop Now";
  const ctaLink = banner?.ctaLink ?? "/products";
  const imageUrl =
    banner?.imageUrl ??
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1800&q=80";

  return (
    <section className="relative overflow-hidden bg-stone-950">
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={title}
          className="h-full w-full object-cover opacity-35"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 text-white md:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.25em] text-white/70">
            Conversion-first shopping
          </p>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            {title}
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 md:text-base">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild className="rounded-full bg-white px-6 text-black hover:bg-white/90">
              <Link href={ctaLink}>
                {ctaText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/20 bg-white/10 px-6 text-white hover:bg-white/15"
            >
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>
        </div>

        <div className="hidden lg:flex lg:items-end lg:justify-end">
          <div className="max-w-sm rounded-[2rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm uppercase tracking-[0.2em] text-white/60">
              Live campaign
            </p>
            <h2 className="mt-3 text-2xl font-semibold">{title}</h2>
            <p className="mt-3 text-sm leading-7 text-white/75">
              High-intent banner space powered directly from your admin dashboard.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
