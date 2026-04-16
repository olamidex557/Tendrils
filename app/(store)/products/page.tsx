"use client";

import { useMemo, useState } from "react";
import ProductsHero from "@/components/store/products-hero";
import ProductsFilters from "@/components/store/products-filters";
import ProductsGrid from "@/components/store/products-grid";
import BrandStrip from "@/components/store/brand-strip";
import { products } from "@/lib/constants/products";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");
  const [maxPrice, setMaxPrice] = useState(500000);
  const [sortBy, setSortBy] = useState("default");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "All") {
      result = result.filter(
        (product) =>
          (product.category || "").toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    if (selectedAvailability === "In Stock") {
      result = result.filter((product) => (product.stock ?? 10) > 0);
    }

    if (selectedAvailability === "Out of Stock") {
      result = result.filter((product) => (product.stock ?? 10) <= 0);
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
  }, [selectedCategory, selectedAvailability, maxPrice, sortBy]);

  function resetFilters() {
    setSelectedCategory("All");
    setSelectedAvailability("All");
    setMaxPrice(500000);
    setSortBy("default");
  }

  return (
    <main>
      <ProductsHero />

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <ProductsFilters
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

      <BrandStrip />
    </main>
  );
}
