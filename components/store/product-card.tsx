"use client";

import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/store/cart-store";

type ProductCardProps = {
  id: string;
  name: string;
  price: number;
  image: string;
  href?: string;
  badge?: string;
  description?: string;
};

export default function ProductCard({
  id,
  name,
  price,
  image,
  href = "/products",
  badge,
  description,
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="group overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative overflow-hidden bg-stone-100">
        {badge ? (
          <Badge className="absolute left-4 top-4 z-10 rounded-full bg-yellow-400 px-3 py-1 text-xs font-medium text-black hover:bg-yellow-400">
            {badge}
          </Badge>
        ) : null}

        <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-black shadow-sm transition hover:scale-105"
            aria-label={`Save ${name}`}
          >
            <Heart className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() =>
              addItem({
                id,
                slug: id,
                name,
                price,
                image,
              })
            }
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-black shadow-sm transition hover:scale-105"
            aria-label={`Add ${name} to cart`}
          >
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>

        <Link href={`${href}/${id}`} className="block">
          <img
            src={image}
            alt={name}
            className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
      </div>

      <div className="space-y-4 p-5">
        <div className="space-y-1">
          <Link
            href={`${href}/${id}`}
            className="line-clamp-1 text-lg font-semibold text-black transition hover:text-stone-700"
          >
            {name}
          </Link>

          {description ? (
            <p className="line-clamp-2 text-sm text-stone-500">{description}</p>
          ) : null}
        </div>

        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xl font-bold tracking-tight text-black">
              ₦{price.toLocaleString()}
            </p>
          </div>

          <Button
            onClick={() =>
              addItem({
                id,
                slug: id,
                name,
                price,
                image,
              })
            }
            className="rounded-full bg-black px-5 text-white hover:bg-black/90"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}