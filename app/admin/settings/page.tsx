"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [siteTitle, setSiteTitle] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [socialGithub, setSocialGithub] = useState("");
  const [socialTwitter, setSocialTwitter] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        setSiteTitle(d.settings?.siteTitle || "Arda Mol");
        setSiteDescription(d.settings?.siteDescription || "The Castle of Ideas");
        setSocialGithub(d.settings?.socialGithub || "");
        setSocialTwitter(d.settings?.socialTwitter || "");
        setLoading(false);
      });
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ siteTitle, siteDescription, socialGithub, socialTwitter }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  if (loading) return <p className="text-sm text-stone-500">Loading…</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-900">Settings</h1>

      <form onSubmit={handleSave} className="mt-8 max-w-xl space-y-5">
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-stone-400">
            Site title
          </label>
          <input
            value={siteTitle}
            onChange={(e) => setSiteTitle(e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-stone-400">
            Site description
          </label>
          <input
            value={siteDescription}
            onChange={(e) => setSiteDescription(e.target.value)}
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-stone-400">
            GitHub URL
          </label>
          <input
            value={socialGithub}
            onChange={(e) => setSocialGithub(e.target.value)}
            placeholder="https://github.com/username"
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-stone-400">
            X / Twitter URL
          </label>
          <input
            value={socialTwitter}
            onChange={(e) => setSocialTwitter(e.target.value)}
            placeholder="https://x.com/username"
            className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
          />
        </div>
        <button className="rounded-md bg-stone-900 px-5 py-2.5 text-sm text-white">
          {saved ? "Saved!" : "Save changes"}
        </button>

        <p className="pt-4 text-xs text-stone-400">
          To change the admin email or password, edit the <code>.env</code> file
          and re-run <code>npm run db:seed</code>.
        </p>
      </form>
    </div>
  );
}
