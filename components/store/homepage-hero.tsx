"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StorefrontBanner } from "@/lib/db/queries/storefront";

type HomepageHeroProps = {
  banners: StorefrontBanner[];
};

const fallbackBanner: StorefrontBanner = {
  id: "fallback",
  title: "Shop smarter, faster, and better",
  subtitle:
    "Discover top products, trusted categories, and everyday essentials designed to convert browsing into buying.",
  ctaText: "Shop Now",
  ctaLink: "/products",
  placement: "homepage_hero",
  status: "active",
  imageUrl:
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1800&q=80",
  priority: 1,
  scheduleText: null,
  startsAt: null,
  endsAt: null,
};

export default function HomepageHero({ banners }: HomepageHeroProps) {
  const slides = banners.length > 0 ? banners : [fallbackBanner];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setIsVisible(false);

      const timeout = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
        setIsVisible(true);
      }, 220);

      return () => clearTimeout(timeout);
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  function goToSlide(index: number) {
    if (index === currentIndex) return;

    setIsVisible(false);

    setTimeout(() => {
      setCurrentIndex(index);
      setIsVisible(true);
    }, 180);
  }

  function goToPrevious() {
    goToSlide((currentIndex - 1 + slides.length) % slides.length);
  }

  function goToNext() {
    goToSlide((currentIndex + 1) % slides.length);
  }

  const currentBanner = slides[currentIndex];
  const title = currentBanner.title;
  const subtitle = currentBanner.subtitle ?? fallbackBanner.subtitle;
  const ctaText = currentBanner.ctaText ?? "Shop Now";
  const ctaLink = currentBanner.ctaLink ?? "/products";
  const imageUrl = currentBanner.imageUrl ?? fallbackBanner.imageUrl!;

  return (
    <section className="relative overflow-hidden bg-stone-950">
      <div className="absolute inset-0">
        <img
          src={imageUrl}
          alt={title}
          className={`h-full w-full object-cover transition-all duration-500 ${
            isVisible ? "scale-100 opacity-35" : "scale-[1.03] opacity-20"
          }`}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-20 text-white md:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <div
          className={`max-w-2xl transition-all duration-500 ${
            isVisible
              ? "translate-y-0 opacity-100"
              : "translate-y-2 opacity-0"
          }`}
        >
          <h1 className="text-4xl font-semibold tracking-[-0.03em] md:text-5xl lg:text-7xl">
            {title}
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 md:text-base">
            {subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className="rounded-full bg-white px-6 text-black hover:bg-white/90"
            >
              <Link href={ctaLink}>
                {ctaText}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-full border-white/20 bg-white/10 px-6 text-white backdrop-blur hover:bg-white/15"
            >
              <Link href="/categories">Browse Categories</Link>
            </Button>
          </div>

          {slides.length > 1 ? (
            <div className="mt-10 flex items-center gap-3">
              <div className="flex items-center gap-2">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to hero banner ${index + 1}`}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? "w-8 bg-white"
                        : "w-2.5 bg-white/40 hover:bg-white/70"
                    }`}
                  />
                ))}
              </div>

              <div className="ml-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={goToPrevious}
                  aria-label="Previous banner"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <button
                  type="button"
                  onClick={goToNext}
                  aria-label="Next banner"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : null}
        </div>

        <div className="hidden lg:flex lg:items-end lg:justify-end">
            {currentBanner.scheduleText ? (
              <div className="mt-5 inline-flex rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs text-white/80">
                {currentBanner.scheduleText}
              </div>
            ) : null}
          </div>
        </div>
    </section>
  );
}