"use client";

import { useEffect, useState } from "react";

const FIELDS: { key: string; label: string; group: string; type?: "input" | "textarea"; rows?: number }[] = [
  { key: "heroEyebrow", label: "Hero small text (above title)", group: "Hero" },
  { key: "heroTitleMain", label: "Hero title - first word", group: "Hero" },
  { key: "heroTitleAccent", label: "Hero title - second word (italic)", group: "Hero" },
  { key: "siteTagline", label: "Hero tagline", group: "Hero" },
  { key: "heroExploreNotesText", label: "Hero button 1 text", group: "Hero" },
  { key: "heroViewProjectsText", label: "Hero button 2 text", group: "Hero" },
  { key: "heroScrollText", label: "Hero scroll hint text", group: "Hero" },

  { key: "siteTitle", label: "Site name (top left logo)", group: "Menu" },
  { key: "navHome", label: "Menu - Home", group: "Menu" },
  { key: "navNotes", label: "Menu - Notes", group: "Menu" },
  { key: "navProjects", label: "Menu - Projects", group: "Menu" },
  { key: "navAbout", label: "Menu - About", group: "Menu" },
  { key: "navArchive", label: "Menu - Archive", group: "Menu" },

  { key: "aboutHeadline", label: "About - big headline", group: "Home page", type: "textarea" },
  { key: "aboutText", label: "About - paragraph", group: "Home page", type: "textarea" },
  { key: "featuredNoteLabel", label: "Label above featured note", group: "Home page" },
  { key: "latestNotesTitle", label: "Latest notes title", group: "Home page" },
  { key: "latestNotesViewAll", label: "View all link text", group: "Home page" },
  { key: "projectsSectionTitle", label: "Projects section title", group: "Home page" },
  { key: "projectsSectionDesc", label: "Projects section description", group: "Home page", type: "textarea" },
  { key: "timelineTitle", label: "Timeline title", group: "Home page" },
  { key: "timeline2023", label: "Timeline - 2023 text", group: "Home page" },
  { key: "timeline2024", label: "Timeline - 2024 text", group: "Home page" },
  { key: "timeline2025", label: "Timeline - 2025 text", group: "Home page" },
  { key: "timeline2026", label: "Timeline - 2026 text", group: "Home page" },
  { key: "ctaHeadline", label: "Bottom section headline", group: "Home page" },
  { key: "ctaButtonText", label: "Bottom section button text", group: "Home page" },

  { key: "notesPageLabel", label: "Notes page - small label", group: "Notes page" },
  { key: "notesPageHeadline", label: "Notes page - headline", group: "Notes page", type: "textarea" },

  { key: "projectsPageLabel", label: "Projects page - small label", group: "Projects page" },
  { key: "projectsPageHeadline", label: "Projects page - headline", group: "Projects page" },
  { key: "projectsPageDesc", label: "Projects page - description", group: "Projects page", type: "textarea" },
  { key: "projectsVisitButtonText", label: "Visit project button text", group: "Projects page" },

  { key: "archivePageLabel", label: "Archive page - small label", group: "Archive page" },
  { key: "archivePageHeadline", label: "Archive page - headline", group: "Archive page" },

  { key: "footerTagline", label: "Footer description", group: "Footer" },
  { key: "exploreLabel", label: "Footer - Explore column title", group: "Footer" },
  { key: "elsewhereLabel", label: "Footer - Elsewhere column title", group: "Footer" },
  { key: "socialGithub", label: "GitHub URL", group: "Footer" },
  { key: "socialTwitter", label: "X / Twitter URL", group: "Footer" },
  { key: "socialEmail", label: "Contact email", group: "Footer" },
  { key: "copyrightText", label: "Copyright line (leave blank for default)", group: "Footer" },

  { key: "secretPageContent", label: "Private notes (only visible to you, at /23-11)", group: "Private", type: "textarea", rows: 14 },
];

const GROUPS = Array.from(new Set(FIELDS.map((f) => f.group)));

export default function PagesPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        setValues(d.settings || {});
        setLoading(false);
      });
  }, []);

  function update(key: string, val: string) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  if (loading) return <p className="text-sm text-stone-500">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl text-stone-900">Pages</h1>
          <p className="mt-1 text-sm text-stone-500">Edit every piece of text shown across the site.</p>
        </div>
        <button form="pages-form" className="rounded-md bg-stone-900 px-5 py-2.5 text-sm text-white">
          {saved ? "Saved!" : "Save changes"}
        </button>
      </div>

      <form id="pages-form" onSubmit={handleSave} className="mt-8 max-w-2xl space-y-10 pb-16">
        {GROUPS.map((group) => (
          <div key={group}>
            <h2 className="mb-4 border-b border-stone-200 pb-2 font-serif text-lg text-stone-900">{group}</h2>
            <div className="space-y-4">
              {FIELDS.filter((f) => f.group === group).map((f) => (
                <div key={f.key}>
                  <label className="mb-1.5 block text-xs uppercase tracking-[0.1em] text-stone-400">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea
                      value={values[f.key] || ""}
                      onChange={(e) => update(f.key, e.target.value)}
                      rows={f.rows || 3}
                      className="w-full resize-none rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
                    />
                  ) : (
                    <input
                      value={values[f.key] || ""}
                      onChange={(e) => update(f.key, e.target.value)}
                      className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </form>
    </div>
  );
}