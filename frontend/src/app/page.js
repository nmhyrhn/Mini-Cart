import Link from "next/link";
import { fetchProducts } from "@/api/products";
import ProductList from "@/components/products/ProductList";

export default async function Home() {
  const products = await fetchProducts();

  return (
    <main style={{ padding: "24px" }}>
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
        }}
      >
        <h1 style={{ margin: "10px" }}>Mini Cart</h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/login">로그인</Link>
          <Link href="/carts">장바구니 페이지</Link>
        </div>
      </nav>

      <ProductList products={products} />
    </main>
  );
}
