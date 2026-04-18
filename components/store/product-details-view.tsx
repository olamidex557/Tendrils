"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

type ProductVariant = {
  id: string;
  label: string;
  sku: string | null;
  price: number | null;
  stockQuantity: number;
  status: string;
};

type ProductAttribute = {
  id: string;
  name: string;
  values: string[];
};

type ProductDetailsViewProps = {
  product: {
    id: string;
    slug: string;
    name: string;
    description: string | null;
    shortDescription: string | null;
    imageUrl: string | null;
    categoryName: string | null;
    categorySlug: string | null;
    price: number;
    comparePrice: number | null;
    stockQuantity: number;
    productType: "simple" | "variable";
    attributes: ProductAttribute[];
    variants: ProductVariant[];
  };
};

export default function ProductDetailsView({
  product,
}: ProductDetailsViewProps) {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  const defaultVariant = product.variants[0] ?? null;
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    defaultVariant?.id ?? null
  );

  const selectedVariant = useMemo(
    () =>
      product.variants.find((variant) => variant.id === selectedVariantId) ??
      defaultVariant,
    [product.variants, selectedVariantId, defaultVariant]
  );

  const effectivePrice =
    product.productType === "variable"
      ? selectedVariant?.price ?? product.price
      : product.price;

  const effectiveStock =
    product.productType === "variable"
      ? selectedVariant?.stockQuantity ?? 0
      : product.stockQuantity;

  const canBuy = effectiveStock > 0;

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-stone-500">
        <Link href="/" className="transition hover:text-black">
          Home
        </Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="transition hover:text-black">
          Products
        </Link>
        {product.categoryName && product.categorySlug ? (
          <>
            <ChevronRight className="h-4 w-4" />
            <Link
              href={`/categories/${product.categorySlug}`}
              className="transition hover:text-black"
            >
              {product.categoryName}
            </Link>
          </>
        ) : null}
        <ChevronRight className="h-4 w-4" />
        <span className="text-black">{product.name}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
        <div className="overflow-hidden rounded-[2rem] border border-black/5 bg-stone-100">
          <img
            src={product.imageUrl ?? ""}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="space-y-6">
          <div>
            {product.categoryName ? (
              <p className="text-sm uppercase tracking-[0.2em] text-stone-500">
                {product.categoryName}
              </p>
            ) : null}

            <h1 className="mt-3 text-4xl font-semibold tracking-tight text-black md:text-5xl">
              {product.name}
            </h1>

            {product.shortDescription ? (
              <p className="mt-4 text-sm leading-7 text-stone-600 md:text-base">
                {product.shortDescription}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            <p className="text-3xl font-bold text-black">
              ₦{Number(effectivePrice).toLocaleString()}
            </p>

            {product.comparePrice ? (
              <p className="text-lg text-stone-400 line-through">
                ₦{Number(product.comparePrice).toLocaleString()}
              </p>
            ) : null}
          </div>

          <div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                canBuy
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {canBuy ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {product.productType === "variable" && product.attributes.length > 0 ? (
            <div className="space-y-5">
              {product.attributes.map((attribute) => (
                <div key={attribute.id}>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-700">
                    {attribute.name}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {attribute.values.map((value) => (
                      <span
                        key={value}
                        className="rounded-full bg-stone-100 px-4 py-2 text-sm text-stone-700"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                </div>
              ))}

              {product.variants.length > 0 ? (
                <div>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-700">
                    Choose Variant
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((variant) => {
                      const active = selectedVariantId === variant.id;

                      return (
                        <button
                          key={variant.id}
                          type="button"
                          onClick={() => setSelectedVariantId(variant.id)}
                          className={`rounded-full px-4 py-2 text-sm transition ${
                            active
                              ? "bg-black text-white"
                              : "bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-black"
                          }`}
                        >
                          {variant.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          {product.description ? (
            <div className="border-t border-black/5 pt-6">
              <h2 className="text-lg font-semibold text-black">Description</h2>
              <p className="mt-3 text-sm leading-7 text-stone-600 md:text-base">
                {product.description}
              </p>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              disabled={!canBuy}
              onClick={() =>
                addItem({
                  id: product.id,
                  slug: product.slug,
                  name:
                    product.productType === "variable" && selectedVariant
                      ? `${product.name} - ${selectedVariant.label}`
                      : product.name,
                  price: Number(effectivePrice),
                  image: product.imageUrl ?? "",
                  category: product.categoryName ?? undefined,
                })
              }
              className="rounded-full bg-black px-6 text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              {canBuy ? "Add to Cart" : "Unavailable"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() =>
                toggleWishlist({
                  id: product.id,
                  slug: product.slug,
                  name: product.name,
                  price: Number(effectivePrice),
                  image: product.imageUrl ?? "",
                  category: product.categoryName ?? undefined,
                  description: product.shortDescription ?? undefined,
                })
              }
              className="rounded-full px-6"
            >
              <Heart className={`mr-2 h-4 w-4 ${isInWishlist ? "fill-current" : ""}`} />
              {isInWishlist ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}