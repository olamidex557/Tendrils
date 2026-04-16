import Link from "next/link";
import { getVisibleCategories } from "@/lib/db/queries/storefront";

export default async function StorefrontCategoryStrip() {
  const categories = await getVisibleCategories();

  if (categories.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-black/5 bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 overflow-x-auto px-4 py-4 md:px-6">
        <CategoryPill href="/categories" label="All Categories" active />

        {categories.map((category) => (
          <CategoryPill
            key={category.id}
            href={`/categories/${category.slug}`}
            label={category.name}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryPill({
  href,
  label,
  active = false,
}: {
  href: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
        active
          ? "bg-black text-white"
          : "bg-stone-100 text-stone-700 hover:bg-stone-200 hover:text-black"
      }`}
    >
      {label}
    </Link>
  );
}
