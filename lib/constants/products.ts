export type StoreProduct = {
  slug: string;
  name: string;
  price: number;
  badge?: string;
  category: string;
  description: string;
  shortDescription: string;
  image: string;
};

export const products: StoreProduct[] = [
  {
    slug: "wireless-earbuds",
    name: "Wireless Earbuds",
    price: 145000,
    badge: "Popular",
    category: "Electronics",
    shortDescription: "Rich sound, clean design, and long battery life.",
    description:
      "Experience premium sound with compact wireless earbuds designed for everyday comfort, long listening sessions, and a smooth modern lifestyle.",
    image:
      "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "noise-cancelling-headphones",
    name: "Noise Cancelling Headphones",
    price: 199000,
    badge: "New",
    category: "Electronics",
    shortDescription: "Immersive listening with premium over-ear comfort.",
    description:
      "Block out distractions and enjoy deep, immersive sound with a modern over-ear design made for travel, focus, and everyday entertainment.",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "premium-backpack",
    name: "Premium Backpack",
    price: 68000,
    badge: "Best Seller",
    category: "Fashion",
    shortDescription: "A stylish carry option for work, school, and travel.",
    description:
      "Built for convenience and everyday movement, this premium backpack combines comfort, storage, and a sleek modern look.",
    image:
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "smart-sneakers",
    name: "Smart Sneakers",
    price: 95000,
    badge: "Popular",
    category: "Fashion",
    shortDescription: "Street-ready comfort with a bold premium finish.",
    description:
      "Upgrade your everyday step with lightweight sneakers crafted for comfort, movement, and effortless style.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "fitness-kettlebell",
    name: "Fitness Kettlebell",
    price: 42000,
    badge: "Deal",
    category: "Sports",
    shortDescription: "Train smarter at home with durable equipment.",
    description:
      "A durable kettlebell designed for strength, conditioning, and easy integration into your workout routine.",
    image:
      "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1200&q=80",
  },
  {
    slug: "modern-desk-lamp",
    name: "Modern Desk Lamp",
    price: 37000,
    badge: "New",
    category: "Home Essentials",
    shortDescription: "Clean lighting for work, study, and focus.",
    description:
      "Add calm, focused lighting to your workspace with a modern desk lamp that blends functionality and style.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
  },
];