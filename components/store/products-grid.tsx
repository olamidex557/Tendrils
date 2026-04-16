"use client";

import ProductCard from "@/components/store/product-card";

type Product = {
  slug: string;
  name: string;
  price: number;
  image: string;
  badge?: string;
  shortDescription?: string;
  category?: string;
  stock?: number;
};

type ProductsGridProps = {
  products: Product[];
  sortBy: string;
  onSortChange: (value: string) => void;
};

export default function ProductsGrid({
  products,
  sortBy,
  onSortChange,
}: ProductsGridProps) {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-600">
          Showing {products.length} result{products.length !== 1 ? "s" : ""}
        </p>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-full border px-4 py-2 text-sm"
        >
          <option value="default">Default Sorting</option>
          <option value="price-asc">Price Low → High</option>
          <option value="price-desc">Price High → Low</option>
          <option value="name-asc">Name A → Z</option>
          <option value="name-desc">Name Z → A</option>
        </select>
      </div>

      {products.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-10 text-center">
          <h3 className="text-xl font-semibold text-black">No products found</h3>
          <p className="mt-2 text-sm text-stone-500">
            Try adjusting your filters.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.slug}
              id={product.slug}
              name={product.name}
              price={product.price}
              image={product.image}
              badge={product.badge}
              description={product.shortDescription}
              category={product.category}
              href="/products"
            />
          ))}
        </div>
      )}
    </div>
  );
}
