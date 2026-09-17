// @ts-nocheck
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const TurkeyMap = dynamic(() => import("react-turkey-map"), { ssr: false });
const WorldMapClient = dynamic(() => import("@/components/WorldMapClient"), { ssr: false });

interface Goal {
  id: string;
  text: string;
  done: boolean;
}
interface Grudge {
  id: string;
  text: string;
}

export default function SecretGate() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [tab, setTab] = useState<"notes" | "goals" | "grudges" | "map">("notes");
  const [mapSubTab, setMapSubTab] = useState<"tr" | "world">("tr");
  const [content, setContent] = useState("");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [grudges, setGrudges] = useState<Grudge[]>([]);
  const [places, setPlaces] = useState<any[]>([]);
  const [newGoal, setNewGoal] = useState("");
  const [newGrudge, setNewGrudge] = useState("");
  const [saved, setSaved] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<{ name: string; note: string } | null>(null);

  async function handleUnlock(e: React.FormEvent) {
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
      setGoals(data.goals || []);
      setGrudges(data.grudges || []);
      setUnlocked(true);
      const placesRes = await fetch("/api/visited-places");
      const placesData = await placesRes.json();
      setPlaces(placesData.places || []);
    } else {
      setError("Wrong PIN.");
      setPin("");
    }
  }

  async function saveAll(partial: any) {
    await fetch("/api/secret-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1200);
  }

  function addGoal() {
    if (!newGoal.trim()) return;
    const updated = [...goals, { id: Date.now().toString(), text: newGoal.trim(), done: false }];
    setGoals(updated);
    setNewGoal("");
    saveAll({ goals: updated });
  }

  function toggleGoal(id: string) {
    const updated = goals.map((g) => (g.id === id ? { ...g, done: !g.done } : g));
    setGoals(updated);
    saveAll({ goals: updated });
  }

  function deleteGoal(id: string) {
    const updated = goals.filter((g) => g.id !== id);
    setGoals(updated);
    saveAll({ goals: updated });
  }

  function addGrudge() {
    if (!newGrudge.trim()) return;
    const updated = [...grudges, { id: Date.now().toString(), text: newGrudge.trim() }];
    setGrudges(updated);
    setNewGrudge("");
    saveAll({ grudges: updated });
  }

  function deleteGrudge(id: string) {
    const updated = grudges.filter((g) => g.id !== id);
    setGrudges(updated);
    saveAll({ grudges: updated });
  }

  function handleMapClick(code: string, name: string) {
    const found = places.find((p) => p.code === code);
    setSelectedPlace({ name: found?.name || name, note: found?.note || "Not visited yet." });
  }

  if (!unlocked) {
    return (
      <form onSubmit={handleUnlock} className="mt-10 max-w-xs">
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

  const tabs = [
    { id: "notes", label: "Notes" },
    { id: "goals", label: "Goals" },
    { id: "grudges", label: "Grudges" },
    { id: "map", label: "Map" },
  ];

  const worldColorMap: Record<string, string> = {};
  for (const p of places.filter((p) => p.type === "world")) worldColorMap[p.code] = "#b8874a";
  const trColorMap: Record<string, string> = {};
  for (const p of places.filter((p) => p.type === "tr")) trColorMap[p.code] = "#b8874a";

  return (
    <div className="mt-10">
      <div className="flex gap-2 text-sm">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`rounded-full px-4 py-1.5 ${tab === t.id ? "bg-accent text-stone-950" : "border border-[var(--border-strong)] text-[var(--ink-muted)]"}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "notes" && (
        <div className="mt-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="w-full resize-none rounded-md border border-[var(--border-strong)] bg-transparent px-4 py-3 text-sm text-[var(--ink)] outline-none focus:border-accent"
          />
          <button
            onClick={() => saveAll({ content })}
            className="mt-3 rounded-full bg-accent px-5 py-2 text-sm font-medium text-stone-950"
          >
            {saved ? "Saved!" : "Save"}
          </button>
        </div>
      )}

      {tab === "goals" && (
        <div className="mt-6">
          <div className="flex gap-2">
            <input
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGoal()}
              placeholder="Add a new goal..."
              className="flex-1 rounded-md border border-[var(--border-strong)] bg-transparent px-4 py-2 text-sm text-[var(--ink)] outline-none focus:border-accent"
            />
            <button onClick={addGoal} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-stone-950">
              Add
            </button>
          </div>
          <ul className="mt-5 space-y-2">
            {goals.map((g) => (
              <li key={g.id} className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-2">
                <label className="flex flex-1 items-center gap-3 text-[var(--ink)]">
                  <input type="checkbox" checked={g.done} onChange={() => toggleGoal(g.id)} />
                  <span className={g.done ? "line-through text-[var(--ink-dim)]" : ""}>{g.text}</span>
                </label>
                <button onClick={() => deleteGoal(g.id)} className="text-xs text-red-400">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {tab === "grudges" && (
        <div className="mt-6">
          <div className="flex gap-2">
            <input
              value={newGrudge}
              onChange={(e) => setNewGrudge(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addGrudge()}
              placeholder="Add something..."
              className="flex-1 rounded-md border border-[var(--border-strong)] bg-transparent px-4 py-2 text-sm text-[var(--ink)] outline-none focus:border-accent"
            />
            <button onClick={addGrudge} className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-stone-950">
              Add
            </button>
          </div>
          <ul className="mt-5 space-y-2">
            {grudges.map((g) => (
              <li key={g.id} className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-2">
                <span className="text-[var(--ink)]">{g.text}</span>
                <button onClick={() => deleteGrudge(g.id)} className="text-xs text-red-400">
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

            {tab === "map" && (
        <div className="mt-6">
          <div className="flex gap-2 text-xs mb-4 text-[var(--ink-dim)]">
            To add or edit place notes, use Admin - Map.
          </div>
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setMapSubTab("tr")}
              className={`rounded-full px-3 py-1 text-xs ${mapSubTab === "tr" ? "bg-accent text-stone-950" : "border border-[var(--border-strong)] text-[var(--ink-muted)]"}`}
            >
              Turkey
            </button>
            <button
              onClick={() => setMapSubTab("world")}
              className={`rounded-full px-3 py-1 text-xs ${mapSubTab === "world" ? "bg-accent text-stone-950" : "border border-[var(--border-strong)] text-[var(--ink-muted)]"}`}
            >
              World
            </button>
          </div>
          {mapSubTab === "tr" ? (
            <TurkeyMap colorData={trColorMap} onCityClick={({ plate, city }: any) => handleMapClick(plate, city)} />
          ) : (
            <WorldMapClient initialFillColors={worldColorMap} onClickPlace={handleMapClick} />
          )}
        </div>
      )}

      {selectedPlace && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4" onClick={() => setSelectedPlace(null)}>
          <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--bg)] p-6">
            <h3 className="font-display text-2xl text-[var(--ink)]">{selectedPlace.name}</h3>
            <p className="mt-3 whitespace-pre-wrap text-[var(--ink-muted)]">{selectedPlace.note}</p>
            <button onClick={() => setSelectedPlace(null)} className="mt-5 rounded-full border border-[var(--border-strong)] px-4 py-2 text-sm text-[var(--ink)]">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
