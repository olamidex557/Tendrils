"use client";

import { useCartStore } from "@/store/cart-store";

export default function CheckoutSummary() {
  const items = useCartStore((state) => state.items);
  const subtotal = useCartStore((state) => state.getSubtotal());

  const shipping = items.length > 0 ? 0 : 0;
  const taxes = 0;
  const total = subtotal + shipping + taxes;

  return (
    <div className="rounded-[1.5rem] border border-black/5 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-black">Order Summary</h2>

      <div className="mt-6 space-y-4">
        {items.length === 0 ? (
          <p className="text-sm text-stone-500">No items in cart.</p>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 border-b border-stone-100 pb-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-14 w-14 rounded-xl object-cover bg-stone-100"
                />
                <div>
                  <p className="text-sm font-medium text-black">{item.name}</p>
                  <p className="text-xs text-stone-500">
                    Qty: {item.quantity}
                  </p>
                </div>
              </div>

              <p className="text-sm font-semibold text-black">
                ₦{(item.price * item.quantity).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 space-y-3 text-sm">
        <div className="flex items-center justify-between text-stone-600">
          <span>Subtotal</span>
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
      </div>

      <div className="mt-5 border-t border-stone-200 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-black">Total</span>
          <span className="text-lg font-bold text-black">
            ₦{total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}
