"use client";

import { useState, useRef, useEffect } from "react";
import { useTheme } from "./ThemeProvider";

const ACCENTS: { id: any; label: string; hex: string }[] = [
  { id: "ember", label: "Obsidian", hex: "#b8874a" },
  { id: "crimson", label: "Crimson", hex: "#a8422f" },
  { id: "violet", label: "Midnight", hex: "#7a5aa8" },
  { id: "azure", label: "Azure", hex: "#3f7ea6" },
  { id: "forest", label: "Forest", hex: "#4a7a52" },
  { id: "gold", label: "Gold", hex: "#c79a3f" },
];

export default function ThemeSwitcher() {
  const { mode, accent, setMode, setAccent } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change theme"
        className="flex items-center gap-2 rounded-full border border-stone-200/20 px-3 py-1.5 text-xs tracking-wide text-stone-200/80 hover:border-accent/60 hover:text-accent transition-colors"
      >
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: "var(--accent)" }}
        />
        {mode === "dark" ? "Dark" : "Light"}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-56 rounded-md border border-stone-200/15 bg-stone-900/95 backdrop-blur-md p-3 shadow-xl z-50">
          <div className="mb-3 flex rounded-full border border-stone-200/15 p-0.5 text-xs">
            <button
              onClick={() => setMode("dark")}
              className={`flex-1 rounded-full py-1 transition-colors ${
                mode === "dark" ? "bg-stone-200/10 text-stone-50" : "text-stone-400"
              }`}
            >
              Dark
            </button>
            <button
              onClick={() => setMode("light")}
              className={`flex-1 rounded-full py-1 transition-colors ${
                mode === "light" ? "bg-stone-200/10 text-stone-50" : "text-stone-400"
              }`}
            >
              Light
            </button>
          </div>
          <p className="mb-2 px-1 text-[10px] uppercase tracking-[0.14em] text-stone-500">
            Accent
          </p>
          <div className="grid grid-cols-3 gap-2">
            {ACCENTS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAccent(a.id)}
                className={`flex flex-col items-center gap-1.5 rounded-md border p-2 text-[10px] transition-colors ${
                  accent === a.id
                    ? "border-accent text-stone-50"
                    : "border-transparent text-stone-400 hover:border-stone-200/20"
                }`}
              >
                <span
                  className="h-4 w-4 rounded-full"
                  style={{ background: a.hex }}
                />
                {a.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
