"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Mode = "dark" | "light";
type Accent = "ember" | "crimson" | "violet" | "azure" | "forest" | "gold";

interface ThemeCtx {
  mode: Mode;
  accent: Accent;
  setMode: (m: Mode) => void;
  setAccent: (a: Accent) => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

const ACCENT_DATA_MAP: Record<Accent, string | null> = {
  ember: null,
  crimson: "crimson",
  violet: "violet",
  azure: "azure",
  forest: "forest",
  gold: "gold",
};

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>("dark");
  const [accent, setAccentState] = useState<Accent>("ember");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedMode = (localStorage.getItem("am-mode") as Mode) || "dark";
    const savedAccent = (localStorage.getItem("am-accent") as Accent) || "ember";
    setModeState(savedMode);
    setAccentState(savedAccent);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem("am-mode", mode);
    localStorage.setItem("am-accent", accent);
  }, [mode, accent, mounted]);

  const accentAttr = ACCENT_DATA_MAP[accent];

  return (
    <Ctx.Provider
      value={{
        mode,
        accent,
        setMode: setModeState,
        setAccent: setAccentState,
      }}
    >
      <div
        data-theme={mode}
        {...(accentAttr ? { "data-accent": accentAttr } : {})}
        className="min-h-screen bg-[var(--bg)] text-[var(--ink)] transition-colors duration-300"
      >
        {children}
      </div>
    </Ctx.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
