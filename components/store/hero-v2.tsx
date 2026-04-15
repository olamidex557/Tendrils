"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import PromoCards from "@/components/store/promo-cards";
import { useGsapReveal } from "@/lib/hooks/use-gsap-reveal";

export default function HeroV2() {
  const scope = useGsapReveal();

  return (
    <section className="px-4 py-6 md:px-6 lg:px-8">
      <div ref={scope} className="mx-auto max-w-7xl space-y-5">
        <div className="overflow-hidden rounded-[2rem] bg-stone-100">
          <div className="grid items-center gap-8 px-6 py-10 md:px-10 md:py-12 lg:grid-cols-2 lg:px-12">
            <div className="space-y-6">
              <div
                data-reveal="hero"
                className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-stone-700 ring-1 ring-black/5"
              >
                Fast shipping • Trusted payments • Best deals
              </div>

              <div className="space-y-4">
                <h1
                  data-reveal="hero"
                  className="max-w-xl text-4xl font-semibold leading-tight tracking-tight text-black md:text-5xl lg:text-6xl"
                >
                  Your One-Stop Shop for Everything You Need
                </h1>

                <p
                  data-reveal="hero"
                  className="max-w-lg text-base leading-7 text-stone-600 md:text-lg"
                >
                  Shop top picks across electronics, fashion, grocery, sports,
                  beauty, school supplies, and more — all in one place.
                </p>
              </div>

              <div data-reveal="hero" className="flex flex-wrap gap-3">
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-black px-6 text-white hover:bg-black/90"
                >
                  <Link href="/products">Shop Now</Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full px-6"
                >
                  <Link href="/categories/electronics">Explore Categories</Link>
                </Button>
              </div>
            </div>

            <div
              data-reveal="hero"
              className="relative flex items-center justify-center"
            >
              <div className="absolute inset-x-8 bottom-0 h-24 rounded-full bg-stone-300/40 blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80"
                alt="Shopping lifestyle"
                className="relative z-10 h-[420px] w-full rounded-[1.5rem] object-cover lg:h-[520px]"
              />
            </div>
          </div>
        </div>

        <div data-reveal="hero">
          <PromoCards />
        </div>
      </div>
    </section>
  );
}