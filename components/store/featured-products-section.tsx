import Link from "next/link";
import ProductCard from "@/components/store/product-card";

const featuredProducts = [
  {
    id: "wireless-earbuds",
    name: "Wireless Earbuds",
    price: 145000,
    badge: "Popular",
    description: "High-quality sound, long battery life, and everyday comfort.",
    image:
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "smart-sneakers",
    name: "Smart Sneakers",
    price: 95000,
    badge: "New",
    description: "Street-ready comfort with a premium modern finish.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "noise-cancelling-headphones",
    name: "Noise Cancelling Headphones",
    price: 185000,
    badge: "Best Seller",
    description: "Deep bass, immersive audio, and all-day listening.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "premium-backpack",
    name: "Premium Backpack",
    price: 68000,
    badge: "Popular",
    description: "A stylish everyday carry for work, school, and travel.",
    image:
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "fitness-kettlebell",
    name: "Fitness Kettlebell",
    price: 42000,
    badge: "Deal",
    description: "Train smarter at home with durable premium equipment.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "modern-desk-lamp",
    name: "Modern Desk Lamp",
    price: 37000,
    badge: "New",
    description: "Clean lighting design perfect for work and study.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
  },
];

export default function FeaturedProductsSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight text-black md:text-4xl">
            Featured Products
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            Explore top picks customers are loving right now.
          </p>
        </div>

        <Link
          href="/products"
          className="text-sm font-medium text-stone-600 transition hover:text-black"
        >
          View all
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {featuredProducts.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            name={product.name}
            price={product.price}
            image={product.image}
            badge={product.badge}
            description={product.description}
            href="/products"
          />
        ))}
      </div>
    </section>
  );
}