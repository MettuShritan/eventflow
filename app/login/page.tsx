"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const r = useRouter();

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const d = await res.json();

    if (!res.ok) {
      setError(d.error || "Login failed");
      setLoading(false);
      return;
    }

    r.push(d.redirect);
  }

  return (
    <div className="gradient-bg relative flex min-h-screen items-center justify-center px-4">
      <div className="absolute right-5 top-5">
        <ThemeToggle />
      </div>

      <form
        onSubmit={submit}
        className="card w-full max-w-md p-8"
      >
        <Link
          href="/"
          className="text-sm font-semibold text-indigo-600 dark:text-indigo-400"
        >
          ← EventFlow
        </Link>

        <h1 className="mt-6 text-3xl font-black text-slate-900 dark:text-slate-100">
          Welcome back
        </h1>

        {error && (
          <div className="mt-4 rounded-xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-900/30 dark:text-rose-300">
            {error}
          </div>
        )}

        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none focus:ring-4 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-900"
              required
            />
          </label>

          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Password

            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-slate-900 outline-none focus:ring-4 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-900"
              required
            />
          </label>

          <button
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </div>

        <p className="mt-5 text-center text-sm text-slate-700 dark:text-slate-300">
          Need an account?{" "}
          <Link
            href="/register"
            className="font-bold text-indigo-600 dark:text-indigo-400"
          >
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}