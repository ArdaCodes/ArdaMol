"use client";

import { useEffect, useState } from "react";

export default function PagesPage() {
  const [tagline, setTagline] = useState("");
  const [about, setAbout] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        setTagline(d.settings?.siteTagline || "Thoughts. Stories. Projects. Experiments.");
        setAbout(
          d.settings?.aboutText ||
            "I'm Arda — I write mostly about AI, robotics, programming and the small ideas in between."
        );
        setLoading(false);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteTagline: tagline, aboutText: about }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  if (loading) return <p className="text-sm text-stone-500">Loading…</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-900">Pages</h1>
      <p className="mt-1 text-sm text-stone-500">Edit the homepage hero tagline and about blurb.</p>

      <form onSubmit={handleSave} className="mt-8 max-w-xl space-y-6">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-stone-400">
            Hero tagline
          </label>
          <input
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-stone-400">
            About blurb
          </label>
          <textarea
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            rows={4}
            className="w-full resize-none rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
        </div>
        <button className="rounded-md bg-stone-900 px-5 py-2.5 text-sm text-white">
          {saved ? "Saved!" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
