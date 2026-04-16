"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type WishlistItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  description?: string;
};

type WishlistStore = {
  items: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (id: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
  getItemCount: () => number;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const exists = state.items.some((wishlistItem) => wishlistItem.id === item.id);
          if (exists) return state;
          return { items: [...state.items, item] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      toggleItem: (item) =>
        set((state) => {
          const exists = state.items.some((wishlistItem) => wishlistItem.id === item.id);

          if (exists) {
            return {
              items: state.items.filter((wishlistItem) => wishlistItem.id !== item.id),
            };
          }

          return {
            items: [...state.items, item],
          };
        }),

      isInWishlist: (id) =>
        get().items.some((item) => item.id === id),

      clearWishlist: () => set({ items: [] }),

      getItemCount: () => get().items.length,
    }),
    {
      name: "ajike-wishlist",
    }
  )
);
