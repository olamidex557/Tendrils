import ProductCard from "@/components/store/product-card";
import { products } from "@/lib/constants/products";

export default function ProductsGrid() {
  return (
    <div>
      {/* Top bar */}
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-stone-600">
          Showing 1-{products.length} results
        </p>

        <select className="rounded-full border px-3 py-2 text-sm">
          <option>Default Sorting</option>
          <option>Price Low → High</option>
          <option>Price High → Low</option>
        </select>
      </div>

      {/* Grid */}
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
            href="/products"
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-10 flex justify-center gap-3">
        <button className="h-10 w-10 rounded-full bg-black text-white">
          1
        </button>
        <button className="h-10 w-10 rounded-full bg-stone-100">
          2
        </button>
        <button className="h-10 w-10 rounded-full bg-stone-100">
          3
        </button>
      </div>
    </div>
  );
}