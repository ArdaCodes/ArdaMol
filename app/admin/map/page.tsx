"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const TurkeyMap = dynamic(() => import("react-turkey-map"), { ssr: false });
const World = dynamic(() => import("@yanikemmenegger/react-world-map").then((m) => ({ default: m.default })), { ssr: false });
const MapProvider = dynamic(() => import("@yanikemmenegger/react-world-map").then((m) => ({ default: m.MapProvider })), { ssr: false });
interface Place {
  id: string;
  type: string;
  code: string;
  name: string;
  note: string | null;
}

export default function AdminMapPage() {
  const [tab, setTab] = useState<"tr" | "world">("tr");
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<{ code: string; name: string; note: string } | null>(null);

  async function load() {
    const res = await fetch("/api/visited-places");
    const data = await res.json();
    setPlaces(data.places || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openForm(code: string, name: string) {
    const existing = places.find((p) => p.type === tab && p.code === code);
    setForm({ code, name, note: existing?.note || "" });
  }

  async function handleSave() {
    if (!form) return;
    await fetch("/api/visited-places", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: tab, code: form.code, name: form.name, note: form.note }),
    });
    setForm(null);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this place?")) return;
    await fetch(`/api/visited-places/${id}`, { method: "DELETE" });
    load();
  }

  const currentPlaces = places.filter((p) => p.type === tab);
  const colorData: Record<string, string> = {};
  for (const p of currentPlaces) colorData[p.code] = "#b8874a";

  const initialFillColors: Record<string, string> = {};
  for (const p of currentPlaces) initialFillColors[p.code] = "#b8874a";

  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-900">Map</h1>
      <p className="mt-1 text-sm text-stone-500">
        Click a province or country to add or edit a note for it.
      </p>

      <div className="mt-6 flex gap-2 text-sm">
        <button
          onClick={() => setTab("tr")}
          className={`rounded-full px-4 py-1.5 ${tab === "tr" ? "bg-stone-900 text-white" : "bg-white text-stone-600 border border-stone-200"}`}
        >
          Turkey
        </button>
        <button
          onClick={() => setTab("world")}
          className={`rounded-full px-4 py-1.5 ${tab === "world" ? "bg-stone-900 text-white" : "bg-white text-stone-600 border border-stone-200"}`}
        >
          World
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-stone-200 bg-white p-4">
        {tab === "tr" ? (
          <TurkeyMap
            colorData={colorData}
            onCityClick={({ plate, city }: any) => openForm(plate, city)}
          />
        ) : (
          <MapProvider
            initialFillColors={initialFillColors}
            defaultOnClickHandler={(country: any) => openForm(country.alpha2Code || country.code, country.commonName || country.name)}
          >
            <World />
          </MapProvider>
        )}
      </div>

      {form && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h3 className="text-lg font-semibold text-stone-900">{form.name}</h3>
            <p className="mt-1 text-xs text-stone-400">Code: {form.code}</p>
            <textarea
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              rows={5}
              placeholder="Write your note about this place..."
              className="mt-4 w-full resize-none rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
            />
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setForm(null)} className="rounded-md px-4 py-2 text-sm text-stone-500">
                Cancel
              </button>
              <button onClick={handleSave} className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-stone-900">Saved places ({tab})</h2>
        {loading ? (
          <p className="mt-3 text-sm text-stone-500">Loading...</p>
        ) : currentPlaces.length === 0 ? (
          <p className="mt-3 text-sm text-stone-500">Nothing added yet.</p>
        ) : (
          <div className="mt-3 overflow-hidden rounded-lg border border-stone-200 bg-white">
            {currentPlaces.map((p) => (
              <div key={p.id} className="flex items-center justify-between border-b border-stone-100 px-4 py-3 last:border-0">
                <div>
                  <p className="font-medium text-stone-900">{p.name}</p>
                  <p className="text-xs text-stone-400 line-clamp-1">{p.note}</p>
                </div>
                <button onClick={() => handleDelete(p.id)} className="text-sm text-red-500 hover:text-red-700">
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
