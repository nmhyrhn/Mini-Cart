export async function fetchProducts() {
  const response = await fetch("http://localhost:3001/products", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("상품 데이터를 불러오지 못했습니다.");
  }

  return response.json();
}
