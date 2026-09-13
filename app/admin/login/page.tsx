"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Incorrect email or password.");
    } else {
      router.push("/admin");
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="text-center font-mono text-xs tracking-[0.2em] text-[#b8874a]">
          THE CASTLE OF IDEAS
        </p>
        <h1 className="mt-3 text-center font-serif text-3xl text-stone-50">Admin Login</h1>

        <form onSubmit={handleSubmit} className="mt-10 space-y-4">
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-stone-400">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-stone-700 bg-stone-900 px-4 py-2.5 text-stone-50 outline-none focus:border-[#b8874a]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-stone-400">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-stone-700 bg-stone-900 px-4 py-2.5 text-stone-50 outline-none focus:border-[#b8874a]"
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-[#b8874a] py-2.5 text-sm font-medium text-stone-950 transition-opacity disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
