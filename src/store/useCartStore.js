"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],


      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cart.find((item) => item.id === product.id);

          if (existingItem) {
            return {
              cart: state.cart.map((item) =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          }

          return {
            cart: [...state.cart, { ...product, quantity: 1 }],
          };
        }),


      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item.id !== productId),
        })),

        
      clearCart: () => set({ cart: [] }),


      increaseQty: (productId) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item.id === productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        })),
        
      decreaseQty: (productId) =>
        set((state) => ({
          cart: state.cart.flatMap((item) => {
            if (item.id !== productId) {
              return [item];
            }

            if (item.quantity === 1) {
              return [];
            }

            return [{ ...item, quantity: item.quantity - 1 }];
          }),
        })),
      getTotalItems: () =>
        get().cart.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () =>
        get().cart.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        ),
    }),
    {
      name: "cart-storage",
    }
  )
);
