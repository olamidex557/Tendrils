import Link from "next/link";
import { ArrowRight } from "lucide-react";

const categories = [
  {
    name: "Electronics",
    slug: "electronics",
    description: "Smart devices, gadgets, accessories, and modern essentials.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    count: 42,
    featured: true,
  },
  {
    name: "Fashion",
    slug: "fashion",
    description: "Trending styles, everyday wear, shoes, and statement looks.",
    image:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
    count: 57,
    featured: true,
  },
  {
    name: "Sports",
    slug: "sports",
    description: "Fitness gear, training equipment, and active lifestyle picks.",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=1200&q=80",
    count: 15,
    featured: false,
  },
  {
    name: "Home Essentials",
    slug: "home-essentials",
    description: "Beautiful and practical home items for everyday comfort.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    count: 19,
    featured: true,
  },
  {
    name: "Beauty",
    slug: "beauty",
    description: "Beauty tools, self-care picks, and confidence-boosting items.",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80",
    count: 8,
    featured: false,
  },
  {
    name: "Grocery",
    slug: "grocery",
    description: "Daily needs, pantry staples, snacks, and household supplies.",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    count: 24,
    featured: false,
  },
];

export default function CategoriesGrid() {
  const featuredCategories = categories.filter((category) => category.featured);

  return (
    <div className="space-y-12">
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
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-72 overflow-hidden bg-stone-100">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                        {category.count} products
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
              key={category.slug}
              href={`/categories/${category.slug}`}
              className="group overflow-hidden rounded-[1.75rem] border border-black/5 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-56 overflow-hidden bg-stone-100">
                <img
                  src={category.image}
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
                    <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                      {category.count}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-stone-500">
                    {category.description}
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
