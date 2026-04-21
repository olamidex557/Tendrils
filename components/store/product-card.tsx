"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

type ProductCardProps = {
  id: string;
  productId?: string;
  variantId?: string | null;
  name: string;
  price: number;
  comparePrice?: number | null;
  image: string;
  href?: string;
  badge?: string;
  description?: string;
  category?: string;
  stockQuantity?: number | null;
  featured?: boolean;
};

export default function ProductCard({
  id,
  productId,
  variantId = null,
  name,
  price,
  comparePrice = null,
  image,
  href = "/products",
  badge,
  description,
  category,
  stockQuantity = null,
  featured = false,
}: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(id));

  const stock =
    typeof stockQuantity === "number" && !Number.isNaN(stockQuantity)
      ? stockQuantity
      : null;

  const cartLine =
    cartItems.find(
      (item) => item.id === id && (item.variantId ?? null) === (variantId ?? null)
    ) ?? null;

  const quantityInCart = cartLine?.quantity ?? 0;
  const remainingStock = stock === null ? null : Math.max(0, stock - quantityInCart);

  const isSoldOut = stock !== null && stock <= 0;
  const isMaxedInCart = remainingStock !== null && remainingStock <= 0 && !isSoldOut;
  const isLowStock =
    remainingStock !== null && remainingStock > 0 && remainingStock <= 3;

  const canAddToCart = !isSoldOut && !isMaxedInCart;
  const productHref = `${href}/${id}`;

  function handleAddToCart() {
    if (!canAddToCart) return;

    addItem({
      id,
      productId: productId ?? id,
      variantId,
      slug: id,
      name,
      price,
      stockQuantity: stock,
      image,
      category,
    });
  }

  return (
    <div className="group overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="relative">
        <Link href={productHref} className="block">
          <div className="aspect-square overflow-hidden bg-stone-100">
            <img
              src={image}
              alt={name}
              className={`h-full w-full object-cover transition duration-500 group-hover:scale-105 ${isSoldOut ? "opacity-75 grayscale-[0.15]" : ""
                }`}
            />
          </div>
        </Link>

        <button
          type="button"
          onClick={() =>
            toggleWishlist({
              id,
              slug: id,
              name,
              price,
              image,
              category,
              description,
            })
          }
          className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 shadow-sm transition hover:scale-105 ${isInWishlist ? "text-red-500" : "text-black"
            }`}
          aria-label={
            isInWishlist
              ? `Remove ${name} from wishlist`
              : `Save ${name} to wishlist`
          }
        >
          <Heart className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
        </button>

        {featured ? (
          <span className="absolute left-2 top-2 rounded-md bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
            Featured
          </span>
        ) : null}

        {!featured && badge ? (
          <span className="absolute left-2 top-2 rounded-md bg-amber-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-amber-700">
            {badge}
          </span>
        ) : null}

        {isSoldOut ? (
          <span className="absolute left-2 bottom-2 rounded-md bg-red-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-700">
            Sold Out
          </span>
        ) : isLowStock ? (
          <span className="absolute left-2 bottom-2 rounded-md bg-orange-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-orange-700">
            Only {remainingStock} left
          </span>
        ) : null}
      </div>

      <div className="space-y-3 p-3 sm:p-4">
        {category ? (
          <p className="line-clamp-1 text-[11px] font-medium uppercase tracking-wide text-stone-400">
            {category}
          </p>
        ) : null}

        <Link href={productHref} className="block">
          <h3 className="line-clamp-2 min-h-[2.75rem] text-sm font-semibold leading-5 text-black transition hover:text-stone-700 sm:text-base">
            {name}
          </h3>
        </Link>

        {description ? (
          <p className="line-clamp-2 text-xs leading-5 text-stone-500 sm:text-sm">
            {description}
          </p>
        ) : null}

        <div className="space-y-1">
          <p className="text-xl font-bold leading-none tracking-tight text-black sm:text-2xl">
            ₦{price.toLocaleString()}
          </p>

          {comparePrice && comparePrice > price ? (
            <p className="text-sm text-stone-400 line-through">
              ₦{comparePrice.toLocaleString()}
            </p>
          ) : null}
        </div>

        <Button
          type="button"
          onClick={handleAddToCart}
          disabled={!canAddToCart}
          className="h-11 w-full rounded-xl bg-black text-base font-semibold text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-stone-300"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          {isSoldOut ? "Sold Out" : isMaxedInCart ? "Max Added" : "Add to Cart"}
        </Button>
      </div>
    </div>
  );
}