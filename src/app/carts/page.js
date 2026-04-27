"use client";

import Link from "next/link";
import CartItem from "@/components/carts/CartItem";
import CartSummary from "@/components/carts/CartSummary";
import { useCartStore } from "@/store/useCartStore";

export default function Carts() {
  const cart = useCartStore((state) => state.cart);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  return (
    <main style={{ padding: "24px" }}>
      <nav>
        <p>Cart Page</p>
        <Link href="/">홈으로 돌아가기</Link>
      </nav>

      <div style={{ marginTop: "24px" }}>
        <h1>장바구니</h1>

        {cart.length === 0 ? (
          <p>장바구니가 비어 있습니다.</p>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "24px",
              alignItems: "flex-start",
            }}
          >
            <section
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                flex: 2,
                minWidth: "320px",
              }}
            >
              {cart.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </section>

            <div style={{ flex: 1, minWidth: "240px" }}>
              <CartSummary totalItems={totalItems} totalPrice={totalPrice} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
