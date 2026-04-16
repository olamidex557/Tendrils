import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { StorefrontCategory } from "@/lib/db/queries/storefront";

type HomepageCategoriesProps = {
  categories: StorefrontCategory[];
};

export default function HomepageCategories({
  categories,
}: HomepageCategoriesProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-stone-500">
            Featured categories
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-black">
            Shop by category
          </h2>
        </div>

        <Link
          href="/categories"
          className="inline-flex items-center gap-2 text-sm font-medium text-black transition hover:text-stone-700"
        >
          View all
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/categories/${category.slug}`}
            className="group overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="h-56 overflow-hidden bg-stone-100">
              <img
                src={category.imageUrl ?? ""}
                alt={category.name}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <div className="space-y-3 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-xl font-semibold text-black">
                  {category.name}
                </h3>

                {category.isFeatured ? (
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                    Featured
                  </span>
                ) : null}
              </div>

              <p className="text-sm leading-6 text-stone-500">
                {category.description ?? "Explore products in this category."}
              </p>

              <div className="inline-flex items-center gap-2 text-sm font-medium text-black">
                Explore
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
