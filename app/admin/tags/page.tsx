"use client";

import { useEffect, useState } from "react";

interface Tag {
  id: string;
  name: string;
  slug: string;
  _count: { posts: number };
}

export default function TagsPage() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/tags");
    const data = await res.json();
    setTags(data.tags || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    await fetch("/api/tags", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim() }),
    });
    setName("");
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this tag?")) return;
    await fetch(`/api/tags/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-900">Tags</h1>

      <form onSubmit={handleAdd} className="mt-6 flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New tag name"
          className="flex-1 rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
        />
        <button className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white">Add</button>
      </form>

      <div className="mt-6 overflow-hidden rounded-lg border border-stone-200 bg-white">
        {loading ? (
          <p className="p-6 text-sm text-stone-500">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {tags.map((t) => (
                <tr key={t.id} className="border-b border-stone-100 last:border-0">
                  <td className="px-5 py-3 font-medium text-stone-900">#{t.name}</td>
                  <td className="px-5 py-3 text-stone-400">{t._count.posts} posts</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => handleDelete(t.id)} className="text-red-500 hover:text-red-700">
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
