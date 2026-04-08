"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
      router.push("/admin");
    } else {
      const data = await res.json();
      setError(data.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-body dark:bg-darkmode-body">
      <div className="w-full max-w-md rounded-lg bg-light p-8 shadow-md dark:bg-darkmode-light">
        <h1 className="mb-6 text-center h3 font-bold">Admin Login</h1>
        {error && <p className="mb-4 text-center text-red-500">{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-semibold">Username</label>
            <input
              type="text"
              className="form-input w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="mb-2 block text-sm font-semibold">Password</label>
            <input
              type="password"
              className="form-input w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
