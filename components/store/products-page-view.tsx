"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, SlidersHorizontal, RotateCcw } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import ProductsFilters from "@/components/store/products-filters";
import ProductsGrid from "@/components/store/products-grid";
import type { StorefrontProduct } from "@/lib/db/queries/storefront";

type ProductsPageViewProps = {
  products: StorefrontProduct[];
  categoryOptions: string[];
};

const availabilityOptions = ["All", "In Stock", "Out of Stock"];
const sortOptions = [
  { label: "Default Sorting", value: "default" },
  { label: "Price Low → High", value: "price-asc" },
  { label: "Price High → Low", value: "price-desc" },
  { label: "Name A → Z", value: "name-asc" },
  { label: "Name Z → A", value: "name-desc" },
];

export default function ProductsPageView({
  products,
  categoryOptions,
}: ProductsPageViewProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [maxPrice, setMaxPrice] = useState(500000);
  const [sortBy, setSortBy] = useState("default");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) =>
          (product.categoryName ?? "").toLowerCase() ===
          selectedCategory.toLowerCase()
      );
    }

    if (selectedAvailability === "In Stock") {
      result = result.filter((product) => product.stockQuantity > 0);
    }

    if (selectedAvailability === "Out of Stock") {
      result = result.filter((product) => product.stockQuantity <= 0);
    }

    result = result.filter((product) => product.price <= maxPrice);

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        break;
    }

    return result;
  }, [products, selectedCategory, selectedAvailability, maxPrice, sortBy]);

  function resetFilters() {
    setSelectedCategory("All");
    setSelectedAvailability("All");
    setMaxPrice(500000);
    setSortBy("default");
  }

  const activeFilterCount =
    Number(selectedCategory !== "All") +
    Number(selectedAvailability !== "All") +
    Number(maxPrice !== 500000);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        <div className="hidden lg:block">
          <ProductsFilters
            categories={categoryOptions}
            selectedCategory={selectedCategory}
            selectedAvailability={selectedAvailability}
            maxPrice={maxPrice}
            onCategoryChange={setSelectedCategory}
            onAvailabilityChange={setSelectedAvailability}
            onPriceChange={setMaxPrice}
            onReset={resetFilters}
          />
        </div>

        <div className="pb-24 lg:pb-0">
          <div className="mb-4 flex flex-wrap gap-2 lg:hidden">
            {selectedCategory !== "All" ? (
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                {selectedCategory}
              </span>
            ) : null}

            {selectedAvailability !== "All" ? (
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                {selectedAvailability}
              </span>
            ) : null}

            {maxPrice !== 500000 ? (
              <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                Under ₦{maxPrice.toLocaleString()}
              </span>
            ) : null}
          </div>

          <ProductsGrid
            products={filteredProducts}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-4 z-40 px-4 lg:hidden">
        <div className="mx-auto flex max-w-md items-center gap-3 rounded-full border border-black/5 bg-black px-3 py-3 shadow-2xl">
          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                <ArrowUpDown className="h-4 w-4" />
                Sort
              </button>
            </SheetTrigger>

            <SheetContent side="bottom" className="rounded-t-[2rem] px-0 pb-8 pt-0">
              <SheetHeader className="px-6 pt-6 text-left">
                <SheetTitle>Sort products</SheetTitle>
                <SheetDescription>
                  Choose how products should be ordered on mobile.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-2 px-4">
                {sortOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSortBy(option.value)}
                    className={`flex w-full items-center justify-between rounded-2xl px-4 py-4 text-left text-sm font-medium transition ${
                      sortBy === option.value
                        ? "bg-black text-white"
                        : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    <span>{option.label}</span>
                    {sortBy === option.value ? <span>✓</span> : null}
                  </button>
                ))}
              </div>
            </SheetContent>
          </Sheet>

          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                className="relative flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-black transition hover:bg-white/95"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                {activeFilterCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>
            </SheetTrigger>

            <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto rounded-t-[2rem] px-0 pb-8 pt-0">
              <SheetHeader className="px-6 pt-6 text-left">
                <SheetTitle>Filter products</SheetTitle>
                <SheetDescription>
                  Refine products by category, availability, and price.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6 px-4">
                <MobileFilterBlock title="Category">
                  <div className="flex flex-wrap gap-2">
                    {categoryOptions.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          selectedCategory === category
                            ? "bg-black text-white"
                            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </MobileFilterBlock>

                <MobileFilterBlock title="Availability">
                  <div className="flex flex-wrap gap-2">
                    {availabilityOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => setSelectedAvailability(option)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          selectedAvailability === option
                            ? "bg-black text-white"
                            : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </MobileFilterBlock>

                <MobileFilterBlock title="Maximum Price">
                  <div className="space-y-4 rounded-[1.5rem] bg-stone-50 p-4">
                    <input
                      type="range"
                      min={5000}
                      max={500000}
                      step={5000}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(Number(e.target.value))}
                      className="w-full"
                    />

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-stone-500">Up to</span>
                      <span className="font-semibold text-black">
                        ₦{maxPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </MobileFilterBlock>

                <Button
                  type="button"
                  variant="outline"
                  onClick={resetFilters}
                  className="h-12 w-full rounded-full"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </section>
  );
}

function MobileFilterBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
        {title}
      </h3>
      {children}
    </div>
  );
}