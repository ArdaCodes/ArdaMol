"use client";

import { useMemo, useState } from "react";
import NoteCard from "./NoteCard";

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  coverImage: string | null;
  publishedAt: Date | string | null;
  readingTime: number;
  category: { name: string; slug: string } | null;
  tags: string[];
};

export default function NotesExplorer({
  posts,
  categories,
  tags,
}: {
  posts: Post[];
  categories: { name: string; slug: string }[];
  tags: { name: string; slug: string }[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [tag, setTag] = useState<string | null>(null);
  const [sort, setSort] = useState<"latest" | "oldest">("latest");

  const filtered = useMemo(() => {
    let list = posts.filter((p) => {
      const matchesQuery =
        query.trim() === "" ||
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !category || p.category?.slug === category;
      const matchesTag = !tag || p.tags.includes(tag);
      return matchesQuery && matchesCategory && matchesTag;
    });
    list = list.sort((a, b) => {
      const da = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const db = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return sort === "latest" ? db - da : da - db;
    });
    return list;
  }, [posts, query, category, tag, sort]);

  return (
    <div>
      <div className="mt-14 flex flex-col gap-6 border-y border-[var(--border)] py-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3 md:w-72">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="shrink-0 text-[var(--ink-dim)]">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search notes"
            className="w-full bg-transparent text-sm text-[var(--ink)] placeholder:text-[var(--ink-dim)] outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={category || ""}
            onChange={(e) => setCategory(e.target.value || null)}
            className="rounded-full border border-[var(--border-strong)] bg-transparent px-3 py-1.5 text-xs text-[var(--ink-muted)] outline-none"
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug} className="text-stone-900">
                {c.name}
              </option>
            ))}
          </select>
          <select
            value={tag || ""}
            onChange={(e) => setTag(e.target.value || null)}
            className="rounded-full border border-[var(--border-strong)] bg-transparent px-3 py-1.5 text-xs text-[var(--ink-muted)] outline-none"
          >
            <option value="">All tags</option>
            {tags.map((t) => (
              <option key={t.slug} value={t.slug} className="text-stone-900">
                {t.name}
              </option>
            ))}
          </select>
          <div className="flex overflow-hidden rounded-full border border-[var(--border-strong)] text-xs">
            <button
              onClick={() => setSort("latest")}
              className={`px-3 py-1.5 transition-colors ${sort === "latest" ? "bg-accent text-stone-950" : "text-[var(--ink-muted)]"}`}
            >
              Latest
            </button>
            <button
              onClick={() => setSort("oldest")}
              className={`px-3 py-1.5 transition-colors ${sort === "oldest" ? "bg-accent text-stone-950" : "text-[var(--ink-muted)]"}`}
            >
              Oldest
            </button>
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-24 text-center text-[var(--ink-dim)]">No notes match your filters yet.</p>
      ) : (
        <div className="mt-14 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <NoteCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
