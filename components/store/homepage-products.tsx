import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ProductCard from "@/components/store/product-card";
import type { StorefrontProduct } from "@/lib/db/queries/storefront";

type HomepageProductsProps = {
  products: StorefrontProduct[];
};

export default function HomepageProducts({
  products,
}: HomepageProductsProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-stone-500">
            Published products
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-black">
            Fresh from the catalog
          </h2>
        </div>

        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-black transition hover:text-stone-700"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.slug}
            name={product.name}
            price={product.price}
            image={product.imageUrl ?? ""}
            description={product.shortDescription ?? undefined}
            category={product.categoryName ?? undefined}
            href="/products"
          />
        ))}
      </div>
    </section>
  );
}
