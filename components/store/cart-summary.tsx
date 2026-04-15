"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

export default function CartSummary() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());
  const itemCount = useCartStore((state) => state.getItemCount());

  const shipping = items.length > 0 ? 0 : 0;
  const taxes = 0;
  const couponDiscount = 0;
  const total = subtotal + shipping + taxes - couponDiscount;

  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-black">Order Summary</h2>

      <div className="mt-6 space-y-4 text-sm">
        <div className="flex items-center justify-between text-stone-600">
          <span>Items</span>
          <span>{itemCount}</span>
        </div>

        <div className="flex items-center justify-between text-stone-600">
          <span>Sub Total</span>
          <span>₦{subtotal.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between text-stone-600">
          <span>Shipping</span>
          <span>₦{shipping.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between text-stone-600">
          <span>Taxes</span>
          <span>₦{taxes.toLocaleString()}</span>
        </div>

        <div className="flex items-center justify-between text-stone-600">
          <span>Coupon Discount</span>
          <span>-₦{couponDiscount.toLocaleString()}</span>
        </div>
      </div>

      <div className="mt-6 border-t border-stone-200 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-black">Total</span>
          <span className="text-lg font-bold text-black">
            ₦{total.toLocaleString()}
          </span>
        </div>
      </div>

      <Button
        asChild
        className="mt-6 h-12 w-full rounded-full bg-black text-white hover:bg-black/90"
      >
        <Link href="/checkout">Proceed to Checkout</Link>
      </Button>
    </div>
  );
}