"use client";

import { useMemo, useState } from "react";
import ProductsFilters from "@/components/store/products-filters";
import ProductsGrid from "@/components/store/products-grid";
import type { StorefrontProduct } from "@/lib/db/queries/storefront";

type ProductsPageViewProps = {
  products: StorefrontProduct[];
  categoryOptions: string[];
};

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

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
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

        <ProductsGrid
          products={filteredProducts}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>
    </section>
  );
}
