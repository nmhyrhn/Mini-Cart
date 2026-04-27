import Link from "next/link";
import ProductList from "@/components/products/ProductList";

async function getProducts() {
  const response = await fetch("http://localhost:3001/products", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("상품 데이터를 불러오지 못했습니다.");
  }

  return response.json();
}

export default async function Home() {
  const products = await getProducts();

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
        <h1>Mini Cart</h1>
        <Link href="/carts">장바구니 페이지로 이동</Link>
      </nav>

      <ProductList products={products} />
    </main>
  );
}
