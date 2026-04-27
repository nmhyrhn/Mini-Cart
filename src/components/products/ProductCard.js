"use client";

import { useCartStore } from "@/store/useCartStore";

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <article
      style={{
        border: "1px solid #d9d9d9",
        borderRadius: "12px",
        padding: "20px",
        backgroundColor: "lightpink",
        color: "black"
      }}
    >
      <div
        style={{
          height: "160px",
          borderRadius: "8px",
          backgroundColor: "#f3f4f6",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {product.image}
      </div>

      <h3 style={{padding: "10px 0"}}>{product.name}</h3>
      <p style={{padding: "10px 0"}}>{product.price.toLocaleString("ko-KR")}원</p>

      <button type="button" onClick={() => addToCart(product)} style={{padding: "3px", float: "right"}}>
        Add to Cart
      </button>
    </article>
  );
}
