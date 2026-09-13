"use client";

import { useEffect, useState } from "react";

const ACCENTS = [
  { id: "ember", label: "Obsidian", hex: "#b8874a" },
  { id: "crimson", label: "Crimson", hex: "#a8422f" },
  { id: "violet", label: "Midnight", hex: "#7a5aa8" },
  { id: "azure", label: "Azure", hex: "#3f7ea6" },
  { id: "forest", label: "Forest", hex: "#4a7a52" },
  { id: "gold", label: "Gold", hex: "#c79a3f" },
];

export default function AppearancePage() {
  const [defaultMode, setDefaultMode] = useState("dark");
  const [defaultAccent, setDefaultAccent] = useState("ember");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        setDefaultMode(d.settings?.defaultMode || "dark");
        setDefaultAccent(d.settings?.defaultAccent || "ember");
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ defaultMode, defaultAccent }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  if (loading) return <p className="text-sm text-stone-500">Loading…</p>;

  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-900">Appearance</h1>
      <p className="mt-1 text-sm text-stone-500">
        Set the default look for first-time visitors. They can still switch it themselves.
      </p>

      <div className="mt-8 max-w-md space-y-8">
        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.1em] text-stone-400">Default mode</p>
          <div className="flex overflow-hidden rounded-full border border-stone-300 text-sm">
            <button
              onClick={() => setDefaultMode("dark")}
              className={`flex-1 py-2 ${defaultMode === "dark" ? "bg-stone-900 text-white" : "text-stone-600"}`}
            >
              Dark
            </button>
            <button
              onClick={() => setDefaultMode("light")}
              className={`flex-1 py-2 ${defaultMode === "light" ? "bg-stone-900 text-white" : "text-stone-600"}`}
            >
              Light
            </button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs uppercase tracking-[0.1em] text-stone-400">Default accent</p>
          <div className="grid grid-cols-3 gap-3">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                onClick={() => setDefaultAccent(a.id)}
                className={`flex flex-col items-center gap-2 rounded-md border p-3 text-xs ${
                  defaultAccent === a.id ? "border-stone-900" : "border-stone-200"
                }`}
              >
                <span className="h-5 w-5 rounded-full" style={{ background: a.hex }} />
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleSave} className="rounded-md bg-stone-900 px-5 py-2.5 text-sm text-white">
          {saved ? "Saved!" : "Save changes"}
        </button>
      </div>
    </div>
  );
}
