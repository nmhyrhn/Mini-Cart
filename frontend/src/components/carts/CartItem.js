"use client";

import { useCartStore } from "@/store/useCartStore";

export default function CartItem({ item }) {
  const increaseQty = useCartStore((state) => state.increaseQty);
  const decreaseQty = useCartStore((state) => state.decreaseQty);
  const removeFromCart = useCartStore((state) => state.removeFromCart);
  const productId = item.id ?? item.productId;

  const handleCartAction = async (action) => {
    try {
      await action(productId);
    } catch (error) {
      window.alert(error.message);
    }
  };

  return (
    <article
      style={{
        border: "1px solid #d9d9d9",
        borderRadius: "12px",
        padding: "16px",
        backgroundColor: "lightpink",
        color: "black"
      }}
    >
      <h3 style={{paddingBottom: "10px"}}>{item.name}</h3>
      <p style={{paddingBottom: "10px"}}>가격: {item.price.toLocaleString("ko-KR")}원</p>
      <p style={{paddingBottom: "10px"}}>수량: {item.quantity}</p>
      <p style={{paddingBottom: "10px"}}>소계: {(item.price * item.quantity).toLocaleString("ko-KR")}원</p>

      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
        <button type="button" onClick={() => handleCartAction(decreaseQty)}>
          수량 감소
        </button>
        <button type="button" onClick={() => handleCartAction(increaseQty)}>
          수량 증가
        </button>
        <button type="button" onClick={() => handleCartAction(removeFromCart)}>
          상품 삭제
        </button>
      </div>
    </article>
  );
}
