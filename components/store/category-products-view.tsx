"use client";

import { useMemo, useState } from "react";
import ProductsFilters from "@/components/store/products-filters";
import ProductsGrid from "@/components/store/products-grid";
import type { StorefrontProduct } from "@/lib/db/queries/storefront";

type CategoryProductsViewProps = {
  categoryName: string;
  products: StorefrontProduct[];
};

export default function CategoryProductsView({
  categoryName,
  products,
}: CategoryProductsViewProps) {
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [maxPrice, setMaxPrice] = useState(500000);
  const [sortBy, setSortBy] = useState("default");

  const filteredProducts = useMemo(() => {
    let result = [...products];

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
  }, [products, selectedAvailability, maxPrice, sortBy]);

  function resetFilters() {
    setSelectedAvailability("All");
    setMaxPrice(500000);
    setSortBy("default");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-8 flex flex-col gap-3 border-b border-black/5 pb-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-stone-500">
            Browse
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-black">
            {categoryName} Products
          </h2>
        </div>

        <p className="text-sm text-stone-500">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""} available
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
        <ProductsFilters
          categories={["All"]}
          selectedCategory="All"
          selectedAvailability={selectedAvailability}
          maxPrice={maxPrice}
          onCategoryChange={() => {}}
          onAvailabilityChange={setSelectedAvailability}
          onPriceChange={setMaxPrice}
          onReset={resetFilters}
          hideCategoryFilter
        />

        <ProductsGrid
          products={filteredProducts}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>
    </section>
  );
}