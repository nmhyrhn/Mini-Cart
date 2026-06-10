"use client";

import { create } from "zustand";
import {
  addCartItem,
  clearCartItems,
  fetchCart,
  removeCartItem,
  updateCartItem,
} from "@/api/cart";

export const useCartStore = create((set, get) => ({
  cart: [],
  errorMessage: "",

  loadCart: async () => {
    const cart = await fetchCart();
    set({ cart, errorMessage: "" });
  },

  addToCart: async (product) => {
    const productId = product.productId ?? product.id;
    const cart = await addCartItem(productId);
    set({ cart, errorMessage: "" });
  },

  removeFromCart: async (productId) => {
    const cart = await removeCartItem(productId);
    set({ cart, errorMessage: "" });
  },

  clearCart: async () => {
    const cart = await clearCartItems();
    set({ cart, errorMessage: "" });
  },

  increaseQty: async (productId) => {
    const foundItem = get().cart.find((item) => item.id === productId);

    if (!foundItem) {
      return;
    }

    const cart = await updateCartItem(productId, foundItem.quantity + 1);
    set({ cart, errorMessage: "" });
  },

  decreaseQty: async (productId) => {
    const foundItem = get().cart.find((item) => item.id === productId);

    if (!foundItem) {
      return;
    }

    if (foundItem.quantity === 1) {
      const cart = await removeCartItem(productId);
      set({ cart, errorMessage: "" });
      return;
    }

    const cart = await updateCartItem(productId, foundItem.quantity - 1);
    set({ cart, errorMessage: "" });
  },

  getTotalItems: () =>
    get().cart.reduce((total, item) => total + item.quantity, 0),
  getTotalPrice: () =>
    get().cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    ),
}));
