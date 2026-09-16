"use client";

import { useState } from "react";

export default function SecretGate() {
  const [pin, setPin] = useState("");
  const [content, setContent] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/secret-unlock", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    setLoading(false);
    if (res.ok) {
      const data = await res.json();
      setContent(data.content);
    } else {
      setError("Wrong PIN.");
      setPin("");
    }
  }

  if (content !== null) {
    return (
      <div className="mt-10 whitespace-pre-wrap text-[var(--ink-muted)] leading-relaxed">
        {content || "Nothing written yet. Add something from the admin Pages screen."}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 max-w-xs">
      <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-[var(--ink-dim)]">
        Enter PIN
      </label>
      <input
        type="password"
        inputMode="numeric"
        maxLength={4}
        value={pin}
        onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
        className="w-full rounded-md border border-[var(--border-strong)] bg-transparent px-4 py-3 text-center text-2xl tracking-[0.5em] text-[var(--ink)] outline-none focus:border-accent"
        autoFocus
      />
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={loading || pin.length < 4}
        className="mt-4 w-full rounded-full bg-accent px-6 py-3 text-sm font-medium text-stone-950 disabled:opacity-50"
      >
        {loading ? "Checking..." : "Unlock"}
      </button>
    </form>
  );
}
