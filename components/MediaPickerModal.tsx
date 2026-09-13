"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface MediaItem {
  id: string;
  url: string;
  filename: string;
}

export default function MediaPickerModal({
  onSelect,
  onClose,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
}) {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [uploading, setUploading] = useState(false);

  async function load() {
    const res = await fetch("/api/media");
    const data = await res.json();
    setMedia(data.media || []);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (data.media) {
      onSelect(data.media.url);
      onClose();
    } else {
      alert(data.error || "Upload failed");
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4">
      <div className="max-h-[80vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-stone-900">Media Library</h3>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-900">
            ✕
          </button>
        </div>

        <label className="mt-4 flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-stone-300 py-6 text-sm text-stone-500 hover:border-stone-400">
          {uploading ? "Uploading…" : "Upload a new image (JPG, PNG, WEBP)"}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleUpload} className="hidden" />
        </label>

        <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {media.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                onSelect(m.url);
                onClose();
              }}
              className="relative aspect-square overflow-hidden rounded-md border border-stone-200 hover:border-[#b8874a]"
            >
              <Image src={m.url} alt={m.filename} fill className="object-cover" />
            </button>
          ))}
        </div>
        {media.length === 0 && <p className="mt-4 text-sm text-stone-400">No images uploaded yet.</p>}
      </div>
    </div>
  );
}
