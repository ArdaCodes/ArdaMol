"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  createdAt: string;
}

export default function MediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function load() {
    const res = await fetch("/api/media");
    const data = await res.json();
    setMedia(data.media || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);
      await fetch("/api/upload", { method: "POST", body: formData });
    }
    setUploading(false);
    e.target.value = "";
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this file?")) return;
    await fetch(`/api/media/${id}`, { method: "DELETE" });
    load();
  }

  function copyUrl(m: MediaItem) {
    navigator.clipboard.writeText(m.url);
    setCopiedId(m.id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-stone-900">Media</h1>
        <label className="cursor-pointer rounded-md bg-stone-900 px-4 py-2 text-sm text-white">
          {uploading ? "Uploading…" : "Upload images"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-stone-500">Loading…</p>
      ) : media.length === 0 ? (
        <p className="mt-6 text-sm text-stone-500">
          No images yet. Upload JPG, PNG or WEBP files to use them in your notes and projects.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {media.map((m) => (
            <div key={m.id} className="overflow-hidden rounded-lg border border-stone-200 bg-white">
              <div className="relative aspect-square">
                <Image src={m.url} alt={m.filename} fill className="object-cover" />
              </div>
              <div className="p-2">
                <p className="truncate text-xs text-stone-500">{m.filename}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => copyUrl(m)}
                    className="flex-1 rounded border border-stone-200 py-1 text-xs text-stone-600 hover:bg-stone-50"
                  >
                    {copiedId === m.id ? "Copied!" : "Copy URL"}
                  </button>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="rounded border border-stone-200 px-2 py-1 text-xs text-red-500 hover:bg-red-50"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
