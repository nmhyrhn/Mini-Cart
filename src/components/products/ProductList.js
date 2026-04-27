import ProductCard from "./ProductCard";

export default function ProductList({ products }) {
  return (
    <section>
      <h2 style={{padding: "10px 0"}}>상품 목록</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
        }}
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
