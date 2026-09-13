"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SearchOverlay({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const t = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then((d) => setResults(d.results || []))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-stone-950/90 backdrop-blur-sm px-4 pt-[12vh]">
      <div className="w-full max-w-xl" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3 border-b border-stone-200/20 pb-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-stone-400 shrink-0">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes, e.g. AI, robotics, design..."
            className="w-full bg-transparent font-display text-xl md:text-2xl text-stone-50 placeholder:text-stone-500 outline-none"
          />
          <button onClick={onClose} className="text-xs text-stone-500 hover:text-stone-200 shrink-0">
            ESC
          </button>
        </div>

        <div className="mt-6 max-h-[50vh] overflow-y-auto">
          {loading && <p className="text-sm text-stone-500">Searching…</p>}
          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <p className="text-sm text-stone-500">No notes found for “{query}”.</p>
          )}
          <ul className="space-y-1">
            {results.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/notes/${r.slug}`}
                  onClick={onClose}
                  className="block rounded-md px-3 py-3 hover:bg-stone-200/5 transition-colors"
                >
                  <p className="text-[10px] uppercase tracking-[0.14em] text-accent">
                    {r.category}
                  </p>
                  <p className="font-display text-lg text-stone-50">{r.title}</p>
                  <p className="text-sm text-stone-400 line-clamp-1">{r.excerpt}</p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="fixed inset-0 -z-10" onClick={onClose} />
    </div>
  );
}
