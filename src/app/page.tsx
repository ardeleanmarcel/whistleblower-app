// src/app/page.tsx
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Manager Login</h1>
        <p className="mt-2 text-sm text-slate-300">
          Sign in to manage company magic links and reports.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-slate-800/80 border border-slate-700 rounded-2xl p-6 shadow-xl backdrop-blur"
      >
        {error && (
          <p className="text-sm text-red-400 bg-red-950/40 border border-red-700/60 rounded px-3 py-2">
            {error}
          </p>
        )}

        <div className="space-y-1.5">
          <label
            htmlFor="email"
            className="block text-xs font-medium uppercase tracking-wide text-slate-300"
          >
            Email
          </label>
          <input
            id="email"
            className="w-full rounded-md border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="you@company.com"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password"
            className="block text-xs font-medium uppercase tracking-wide text-slate-300"
          >
            Password
          </label>
          <input
            id="password"
            className="w-full rounded-md border border-slate-600 bg-slate-900/70 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-900 transition"
        >
          Log in
        </button>

        <p className="text-[11px] text-slate-400 text-center mt-4">
          Don&apos;t have an account?{" "}
          <a
            href="/signup"
            className="text-emerald-400 hover:text-emerald-300 underline"
          >
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}
