"use client";

import { Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

export default function CartTable() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const clearCart = useCartStore((state) => state.clearCart);

  if (items.length === 0) {
    return (
      <div className="rounded-[1.5rem] border border-dashed border-stone-300 bg-white p-10 text-center">
        <h2 className="text-2xl font-semibold text-black">Your cart is empty</h2>
        <p className="mt-2 text-sm text-stone-600">
          Add some products to start shopping.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-[1.5rem] border border-black/5 bg-white shadow-sm">
        <div className="hidden grid-cols-[1.6fr_0.6fr_0.8fr_0.7fr] bg-amber-400 px-6 py-4 text-sm font-semibold text-black md:grid">
          <span>Product</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Subtotal</span>
        </div>

        <div className="divide-y divide-stone-200">
          {items.map((item) => (
            <div
              key={item.id}
              className="grid gap-4 px-4 py-5 md:grid-cols-[1.6fr_0.6fr_0.8fr_0.7fr] md:px-6"
            >
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="mt-2 text-stone-400 transition hover:text-black"
                  aria-label={`Remove ${item.name}`}
                >
                  <X className="h-4 w-4" />
                </button>

                <img
                  src={item.image}
                  alt={item.name}
                  className="h-20 w-20 rounded-xl object-cover bg-stone-100"
                />

                <div>
                  <h3 className="font-semibold text-black">{item.name}</h3>
                  <p className="mt-1 text-sm text-stone-500">
                    Category: {item.category || "General"}
                  </p>
                </div>
              </div>

              <div className="flex items-center text-sm font-medium text-black">
                ₦{item.price.toLocaleString()}
              </div>

              <div className="flex items-center">
                <div className="flex items-center rounded-full border border-stone-200">
                  <button
                    type="button"
                    onClick={() => decreaseQuantity(item.id)}
                    className="flex h-10 w-10 items-center justify-center text-stone-600 transition hover:text-black"
                  >
                    <Minus className="h-4 w-4" />
                  </button>

                  <span className="min-w-10 text-center text-sm font-medium">
                    {item.quantity}
                  </span>

                  <button
                    type="button"
                    onClick={() => increaseQuantity(item.id)}
                    className="flex h-10 w-10 items-center justify-center text-stone-600 transition hover:text-black"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center text-sm font-semibold text-black">
                ₦{(item.price * item.quantity).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex w-full max-w-md gap-3">
          <input
            type="text"
            placeholder="Coupon Code"
            className="h-11 flex-1 rounded-full border border-stone-200 px-4 text-sm outline-none"
          />
          <Button variant="outline" className="h-11 rounded-full px-5">
            Apply Coupon
          </Button>
        </div>

        <button
          type="button"
          onClick={clearCart}
          className="text-sm font-medium text-stone-600 underline-offset-4 transition hover:text-black hover:underline"
        >
          Clear Shopping Cart
        </button>
      </div>
    </div>
  );
}