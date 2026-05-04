"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Menu, Search, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Logo from "@/components/shared/logo";
import { useCartStore } from "@/store/cart-store";
import { useWishlistStore } from "@/store/wishlist-store";

const navLinks = [
  { label: "About", href: "/about" },
  { label: "Products", href: "/products" },
  { label: "Categories", href: "/categories" },
  { label: "Track Order", href: "/order-tracking" },
  { label: "Contact", href: "/contact" },
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
      <div className="mx-auto max-w-7xl px-4 py-4 md:px-6 md:py-5">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent side="left" className="w-[88vw] max-w-[360px] p-0">
                <SheetHeader className="sr-only">
                  <SheetTitle>Store navigation</SheetTitle>
                  <SheetDescription>
                    Open the Tendrils mobile navigation menu to browse products,
                    categories, order tracking, wishlist, and cart.
                  </SheetDescription>
                </SheetHeader>

                <div className="flex h-full flex-col bg-white">
                  <div className="border-b border-stone-200 px-6 py-6">
                    <div className="flex items-center justify-between">
                      <Logo size="xl" className="scale-150" />
                    </div>

                    <p className="mt-4 text-sm leading-6 text-stone-500">
                      Explore Tendrils products, categories, and your shopping
                      essentials.
                    </p>
                  </div>

                  <div className="px-6 pt-5">
                    <SearchForm />
                  </div>

                  <nav className="flex flex-1 flex-col gap-2 px-4 py-5">
                    {navLinks.map((link) => (
                      <Link
                        key={link.label}
                        href={link.href}
                        className="rounded-2xl px-4 py-3 text-base font-medium text-stone-700 transition hover:bg-stone-100 hover:text-black"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  <div className="border-t border-stone-200 px-4 py-5">
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        asChild
                        variant="outline"
                        className="rounded-full"
                      >
                        <Link
                          href="/wishlist"
                          className="flex items-center justify-center gap-2"
                        >
                          <Heart className="h-4 w-4" />
                          Wishlist
                          {mounted && wishlistCount > 0 ? (
                            <span className="rounded-full bg-black px-2 py-0.5 text-[10px] text-white">
                              {wishlistCount}
                            </span>
                          ) : null}
                        </Link>
                      </Button>

                      <Button
                        asChild
                        className="rounded-full bg-black text-white hover:bg-black/90"
                      >
                        <Link
                          href="/cart"
                          className="flex items-center justify-center gap-2"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Cart
                          {mounted && itemCount > 0 ? (
                            <span className="rounded-full bg-white px-2 py-0.5 text-[10px] text-black">
                              {itemCount}
                            </span>
                          ) : null}
                        </Link>
                      </Button>
                    </div>
                  </div>
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
            <SearchForm className="mx-auto max-w-md lg:max-w-lg" />
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
          <SearchForm />
        </div>
      </div>
    </header>
  );
}

function SearchForm({ className = "" }: { className?: string }) {
  return (
    <form action="/products" role="search" className={className}>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <Input
          name="search"
          type="search"
          placeholder="Search products in Tendrils"
          className="h-11 rounded-full border-black/10 bg-stone-50 pl-10 pr-4 shadow-none focus-visible:ring-1 focus-visible:ring-black/20"
        />
      </div>
    </form>
  );
}
