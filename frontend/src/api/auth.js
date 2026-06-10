const AUTH_API_BASE_URL = "http://localhost:8080/backend/api/auth";

export async function login(loginId, password) {
  let response;

  try {
    response = await fetch(`${AUTH_API_BASE_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ loginId, password }),
    });
  } catch {
    throw new Error("백엔드 서버에 연결할 수 없습니다.");
  }

  if (!response.ok) {
    const message = await response.json().catch(() => "로그인에 실패했습니다.");
    throw new Error(message);
  }

  return response.json();
}

export async function fetchMe() {
  const response = await fetch(`${AUTH_API_BASE_URL}/me`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  return response.json();
}

export async function logout() {
  const response = await fetch(`${AUTH_API_BASE_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("로그아웃에 실패했습니다.");
  }
}
