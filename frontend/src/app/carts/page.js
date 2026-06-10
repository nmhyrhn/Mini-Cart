"use client";

import { useEffect } from "react";
import Link from "next/link";
import CartItem from "@/components/carts/CartItem";
import CartSummary from "@/components/carts/CartSummary";
import { useCartStore } from "@/store/useCartStore";

export default function Carts() {
  const cart = useCartStore((state) => state.cart);
  const loadCart = useCartStore((state) => state.loadCart);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  useEffect(() => {
    loadCart().catch(() => {
      window.alert("로그인 후 장바구니를 확인할 수 있습니다.");
    });
  }, [loadCart]);

  return (
    <main style={{ padding: "24px" }}>
      <nav>
        <h1 style={{padding: "10px 0"}}>Cart Page</h1>
        <Link href="/" style={{float: "right"}}>홈으로 돌아가기</Link>
      </nav>

      <div style={{ marginTop: "24px" }}>
        <h2 style={{paddingBottom: "20px"}}>장바구니</h2>

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
