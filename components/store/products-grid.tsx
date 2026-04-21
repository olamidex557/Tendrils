"use client";

import ProductCard from "@/components/store/product-card";

type Product = {
  id: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  shortDescription: string | null;
  categoryName: string | null;
  stockQuantity: number;
  isFeatured?: boolean;
  comparePrice?: number | null;
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
      <div className="mb-4 hidden flex-col gap-3 sm:mb-6 sm:flex sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-stone-600">
          Showing {products.length} result{products.length !== 1 ? "s" : ""}
        </p>

        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="h-10 rounded-full border border-stone-200 bg-white px-4 text-sm outline-none"
        >
          <option value="default">Default Sorting</option>
          <option value="price-asc">Price Low → High</option>
          <option value="price-desc">Price High → Low</option>
          <option value="name-asc">Name A → Z</option>
          <option value="name-desc">Name Z → A</option>
        </select>
      </div>

      <p className="mb-4 text-sm text-stone-600 sm:hidden">
        Showing {products.length} result{products.length !== 1 ? "s" : ""}
      </p>

      {products.length === 0 ? (
        <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-10 text-center">
          <h3 className="text-xl font-semibold text-black">No products found</h3>
          <p className="mt-2 text-sm text-stone-500">
            Try adjusting your filters or publish products from the admin dashboard.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              id={product.slug}
              productId={product.id}
              variantId={null}
              name={product.name}
              price={product.price}
              comparePrice={product.comparePrice ?? null}
              image={product.imageUrl ?? ""}
              description={product.shortDescription ?? undefined}
              category={product.categoryName ?? undefined}
              stockQuantity={Number(product.stockQuantity ?? 0)}
              featured={Boolean(product.isFeatured)}
              href="/products"
            />
          ))}
        </div>
      )}
    </div>
  );
}