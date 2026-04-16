import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { StorefrontCategory } from "@/lib/db/queries/storefront";

type CategoriesGridProps = {
  categories: StorefrontCategory[];
};

export default function CategoriesGrid({ categories }: CategoriesGridProps) {
  const featuredCategories = categories.filter((category) => category.isFeatured);

  if (categories.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-10 text-center">
        <h2 className="text-2xl font-semibold text-black">No categories yet</h2>
        <p className="mt-2 text-sm text-stone-500">
          Publish visible categories from the admin dashboard to show them here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {featuredCategories.length > 0 ? (
        <section>
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-stone-500">
                Featured
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black">
                Top shopping lanes
              </h2>
            </div>

            <p className="text-sm text-stone-500">
              Explore the most active categories in the store.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {featuredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative h-72 overflow-hidden bg-stone-100">
                  <img
                    src={category.imageUrl ?? ""}
                    alt={category.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                          Featured category
                        </p>
                        <h3 className="mt-2 text-2xl font-semibold">
                          {category.name}
                        </h3>
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black transition group-hover:translate-x-1">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-stone-500">
              Browse all
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black">
              All categories
            </h2>
          </div>

          <p className="text-sm text-stone-500">
            Find what you need faster by jumping into a category.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
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

              <div className="space-y-4 p-5">
                <div>
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

                  <p className="mt-3 text-sm leading-6 text-stone-500">
                    {category.description ?? "Explore products in this category."}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-black">
                  <span>Explore Category</span>
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}