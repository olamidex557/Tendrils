"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  productId?: string;
  variantId?: string | null;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  stockQuantity?: number | null;
  image?: string;
  category?: string;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string, variantId?: string | null) => void;
  updateQuantity: (id: string, quantity: number, variantId?: string | null) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
};

function isSameCartLine(item: CartItem, id: string, variantId?: string | null) {
  return item.id === id && (item.variantId ?? null) === (variantId ?? null);
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const requestedQty = item.quantity ?? 1;
          const maxQty =
            typeof item.stockQuantity === "number" && item.stockQuantity >= 0
              ? item.stockQuantity
              : 9999;

          const existingIndex = state.items.findIndex((cartItem) =>
            isSameCartLine(cartItem, item.id, item.variantId ?? null)
          );

          if (existingIndex !== -1) {
            const updatedItems = [...state.items];
            const current = updatedItems[existingIndex];
            const nextQty = Math.min(current.quantity + requestedQty, maxQty);

            updatedItems[existingIndex] = {
              ...current,
              stockQuantity: item.stockQuantity ?? current.stockQuantity,
              quantity: nextQty,
            };

            return { items: updatedItems };
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                quantity: Math.min(requestedQty, maxQty),
              },
            ],
          };
        }),

      removeItem: (id, variantId) =>
        set((state) => ({
          items: state.items.filter(
            (item) => !isSameCartLine(item, id, variantId ?? null)
          ),
        })),

      updateQuantity: (id, quantity, variantId) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter(
                  (item) => !isSameCartLine(item, id, variantId ?? null)
                )
              : state.items.map((item) => {
                  if (!isSameCartLine(item, id, variantId ?? null)) {
                    return item;
                  }

                  const maxQty =
                    typeof item.stockQuantity === "number" && item.stockQuantity >= 0
                      ? item.stockQuantity
                      : 9999;

                  return {
                    ...item,
                    quantity: Math.min(quantity, maxQty),
                  };
                }),
        })),

      clearCart: () => set({ items: [] }),

      getItemCount: () =>
        get().items.reduce((sum, item) => sum + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce(
          (sum, item) => sum + Number(item.price) * Number(item.quantity),
          0
        ),
    }),
    {
      name: "ajike-cart",
    }
  )
);