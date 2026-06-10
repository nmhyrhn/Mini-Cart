const CART_API_URL = "http://localhost:8080/backend/api/cart";

async function requestCart(url, options = {}) {
  let response;

  try {
    response = await fetch(url, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch (error) {
    throw new Error("백엔드 서버에 연결할 수 없습니다.");
  }

  if (!response.ok) {
    const message = await response.json().catch(() => "장바구니 요청에 실패했습니다.");
    throw new Error(message);
  }

  return response.json();
}

export function fetchCart() {
  return requestCart(CART_API_URL);
}

export function addCartItem(productId) {
  return requestCart(CART_API_URL, {
    method: "POST",
    body: JSON.stringify({ productId }),
  });
}

export function updateCartItem(productId, quantity) {
  return requestCart(CART_API_URL, {
    method: "PUT",
    body: JSON.stringify({ productId, quantity }),
  });
}

export function removeCartItem(productId) {
  return requestCart(`${CART_API_URL}?productId=${productId}`, {
    method: "DELETE",
  });
}

export function clearCartItems() {
  return requestCart(CART_API_URL, {
    method: "DELETE",
  });
}
