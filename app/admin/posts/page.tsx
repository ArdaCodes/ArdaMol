"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

interface Post {
  id: string;
  title: string;
  slug: string;
  status: string;
  updatedAt: string;
  category: { name: string } | null;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string) {
    if (!confirm("Delete this post permanently?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    load();
  }

  async function toggleStatus(post: Post) {
    const newStatus = post.status === "published" ? "draft" : "published";
    await fetch(`/api/posts/${post.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    load();
  }

  const filtered = posts.filter((p) => filter === "all" || p.status === filter);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-stone-900">Posts</h1>
        <Link href="/admin/posts/new" className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white">
          + New Post
        </Link>
      </div>

      <div className="mt-6 flex gap-2 text-sm">
        {(["all", "published", "draft"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 capitalize ${
              filter === f ? "bg-stone-900 text-white" : "bg-white text-stone-600 border border-stone-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-stone-200 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-stone-500">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-sm text-stone-500">No posts found.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-stone-100 last:border-0">
                  <td className="px-5 py-3">
                    <Link href={`/admin/posts/${p.id}`} className="font-medium text-stone-900 hover:text-[#b8874a]">
                      {p.title}
                    </Link>
                    <p className="text-xs text-stone-400">{p.category?.name || "Uncategorized"}</p>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => toggleStatus(p)}
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        p.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {p.status}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-stone-400">{formatDate(p.updatedAt)}</td>
                  <td className="px-5 py-3 text-right">
                    <Link href={`/admin/posts/${p.id}`} className="text-stone-500 hover:text-stone-900 mr-4">
                      Edit
                    </Link>
                    <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
