import Link from "next/link";
import { Button } from "@/components/ui/button";

const showcaseCategories = [
  {
    title: "Electronics",
    description: "Latest gadgets, devices, and home tech.",
    image:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80",
    href: "/categories/electronics",
    className: "lg:row-span-2",
  },
  {
    title: "Home Essentials",
    description: "Furniture and everyday must-haves.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    href: "/categories/home-essentials",
    className: "",
  },
  {
    title: "Fashion",
    description: "Fresh styles and trending accessories.",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
    href: "/categories/fashion",
    className: "",
  },
  {
    title: "Grocery",
    description: "Daily needs, pantry staples, and more.",
    image:
      "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
    href: "/categories/grocery",
    className: "lg:row-span-2",
  },
];

export default function CategoriesShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-black">
            Explore Trending Categories
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Browse popular collections curated for fast discovery.
          </p>
        </div>

        <Link
          href="/categories/all"
          className="text-sm font-medium text-stone-600 transition hover:text-black"
        >
          View all
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-4 lg:grid-rows-2">
        {showcaseCategories.map((category) => (
          <div
            key={category.title}
            className={`group relative overflow-hidden rounded-[1.75rem] bg-stone-100 ${category.className}`}
          >
            <div className="absolute inset-0">
              <img
                src={category.image}
                alt={category.title}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-end p-6">
              <div className="max-w-xs rounded-2xl bg-white/90 p-4 backdrop-blur-sm">
                <h3 className="text-xl font-semibold text-black">
                  {category.title}
                </h3>
                <p className="mt-2 text-sm text-stone-600">
                  {category.description}
                </p>

                <Button
                  asChild
                  size="sm"
                  className="mt-4 rounded-full bg-black text-white hover:bg-black/90"
                >
                  <Link href={category.href}>Explore products</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}