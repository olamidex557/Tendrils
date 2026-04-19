"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Logo from "@/components/shared/logo";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

const navLinks = [
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Track Order", href: "/order-tracking" },
];

export default function Navbar() {
  const [mounted, setMounted] = useState(false);

  const itemCount = useCartStore((state) => state.getItemCount());
  const wishlistCount = useWishlistStore((state) => state.getItemCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-[280px]">
                <div className="mt-8 flex flex-col gap-5">
                  <Logo />
                  <nav className="flex flex-col gap-4 text-sm">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="text-stone-700 transition hover:text-black"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <Button asChild className="rounded-full">
                    <Link href="/cart">Go to Cart</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          <div className="shrink-0 flex items-center">
            <Link href="/">
              <Logo size="xl" className="scale-150 md:scale-175 lg:scale-200" />
            </Link>
          </div>

          <div className="hidden flex-1 md:block">
            <div className="relative mx-auto max-w-md lg:max-w-lg">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
              <Input
                type="search"
                placeholder="Search products in Tendrils"
                className="h-11 rounded-full border-black/10 bg-stone-50 pl-10 pr-4 shadow-none focus-visible:ring-1 focus-visible:ring-black/20"
              />
            </div>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-stone-700 transition hover:text-black"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <Button
              asChild
              variant="outline"
              size="icon"
              className="relative rounded-full"
            >
              <Link href="/wishlist" aria-label="Wishlist">
                <Heart className="h-5 w-5" />
                {mounted && wishlistCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white">
                    {wishlistCount}
                  </span>
                ) : null}
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="icon"
              className="relative rounded-full"
            >
              <Link href="/cart" aria-label="Cart">
                <ShoppingCart className="h-5 w-5" />
                {mounted && itemCount > 0 ? (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white">
                    {itemCount}
                  </span>
                ) : null}
              </Link>
            </Button>
          </div>
        </div>

        <div className="mt-4 md:hidden">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <Input
              type="search"
              placeholder="Search products in Ajike+"
              className="h-11 rounded-full border-black/10 bg-stone-50 pl-10 pr-4 shadow-none focus-visible:ring-1 focus-visible:ring-black/20"
            />
          </div>
        </div>
      </div>
    </header>
  );
}