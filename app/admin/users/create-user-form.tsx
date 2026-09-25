"use client";

import { useState } from "react";

export default function F() {
  const [m, setM] = useState("");

  async function go(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;

    const r = await fetch("/api/admin/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(
        Object.fromEntries(new FormData(form).entries())
      ),
    });

    const d = await r.json();

    setM(r.ok ? "Created" : d.error || "Failed");

    if (r.ok) {
      form.reset();
    }
  }

  return (
    <form
      onSubmit={go}
      className="card mb-5 grid gap-3 p-5 md:grid-cols-4"
    >
      <input
        name="name"
        required
        placeholder="Name"
        className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900"
      />

      <input
        name="email"
        required
        type="email"
        placeholder="Email"
        className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900"
      />

      <input
        name="password"
        required
        placeholder="Password"
        className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:ring-indigo-900"
      />

      <select
        name="role"
        className="rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none focus:ring-4 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:focus:ring-indigo-900"
      >
        <option>EVENT_COMMITTEE</option>
        <option>PARTICIPANT</option>
        <option>ADMIN</option>
      </select>

      <button className="rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 md:col-span-4">
        Create account
      </button>

      {m && (
        <p className="text-sm text-slate-700 dark:text-slate-300 md:col-span-4">
          {m}
        </p>
      )}
    </form>
  );
}