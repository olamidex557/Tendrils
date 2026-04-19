"use client";

import Link from "next/link";
import {
  ArrowLeft,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();

  const subtotal = getSubtotal();
  const shipping: number = 0;
  const total = subtotal + shipping;

  const hasInvalidItems = items.some((item) => {
    const stock =
      typeof item.stockQuantity === "number" ? item.stockQuantity : null;

    if (stock === null) return false;
    if (stock <= 0) return true;
    if (item.quantity > stock) return true;

    return false;
  });

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-16 md:px-6">
        <div className="rounded-[2rem] border border-dashed border-stone-300 bg-white p-10 text-center shadow-sm">
          <ShoppingBag className="mx-auto h-10 w-10 text-stone-400" />
          <h1 className="mt-6 text-3xl font-semibold text-black">
            Your cart is empty
          </h1>
          <p className="mt-3 text-sm text-stone-500">
            Looks like you haven’t added anything yet.
          </p>
          <Button
            asChild
            className="mt-6 rounded-full bg-black px-6 text-white hover:bg-black/90"
          >
            <Link href="/products">Start Shopping</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 md:px-6">
      <div className="mb-8 flex items-center gap-2 text-sm text-stone-500">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 transition hover:text-black"
        >
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>
      </div>

      <h1 className="mb-8 text-4xl font-semibold text-black">Your Cart</h1>

      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-5">
          {items.map((item) => {
            const stock =
              typeof item.stockQuantity === "number" ? item.stockQuantity : null;
            const outOfStock = stock !== null && stock <= 0;
            const maxReached = stock !== null && item.quantity >= stock;
            const overLimit = stock !== null && item.quantity > stock;

            return (
              <div
                key={`${item.id}-${item.variantId ?? "simple"}`}
                className="rounded-[1.5rem] border border-black/5 bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-xl bg-stone-100">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="flex-1">
                    <p className="text-sm font-medium text-black">{item.name}</p>

                    {item.category ? (
                      <p className="text-xs text-stone-500">{item.category}</p>
                    ) : null}

                    <p className="mt-2 text-sm font-semibold text-black">
                      ₦{Number(item.price).toLocaleString()}
                    </p>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1, item.variantId)
                        }
                        className="flex h-8 w-8 items-center justify-center rounded-full border border-stone-200"
                      >
                        <Minus className="h-4 w-4" />
                      </button>

                      <span className="w-6 text-center text-sm">
                        {item.quantity}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1, item.variantId)
                        }
                        disabled={outOfStock || maxReached}
                        className={`flex h-8 w-8 items-center justify-center rounded-full border ${
                          outOfStock || maxReached
                            ? "cursor-not-allowed border-stone-100 text-stone-300"
                            : "border-stone-200"
                        }`}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id, item.variantId)}
                    className="text-stone-400 transition hover:text-red-500"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {stock !== null ? (
                  <div className="mt-4">
                    {outOfStock ? (
                      <p className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Out of stock
                      </p>
                    ) : overLimit ? (
                      <p className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Reduce quantity to {stock} or less
                      </p>
                    ) : stock <= 5 ? (
                      <p className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
                        <AlertCircle className="h-3.5 w-3.5" />
                        Only {stock} left
                      </p>
                    ) : (
                      <p className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        In stock
                      </p>
                    )}
                  </div>
                ) : null}
              </div>
            );
          })}
        </section>

        <aside className="space-y-6">
          <div className="rounded-[1.75rem] border border-black/5 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-black">Order Summary</h2>

            <div className="mt-6 space-y-3">
              <Row label="Subtotal" value={`₦${subtotal.toLocaleString()}`} />
              <Row
                label="Shipping"
                value={shipping === 0 ? "Free" : `₦${shipping.toLocaleString()}`}
              />
              <Row label="Total" value={`₦${total.toLocaleString()}`} bold />
            </div>

            {hasInvalidItems ? (
              <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                One or more cart items exceed available stock. Adjust your cart before checkout.
              </div>
            ) : null}

            <Button
              asChild={!hasInvalidItems}
              disabled={hasInvalidItems}
              className="mt-6 w-full rounded-full bg-black text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {hasInvalidItems ? (
                <span>Resolve Stock Issues</span>
              ) : (
                <Link href="/checkout">Proceed to Checkout</Link>
              )}
            </Button>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Row({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "font-semibold text-black" : "text-stone-600"}>
        {label}
      </span>
      <span className={bold ? "font-semibold text-black" : "text-stone-700"}>
        {value}
      </span>
    </div>
  );
}