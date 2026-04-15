import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ShoppingCart } from "lucide-react";

export default function ProductHighlightSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-black md:text-4xl">
            Product of the Month
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            A featured pick customers are loving right now.
          </p>
        </div>

        <Link
          href="/products"
          className="text-sm font-medium text-stone-600 transition hover:text-black"
        >
          View all
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
          <div className="grid h-full gap-0 md:grid-cols-2">
            <div className="flex flex-col justify-center p-6 md:p-8">
              <Badge className="mb-4 w-fit rounded-full bg-yellow-400 px-3 py-1 text-black hover:bg-yellow-400">
                Popular
              </Badge>

              <h3 className="max-w-sm text-3xl font-semibold leading-tight tracking-tight text-black md:text-4xl">
                Wireless Earbuds
              </h3>

              <div className="mt-4 flex items-center gap-3">
                <p className="text-3xl font-bold tracking-tight text-amber-500">
                  ₦145,000
                </p>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600">
                  Best Seller
                </span>
              </div>

              <p className="mt-4 max-w-md text-sm leading-7 text-stone-600 md:text-base">
                Experience rich sound, long battery life, and a sleek everyday
                design built for work, travel, and entertainment.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button className="rounded-full bg-black px-6 text-white hover:bg-black/90">
                  Add to Cart
                </Button>
                <Button variant="outline" className="rounded-full px-6">
                  View Details
                </Button>
              </div>
            </div>

            <div className="relative min-h-[320px] bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1200&q=80"
                alt="Wireless Earbuds"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-white shadow-sm">
          <div className="relative">
            <Badge className="absolute left-4 top-4 z-10 rounded-full bg-blue-500 px-3 py-1 text-white hover:bg-blue-500">
              New
            </Badge>

            <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
              <button
                type="button"
                aria-label="Save product"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-sm"
              >
                <Heart className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Add product to cart"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black shadow-sm"
              >
                <ShoppingCart className="h-4 w-4" />
              </button>
            </div>

            <img
              src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80"
              alt="Noise Cancelling Headphones"
              className="h-72 w-full object-cover"
            />
          </div>

          <div className="space-y-3 p-6">
            <p className="text-2xl font-bold tracking-tight text-black">
              ₦199,000
            </p>

            <h3 className="text-2xl font-semibold leading-tight text-black">
              Noise Cancelling Headphones
            </h3>

            <p className="text-sm leading-6 text-stone-600">
              Deep bass, immersive listening, and a premium over-ear fit for
              everyday focus.
            </p>

            <Button className="rounded-full bg-blue-500 px-6 text-white hover:bg-blue-600">
              Buy now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}