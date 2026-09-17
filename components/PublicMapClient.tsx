// @ts-nocheck
"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const TurkeyMap = dynamic(() => import("react-turkey-map"), { ssr: false });
const WorldMapClient = dynamic(() => import("@/components/WorldMapClient"), { ssr: false });

export default function PublicMapClient({ places }: { places: any[] }) {
  const [tab, setTab] = useState<"tr" | "world">("tr");
  const [selected, setSelected] = useState<{ name: string; note: string } | null>(null);

  const currentPlaces = places.filter((p) => p.type === tab);
  const colorMap: Record<string, string> = {};
  for (const p of currentPlaces) colorMap[p.code] = "#b8874a";

  function handleClick(code: string, name: string) {
    const found = currentPlaces.find((p) => p.code === code);
    if (found) {
      setSelected({ name: found.name, note: found.note || "" });
    } else {
      setSelected({ name, note: "Not visited yet." });
    }
  }

  return (
    <div className="mt-12">
      <div className="flex gap-2 text-sm">
        <button
          onClick={() => setTab("tr")}
          className={`rounded-full px-4 py-1.5 ${tab === "tr" ? "bg-accent text-stone-950" : "border border-[var(--border-strong)] text-[var(--ink-muted)]"}`}
        >
          Turkey
        </button>
        <button
          onClick={() => setTab("world")}
          className={`rounded-full px-4 py-1.5 ${tab === "world" ? "bg-accent text-stone-950" : "border border-[var(--border-strong)] text-[var(--ink-muted)]"}`}
        >
          World
        </button>
      </div>

      <div className="mt-8 overflow-hidden rounded-sm border border-[var(--border)] p-4">
        {tab === "tr" ? (
          <TurkeyMap
            colorData={colorMap}
            onCityClick={({ plate, city }: any) => handleClick(plate, city)}
          />
        ) : (
          <WorldMapClient initialFillColors={colorMap} onClickPlace={handleClick} />
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4" onClick={() => setSelected(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-lg border border-[var(--border)] bg-[var(--bg)] p-6"
          >
            <h3 className="font-display text-2xl text-[var(--ink)]">{selected.name}</h3>
            <p className="mt-3 whitespace-pre-wrap text-[var(--ink-muted)]">{selected.note}</p>
            <button
              onClick={() => setSelected(null)}
              className="mt-5 rounded-full border border-[var(--border-strong)] px-4 py-2 text-sm text-[var(--ink)]"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
