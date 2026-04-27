"use client";

import Link from "next/link";
import CartItem from "@/components/carts/CartItem";
import CartSummary from "@/components/carts/CartSummary";
import { useCartStore } from "@/store/useCartStore";

const sampleProducts = [
  {
    id: 101,
    name: "테스트 티셔츠",
    price: 19900,
    image: "test-shirt.jpg",
  },
  {
    id: 102,
    name: "테스트 데님 팬츠",
    price: 45900,
    image: "test-denim.jpg",
  },
  {
    id: 103,
    name: "테스트 스니커즈",
    price: 68900,
    image: "test-sneakers.jpg",
  },
];

export default function CartsTestPage() {
  const cart = useCartStore((state) => state.cart);
  const addToCart = useCartStore((state) => state.addToCart);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const totalPrice = useCartStore((state) => state.getTotalPrice());

  const handleSeedCart = () => {
    sampleProducts.forEach((product, index) => {
      addToCart(product);

      if (index === 0) {
        addToCart(product);
      }
    });
  };

  return (
    <main style={{ padding: "24px" }}>
      <header
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "24px",
        }}
      >
        <p>Cart Test Page</p>
        <h1>장바구니 임시 테스트</h1>
        <p>팀원 페이지 없이도 장바구니 동작을 확인할 수 있는 테스트용 화면입니다.</p>
        <Link href="/">홈으로 돌아가기</Link>
      </header>

      <section
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        <button type="button" onClick={handleSeedCart}>
          샘플 상품 담기
        </button>
        <button type="button" onClick={clearCart}>
          장바구니 비우기
        </button>
      </section>

      {cart.length === 0 ? (
        <section>
          <h2>장바구니가 비어 있습니다.</h2>
          <p>샘플 상품 담기 버튼을 눌러서 UI를 테스트해보세요.</p>
        </section>
      ) : (
        <section
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            alignItems: "flex-start",
          }}
        >
          <div
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
          </div>

          <div style={{ flex: 1, minWidth: "240px" }}>
            <CartSummary totalItems={totalItems} totalPrice={totalPrice} />
          </div>
        </section>
      )}
    </main>
  );
}
