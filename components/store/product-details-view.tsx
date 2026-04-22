"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingCart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

type ProductAttribute = {
  id: string;
  name: string;
  values: string[];
};

type InventoryMatrixRow = {
  id: string;
  size: string;
  color: string;
  stockQuantity: number;
  sku: string | null;
  isActive: boolean;
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
    inventoryMatrix?: InventoryMatrixRow[];
  };
};

export default function ProductDetailsView({
  product,
}: ProductDetailsViewProps) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) =>
    state.isInWishlist(product.id)
  );

  const sizeValues = useMemo(() => {
    return (
      product.attributes.find(
        (attribute) => attribute.name.toLowerCase() === "size"
      )?.values ?? []
    );
  }, [product.attributes]);

  const colorValues = useMemo(() => {
    return (
      product.attributes.find(
        (attribute) => attribute.name.toLowerCase() === "color"
      )?.values ?? []
    );
  }, [product.attributes]);

  const activeMatrixRows = useMemo(() => {
    return (product.inventoryMatrix ?? []).filter((row) => row.isActive);
  }, [product.inventoryMatrix]);

  const defaultMatrixRow = useMemo(() => {
    return (
      activeMatrixRows.find((row) => Number(row.stockQuantity) > 0) ??
      activeMatrixRows[0] ??
      null
    );
  }, [activeMatrixRows]);

  const [selectedSize, setSelectedSize] = useState<string>(
    defaultMatrixRow?.size ?? ""
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    defaultMatrixRow?.color ?? ""
  );
  const [selectionError, setSelectionError] = useState("");

  const selectedMatrixRow = useMemo(() => {
    if (product.productType !== "variable") return null;

    return (
      activeMatrixRows.find(
        (row) => row.size === selectedSize && row.color === selectedColor
      ) ?? null
    );
  }, [activeMatrixRows, product.productType, selectedSize, selectedColor]);

  const availableColorsForSelectedSize = useMemo(() => {
    if (product.productType !== "variable") return new Set<string>();

    const rowsForSize = activeMatrixRows.filter((row) => row.size === selectedSize);
    return new Set(
      rowsForSize
        .filter((row) => Number(row.stockQuantity) > 0)
        .map((row) => row.color)
    );
  }, [activeMatrixRows, product.productType, selectedSize]);

  const availableSizesForSelectedColor = useMemo(() => {
    if (product.productType !== "variable") return new Set<string>();

    const rowsForColor = activeMatrixRows.filter(
      (row) => row.color === selectedColor
    );
    return new Set(
      rowsForColor
        .filter((row) => Number(row.stockQuantity) > 0)
        .map((row) => row.size)
    );
  }, [activeMatrixRows, product.productType, selectedColor]);

  const effectivePrice = Number(product.price);

  const effectiveStock =
    product.productType === "variable"
      ? Number(selectedMatrixRow?.stockQuantity ?? 0)
      : Number(product.stockQuantity ?? 0);

  const cartLine = useMemo(() => {
    if (product.productType === "variable") {
      return (
        cartItems.find(
          (item) =>
            item.id === (selectedMatrixRow?.id ?? product.id) &&
            (item.variantId ?? null) === (selectedMatrixRow?.id ?? null)
        ) ?? null
      );
    }

    return cartItems.find((item) => item.id === product.id) ?? null;
  }, [cartItems, product.id, product.productType, selectedMatrixRow?.id]);

  const quantityInCart = cartLine?.quantity ?? 0;

  const isSelectionComplete =
    product.productType === "simple" ||
    (Boolean(selectedSize) && Boolean(selectedColor) && Boolean(selectedMatrixRow));

  const canBuy =
    product.productType === "simple"
      ? effectiveStock > 0
      : isSelectionComplete && effectiveStock > 0;

  const stockMessage =
    product.productType === "variable" && !selectedSize && !selectedColor
      ? "Select size and color"
      : product.productType === "variable" && !selectedMatrixRow
      ? "Unavailable combination"
      : effectiveStock <= 0
      ? "Out of stock"
      : effectiveStock <= 3
      ? `Only ${effectiveStock} left`
      : "In stock";

  function handleSizeSelect(size: string) {
    setSelectionError("");
    setSelectedSize(size);

    if (
      selectedColor &&
      !activeMatrixRows.some(
        (row) =>
          row.size === size &&
          row.color === selectedColor &&
          row.stockQuantity > 0
      )
    ) {
      setSelectedColor("");
    }
  }

  function handleColorSelect(color: string) {
    setSelectionError("");
    setSelectedColor(color);

    if (
      selectedSize &&
      !activeMatrixRows.some(
        (row) =>
          row.size === selectedSize &&
          row.color === color &&
          row.stockQuantity > 0
      )
    ) {
      setSelectedSize("");
    }
  }

  function handleAddToCart() {
    if (product.productType === "variable") {
      if (!selectedSize) {
        setSelectionError("Please select a size.");
        return;
      }

      if (!selectedColor) {
        setSelectionError("Please select a color.");
        return;
      }

      if (!selectedMatrixRow) {
        setSelectionError("This size and color combination is unavailable.");
        return;
      }
    }

    addItem({
      id:
        product.productType === "variable"
          ? selectedMatrixRow?.id ?? product.id
          : product.id,
      productId: product.id,
      variantId:
        product.productType === "variable"
          ? selectedMatrixRow?.id ?? null
          : null,
      sku:
        product.productType === "variable"
          ? selectedMatrixRow?.sku ?? undefined
          : undefined,
      slug: product.slug,
      name:
        product.productType === "variable"
          ? `${product.name} - ${selectedSize} / ${selectedColor}`
          : product.name,
      price: effectivePrice,
      stockQuantity: Number(effectiveStock),
      image: product.imageUrl ?? "",
      category: product.categoryName ?? undefined,
      selectedOptions:
        product.productType === "variable"
          ? {
              Size: selectedSize,
              Color: selectedColor,
            }
          : undefined,
    });

    setSelectionError("");
  }

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
              ₦{effectivePrice.toLocaleString()}
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
                effectiveStock <= 0 || !isSelectionComplete
                  ? "bg-red-100 text-red-700"
                  : effectiveStock <= 3
                  ? "bg-amber-100 text-amber-700"
                  : "bg-green-100 text-green-700"
              }`}
            >
              {stockMessage}
            </span>
          </div>

          {product.productType === "variable" ? (
            <div className="space-y-6">
              {sizeValues.length > 0 ? (
                <div>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-700">
                    Size
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {sizeValues.map((size) => {
                      const hasAnyStockForSize = activeMatrixRows.some(
                        (row) => row.size === size && Number(row.stockQuantity) > 0
                      );

                      const disabled =
                        selectedColor && !availableSizesForSelectedColor.has(size)
                          ? true
                          : !hasAnyStockForSize;

                      const active = selectedSize === size;

                      return (
                        <button
                          key={size}
                          type="button"
                          onClick={() => {
                            if (!disabled) handleSizeSelect(size);
                          }}
                          disabled={disabled}
                          className={`min-w-[52px] rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                            disabled
                              ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 line-through"
                              : active
                              ? "border-black bg-black text-white"
                              : "border-stone-200 bg-white text-black hover:border-black/30"
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {colorValues.length > 0 ? (
                <div>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-stone-700">
                    Color
                  </h2>

                  <div className="flex flex-wrap gap-2">
                    {colorValues.map((color) => {
                      const hasAnyStockForColor = activeMatrixRows.some(
                        (row) => row.color === color && Number(row.stockQuantity) > 0
                      );

                      const disabled =
                        selectedSize && !availableColorsForSelectedSize.has(color)
                          ? true
                          : !hasAnyStockForColor;

                      const active = selectedColor === color;

                      return (
                        <button
                          key={color}
                          type="button"
                          onClick={() => {
                            if (!disabled) handleColorSelect(color);
                          }}
                          disabled={disabled}
                          className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                            disabled
                              ? "cursor-not-allowed border-stone-200 bg-stone-100 text-stone-400 line-through"
                              : active
                              ? "border-black bg-black text-white"
                              : "border-stone-200 bg-white text-black hover:border-black/30"
                          }`}
                        >
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {selectionError ? (
                <p className="text-sm text-red-600">{selectionError}</p>
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
              onClick={handleAddToCart}
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
                  price: Number(product.price),
                  image: product.imageUrl ?? "",
                  category: product.categoryName ?? undefined,
                  description: product.shortDescription ?? undefined,
                })
              }
              className="rounded-full px-6"
            >
              <Heart
                className={`mr-2 h-4 w-4 ${isInWishlist ? "fill-current" : ""}`}
              />
              {isInWishlist ? "Saved" : "Save"}
            </Button>
          </div>

          {quantityInCart > 0 ? (
            <p className="text-sm text-stone-500">
              {quantityInCart} already in cart
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}