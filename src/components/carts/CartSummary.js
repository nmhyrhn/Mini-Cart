"use client";

export default function CartSummary({ totalItems, totalPrice }) {
  const handleCheckout = () => {
    window.alert(`총 결제 금액은 ${totalPrice.toLocaleString(
      
    )}원입니다.`);
  };

  return (
    <aside
      style={{
        border: "1px solid #d9d9d9",
        borderRadius: "12px",
        padding: "16px",
        minWidth: "240px",
      }}
    >
      <h2>Summary</h2>
      <p>총 수량: {totalItems}</p>
      <p>총 금액: {totalPrice.toLocaleString("ko-KR")}원</p>
      <button type="button" onClick={handleCheckout}>
        결제하기
      </button>
    </aside>
  );
}
