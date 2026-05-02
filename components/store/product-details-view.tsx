"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Heart,
  ShoppingCart,
  ChevronRight,
  Minus,
  Plus,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";
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

type MoqPricing = {
  id: string;
  minQuantity: number;
  pricePerUnit: number;
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
    moqPricing?: MoqPricing[];
    sku?: string | null;
  };
};

const galleryFallback = [
  "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
];

export default function ProductDetailsView({ product }: ProductDetailsViewProps) {
  const addItem = useCartStore((state) => state.addItem);
  const cartItems = useCartStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist(product.id));

  const sizeValues =
    product.attributes.find((a) => a.name.toLowerCase() === "size")?.values ?? [];

  const colorValues =
    product.attributes.find((a) => a.name.toLowerCase() === "color")?.values ?? [];

  const activeMatrixRows = (product.inventoryMatrix ?? []).filter((row) => row.isActive);

  const defaultMatrixRow =
    activeMatrixRows.find((row) => Number(row.stockQuantity) > 0) ??
    activeMatrixRows[0] ??
    null;

  const [selectedSize, setSelectedSize] = useState(defaultMatrixRow?.size ?? "");
  const [selectedColor, setSelectedColor] = useState(defaultMatrixRow?.color ?? "");
  const [selectionError, setSelectionError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "information">(
    "description"
  );
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const galleryImages = product.imageUrl
    ? [product.imageUrl, ...galleryFallback.slice(0, 3)]
    : galleryFallback;

  const selectedMatrixRow =
    product.productType === "variable"
      ? activeMatrixRows.find(
        (row) => row.size === selectedSize && row.color === selectedColor
      ) ?? null
      : null;

  const moqTiers = (product.moqPricing ?? [])
    .filter((tier) => tier.isActive && tier.minQuantity > 0)
    .sort((a, b) => a.minQuantity - b.minQuantity);

  const appliedMoqTier =
    [...moqTiers].reverse().find((tier) => quantity >= tier.minQuantity) ?? null;

  const effectivePrice = appliedMoqTier
    ? Number(appliedMoqTier.pricePerUnit)
    : Number(product.price);

  const effectiveStock =
    product.productType === "variable"
      ? Number(selectedMatrixRow?.stockQuantity ?? 0)
      : Number(product.stockQuantity ?? 0);

  const totalPrice = effectivePrice * quantity;

  const availableColorsForSelectedSize = new Set(
    activeMatrixRows
      .filter((row) => row.size === selectedSize && Number(row.stockQuantity) > 0)
      .map((row) => row.color)
  );

  const availableSizesForSelectedColor = new Set(
    activeMatrixRows
      .filter((row) => row.color === selectedColor && Number(row.stockQuantity) > 0)
      .map((row) => row.size)
  );

  const cartLine =
    product.productType === "variable"
      ? cartItems.find(
        (item) =>
          item.id === (selectedMatrixRow?.id ?? product.id) &&
          (item.variantId ?? null) === (selectedMatrixRow?.id ?? null)
      ) ?? null
      : cartItems.find((item) => item.id === product.id) ?? null;

  const quantityInCart = cartLine?.quantity ?? 0;

  const canBuy =
    product.productType === "simple"
      ? effectiveStock > 0
      : Boolean(selectedSize && selectedColor && selectedMatrixRow && effectiveStock > 0);

  const stockMessage =
    product.productType === "variable" && !selectedSize && !selectedColor
      ? "Select size and color"
      : product.productType === "variable" && !selectedMatrixRow
        ? "Unavailable combination"
        : effectiveStock <= 0
          ? "Out of stock"
          : "In stock";

  const displaySku =
    product.productType === "variable"
      ? selectedMatrixRow?.sku ?? "—"
      : product.sku ?? "—";

  function handleSizeSelect(size: string) {
    setSelectionError("");
    setSelectedSize(size);

    if (
      selectedColor &&
      !activeMatrixRows.some(
        (row) => row.size === size && row.color === selectedColor && row.stockQuantity > 0
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
        (row) => row.size === selectedSize && row.color === color && row.stockQuantity > 0
      )
    ) {
      setSelectedSize("");
    }
  }

  function increaseQuantity() {
    if (effectiveStock <= 0) return;
    setQuantity((prev) => Math.min(prev + 1, effectiveStock));
  }

  function decreaseQuantity() {
    setQuantity((prev) => Math.max(prev - 1, 1));
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
        product.productType === "variable" ? selectedMatrixRow?.id ?? null : null,
      sku:
        product.productType === "variable"
          ? selectedMatrixRow?.sku ?? undefined
          : product.sku ?? undefined,
      slug: product.slug,
      name:
        product.productType === "variable"
          ? `${product.name} - ${selectedSize} / ${selectedColor}`
          : product.name,
      price: effectivePrice,
      basePrice: Number(product.price),
      moqPricing: product.moqPricing ?? [],
      quantity,
      stockQuantity: effectiveStock,
      image: product.imageUrl ?? galleryImages[0],
      category: product.categoryName ?? undefined,
      selectedOptions:
        product.productType === "variable"
          ? { Size: selectedSize, Color: selectedColor }
          : undefined,
    });

    setSelectionError("");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6">
      <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-stone-500">
        <Link href="/" className="transition hover:text-black">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/products" className="transition hover:text-black">Shop</Link>
        <ChevronRight className="h-4 w-4" />
        <span className="font-medium text-black">{product.name}</span>
      </div>

      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)] xl:gap-14">
        <div>
          <div className="relative overflow-hidden rounded-[1.5rem] border border-black/5 bg-stone-100 shadow-[0_18px_60px_rgba(20,20,20,0.08)]">
            <img
              src={galleryImages[activeImageIndex]}
              alt={product.name}
              className="h-[420px] w-full object-cover transition duration-500 md:h-[560px]"
            />

            <button
              type="button"
              aria-label="Previous product image"
              onClick={() =>
                setActiveImageIndex((prev) =>
                  prev === 0 ? galleryImages.length - 1 : prev - 1
                )
              }
              className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/90 text-black shadow-lg shadow-black/10 backdrop-blur transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              aria-label="Next product image"
              onClick={() =>
                setActiveImageIndex((prev) =>
                  prev === galleryImages.length - 1 ? 0 : prev + 1
                )
              }
              className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-white/90 text-black shadow-lg shadow-black/10 backdrop-blur transition hover:bg-white"
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>

            <div className="absolute bottom-4 right-4 rounded-full border border-white/50 bg-white/90 px-3 py-1 text-xs font-semibold text-stone-700 shadow-sm backdrop-blur">
              {activeImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div>
            {product.categoryName ? (
              <p className="inline-flex rounded-full border border-stone-200 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase text-stone-500">
                {product.categoryName}
              </p>
            ) : null}

            <div className="mt-4 flex items-start justify-between gap-4">
              <h1 className="text-4xl font-semibold leading-tight text-black md:text-6xl">
                {product.name}
              </h1>

              <button
                type="button"
                onClick={() =>
                  toggleWishlist({
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: effectivePrice,
                    image: product.imageUrl ?? "",
                    category: product.categoryName ?? undefined,
                    description: product.shortDescription ?? undefined,
                  })
                }
                aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-stone-200 bg-white text-black shadow-sm transition hover:border-stone-300 hover:bg-stone-50"
              >
                <Heart className={`h-5 w-5 ${isInWishlist ? "fill-current" : ""}`} />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <p className="text-4xl font-bold text-[#a77b25]">
                ₦{effectivePrice.toLocaleString()}
              </p>

              {product.comparePrice ? (
                <p className="text-xl text-stone-400 line-through">
                  ₦{Number(product.comparePrice).toLocaleString()}
                </p>
              ) : null}

              {appliedMoqTier ? (
                <span className="rounded-full bg-[#1f4d2e]/10 px-3 py-1 text-xs font-semibold text-[#1f4d2e]">
                  Bulk price applied
                </span>
              ) : null}
            </div>

            {product.shortDescription ? (
              <p className="mt-5 max-w-xl text-base leading-8 text-stone-600">
                {product.shortDescription}
              </p>
            ) : null}

            <div className="mt-4">
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${effectiveStock > 0
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                  }`}
              >
                {stockMessage}
              </span>
            </div>
          </div>

          {moqTiers.length > 0 ? (
            <div className="rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-semibold text-black">Bulk Pricing</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {moqTiers.map((tier) => (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setQuantity(Math.min(tier.minQuantity, effectiveStock || tier.minQuantity))}
                    className={`rounded-full px-4 py-2 text-sm ${appliedMoqTier?.id === tier.id
                        ? "bg-[#1f4d2e] text-white"
                        : "bg-white text-stone-700"
                      }`}
                  >
                    Buy {tier.minQuantity}+ at ₦{tier.pricePerUnit.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {product.productType === "variable" ? (
            <div className="space-y-6">
              {sizeValues.length > 0 ? (
                <OptionPicker
                  title="Size / Volume"
                  values={sizeValues}
                  selected={selectedSize}
                  onSelect={handleSizeSelect}
                  disabledValues={(size) =>
                    Boolean(selectedColor && !availableSizesForSelectedColor.has(size)) ||
                    !activeMatrixRows.some(
                      (row) => row.size === size && Number(row.stockQuantity) > 0
                    )
                  }
                />
              ) : null}

              {colorValues.length > 0 ? (
                <OptionPicker
                  title="Color"
                  values={colorValues}
                  selected={selectedColor}
                  onSelect={handleColorSelect}
                  disabledValues={(color) =>
                    Boolean(selectedSize && !availableColorsForSelectedSize.has(color)) ||
                    !activeMatrixRows.some(
                      (row) => row.color === color && Number(row.stockQuantity) > 0
                    )
                  }
                />
              ) : null}

              {selectionError ? (
                <p className="text-sm text-red-600">{selectionError}</p>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-12 items-center rounded-full border border-stone-200 bg-white shadow-sm">
              <button
                type="button"
                onClick={decreaseQuantity}
                aria-label="Decrease quantity"
                className="flex h-12 w-12 items-center justify-center text-stone-600 transition hover:text-black"
              >
                <Minus className="h-4 w-4" />
              </button>

              <span className="min-w-[48px] text-center text-sm font-medium">
                {quantity}
              </span>

              <button
                type="button"
                onClick={increaseQuantity}
                aria-label="Increase quantity"
                className="flex h-12 w-12 items-center justify-center text-stone-600 transition hover:text-black disabled:text-stone-300"
                disabled={effectiveStock <= 0 || quantity >= effectiveStock}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              type="button"
              disabled={!canBuy}
              onClick={handleAddToCart}
              className="h-12 rounded-full bg-[#1f4d2e] px-8 text-white shadow-sm shadow-[#1f4d2e]/20 hover:bg-[#183d25] disabled:opacity-50"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>

            <Button type="button" variant="outline" className="h-12 rounded-full px-7">
              Buy Now
            </Button>
          </div>

          <div className="grid gap-3 rounded-[1.25rem] border border-stone-100 bg-stone-50/80 p-4 text-sm text-stone-600 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold text-black">SKU</span>
              <span>{displaySku}</span>
            </div>
            <div className="flex items-center justify-between gap-4 border-t border-stone-200 pt-3">
              <span className="font-semibold text-black">Total</span>
              <span className="font-semibold text-black">₦{totalPrice.toLocaleString()}</span>
            </div>
            {quantityInCart > 0 ? (
              <div className="flex items-center justify-between gap-4 border-t border-stone-200 pt-3">
                <span className="font-semibold text-black">In Cart</span>
                <span>{quantityInCart}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-14 rounded-[1.8rem] border border-black/5 bg-white p-5 shadow-sm md:p-8">
        <div className="flex flex-wrap gap-8 border-b border-stone-200 pb-4">
          <button
            type="button"
            onClick={() => setActiveTab("description")}
            className={`text-base font-medium ${activeTab === "description" ? "text-[#1f4d2e]" : "text-stone-500"
              }`}
          >
            Description
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("information")}
            className={`text-base font-medium ${activeTab === "information" ? "text-[#1f4d2e]" : "text-stone-500"
              }`}
          >
            Additional Information
          </button>
        </div>

        <div className="pt-6">
          {activeTab === "description" ? (
            <p className="text-sm leading-8 text-stone-600 md:text-base">
              {product.description || "No product description has been added yet."}
            </p>
          ) : null}

          {activeTab === "information" ? (
            <div className="space-y-3 text-sm text-stone-600">
              <p><span className="font-semibold text-black">Product:</span> {product.name}</p>
              <p><span className="font-semibold text-black">Category:</span> {product.categoryName ?? "General"}</p>
              <p><span className="font-semibold text-black">SKU:</span> {displaySku}</p>
              <p><span className="font-semibold text-black">Stock:</span> {effectiveStock}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function OptionPicker({
  title,
  values,
  selected,
  onSelect,
  disabledValues,
}: {
  title: string;
  values: string[];
  selected: string;
  onSelect: (value: string) => void;
  disabledValues: (value: string) => boolean;
}) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-black">{title}</h2>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => {
          const disabled = disabledValues(value);
          const active = selected === value;

          return (
            <button
              key={value}
              type="button"
              onClick={() => !disabled && onSelect(value)}
              disabled={disabled}
              className={`rounded-full px-4 py-2 text-sm transition ${disabled
                  ? "cursor-not-allowed bg-stone-100 text-stone-400 line-through"
                  : active
                    ? "bg-[#1f4d2e] text-white"
                    : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                }`}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
