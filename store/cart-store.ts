"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartMoqPricing = {
  id: string;
  minQuantity: number;
  pricePerUnit: number;
  isActive: boolean;
};

export type CartItem = {
  id: string;
  productId?: string;
  variantId?: string | null;
  sku?: string;
  slug: string;
  name: string;
  price: number;
  basePrice?: number;
  quantity: number;
  stockQuantity?: number | null;
  image?: string;
  category?: string;
  selectedOptions?: Record<string, string>;
  moqPricing?: CartMoqPricing[];
};

type CartStore = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string, variantId?: string | null) => void;
  updateQuantity: (
    id: string,
    quantity: number,
    variantId?: string | null
  ) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
};

function isSameCartLine(item: CartItem, id: string, variantId?: string | null) {
  return item.id === id && (item.variantId ?? null) === (variantId ?? null);
}

function getBulkPrice(item: CartItem, quantity: number) {
  const basePrice = Number(item.basePrice ?? item.price);

  const appliedTier =
    [...(item.moqPricing ?? [])]
      .filter(
        (tier) =>
          tier.isActive &&
          Number(tier.minQuantity) > 0 &&
          Number(tier.pricePerUnit) >= 0 &&
          quantity >= Number(tier.minQuantity)
      )
      .sort((a, b) => Number(b.minQuantity) - Number(a.minQuantity))[0] ??
    null;

  return appliedTier ? Number(appliedTier.pricePerUnit) : basePrice;
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

            const mergedItem: CartItem = {
              ...current,
              productId: item.productId ?? current.productId,
              variantId: item.variantId ?? current.variantId,
              sku: item.sku ?? current.sku,
              basePrice: item.basePrice ?? current.basePrice ?? current.price,
              stockQuantity: item.stockQuantity ?? current.stockQuantity,
              image: item.image ?? current.image,
              category: item.category ?? current.category,
              selectedOptions: item.selectedOptions ?? current.selectedOptions,
              moqPricing: item.moqPricing ?? current.moqPricing,
              quantity: nextQty,
            };

            updatedItems[existingIndex] = {
              ...mergedItem,
              price: getBulkPrice(mergedItem, nextQty),
            };

            return { items: updatedItems };
          }

          const nextItem: CartItem = {
            ...item,
            basePrice: item.basePrice ?? item.price,
            quantity: Math.min(requestedQty, maxQty),
          };

          return {
            items: [
              ...state.items,
              {
                ...nextItem,
                price: getBulkPrice(nextItem, nextItem.quantity),
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
                    typeof item.stockQuantity === "number" &&
                    item.stockQuantity >= 0
                      ? item.stockQuantity
                      : 9999;

                  const nextQty = Math.min(quantity, maxQty);

                  const nextItem = {
                    ...item,
                    quantity: nextQty,
                  };

                  return {
                    ...nextItem,
                    price: getBulkPrice(nextItem, nextQty),
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
      name: "TendrilsCart",
    }
  )
);