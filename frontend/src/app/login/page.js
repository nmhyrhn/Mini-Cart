"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { fetchMe, login, logout } from "@/api/auth";

export default function LoginPage() {
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, setLoginUser] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchMe().then((user) => {
      if (user) {
        setLoginUser(user);
        setMessage(`${user.name}님 로그인 중`);
      }
    });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");

    try {
      const user = await login(loginId, password);
      setLoginUser(user);
      setMessage(`${user.name}님 로그인 성공`);
    } catch (error) {
      setLoginUser(null);
      setMessage(error.message);
    }
  };

  const handleLogout = async () => {
    await logout();
    setLoginUser(null);
    setMessage("로그아웃 되었습니다.");
  };

  return (
    <main style={{ padding: "24px", maxWidth: "420px" }}>
      <nav style={{ marginBottom: "24px" }}>
        <Link href="/">홈으로 돌아가기</Link>
      </nav>

      <h1 style={{ marginBottom: "20px" }}>로그인</h1>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "12px" }}>
        <label>
          아이디
          <input
            value={loginId}
            onChange={(event) => setLoginId(event.target.value)}
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </label>

        <label>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={{ display: "block", width: "100%", padding: "8px" }}
          />
        </label>

        <button type="submit" style={{ padding: "8px" }}>
          로그인
        </button>
      </form>

      {loginUser && (
        <button type="button" onClick={handleLogout} style={{ marginTop: "12px", padding: "8px" }}>
          로그아웃
        </button>
      )}

      {message && <p style={{ marginTop: "16px" }}>{message}</p>}
    </main>
  );
}
