"use client";

import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";

export default function ProductCard({ product }) {
  const addToCart = useCartStore((state) => state.addToCart);
  const hasPreviewImage = product.image?.startsWith("/");

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
          overflow: "hidden",
          borderRadius: "8px",
          backgroundColor: "#f3f4f6",
          marginBottom: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {hasPreviewImage ? (
          <Image
            src={product.image}
            alt={product.name}
            width={320}
            height={160}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          product.image
        )}
      </div>

      <h3 style={{padding: "10px 0"}}>{product.name}</h3>
      <p style={{padding: "10px 0"}}>{product.price.toLocaleString("ko-KR")}원</p>

      <button type="button" onClick={() => addToCart(product)} style={{padding: "3px", float: "right"}}>
        Add to Cart
      </button>
    </article>
  );
}
