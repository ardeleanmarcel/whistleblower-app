"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, companyName }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Signup failed");
      }
    } catch {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">
          Create Account
        </h1>
        <p className="mt-2 text-sm text-slate-300">
          Sign up to start managing your company&apos;s whistleblower reports.
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
            htmlFor="companyName"
            className="block text-xs font-medium uppercase tracking-wide text-slate-300"
          >
            Company Name
          </label>
          <input
            id="companyName"
            required
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full rounded-md bg-slate-900/90 border border-slate-600 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition"
            placeholder="Acme Corp"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="email-signup"
            className="block text-xs font-medium uppercase tracking-wide text-slate-300"
          >
            Email
          </label>
          <input
            id="email-signup"
            required
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md bg-slate-900/90 border border-slate-600 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition"
            placeholder="manager@company.com"
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="password-signup"
            className="block text-xs font-medium uppercase tracking-wide text-slate-300"
          >
            Password
          </label>
          <input
            id="password-signup"
            required
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md bg-slate-900/90 border border-slate-600 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition"
            placeholder="••••••••"
            minLength={8}
          />
          <p className="text-xs text-slate-400">Minimum 8 characters</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 inline-flex w-full items-center justify-center rounded-md bg-emerald-500 px-3 py-2 text-sm font-medium text-slate-900 hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-900 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating account..." : "Sign up"}
        </button>

        <p className="text-[11px] text-slate-400 text-center mt-4">
          Already have an account?{" "}
          <Link
            href="/"
            className="text-emerald-400 hover:text-emerald-300 underline"
          >
            Log in
          </Link>
        </p>
      </form>
    </div>
  );
}
