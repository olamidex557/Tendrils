"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlistStore } from "@/store/wishlist-store";
import { useCartStore } from "@/store/cart-store";

export default function WishlistGrid() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const addToCart = useCartStore((state) => state.addItem);

  if (items.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-stone-100">
          <Heart className="h-6 w-6 text-stone-500" />
        </div>
        <h2 className="mt-5 text-2xl font-semibold text-black">
          Your wishlist is empty
        </h2>
        <p className="mt-2 text-sm text-stone-600">
          Save products you love and come back to them anytime.
        </p>

        <Button asChild className="mt-6 rounded-full bg-black px-6 text-white hover:bg-black/90">
          <Link href="/products">Explore Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-600">
          {items.length} saved item{items.length !== 1 ? "s" : ""}
        </p>

        <Button
          type="button"
          variant="outline"
          onClick={clearWishlist}
          className="rounded-full"
        >
          Clear Wishlist
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="group overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="relative overflow-hidden bg-stone-100">
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-red-500 shadow-sm transition hover:scale-105"
                aria-label={`Remove ${item.name} from wishlist`}
              >
                <Trash2 className="h-4 w-4" />
              </button>

              <Link href={`/products/${item.slug}`} className="block">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </Link>
            </div>

            <div className="space-y-4 p-5">
              <div className="space-y-1">
                {item.category ? (
                  <p className="text-xs uppercase tracking-wide text-stone-400">
                    {item.category}
                  </p>
                ) : null}

                <Link
                  href={`/products/${item.slug}`}
                  className="line-clamp-1 text-lg font-semibold text-black transition hover:text-stone-700"
                >
                  {item.name}
                </Link>

                {item.description ? (
                  <p className="line-clamp-2 text-sm text-stone-500">
                    {item.description}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between gap-3">
                <p className="text-xl font-bold tracking-tight text-black">
                  ₦{item.price.toLocaleString()}
                </p>

                <Button
                  onClick={() =>
                    addToCart({
                      id: item.id,
                      slug: item.slug,
                      name: item.name,
                      price: item.price,
                      image: item.image,
                      category: item.category,
                    })
                  }
                  className="rounded-full bg-black px-5 text-white hover:bg-black/90"
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
