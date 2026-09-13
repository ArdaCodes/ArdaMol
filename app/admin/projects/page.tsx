"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import MediaPickerModal from "@/components/MediaPickerModal";

interface Project {
  id: string;
  title: string;
  description: string;
  image: string | null;
  category: string;
  technologies: string;
  externalUrl: string | null;
}

const EMPTY = {
  title: "",
  description: "",
  image: "",
  category: "Web",
  technologies: "",
  externalUrl: "",
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState<typeof EMPTY & { id?: string }>(EMPTY);
  const [showForm, setShowForm] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [loading, setLoading] = useState(true);

  async function load() {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data.projects || []);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openNew() {
    setForm(EMPTY);
    setShowForm(true);
  }

  function openEdit(p: Project) {
    setForm({
      id: p.id,
      title: p.title,
      description: p.description,
      image: p.image || "",
      category: p.category,
      technologies: p.technologies,
      externalUrl: p.externalUrl || "",
    });
    setShowForm(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (form.id) {
      await fetch(`/api/projects/${form.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } else {
      await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    }
    setShowForm(false);
    load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    await fetch(`/api/projects/${id}`, { method: "DELETE" });
    load();
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl text-stone-900">Projects</h1>
        <button onClick={openNew} className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white">
          + New Project
        </button>
      </div>

      {loading ? (
        <p className="mt-6 text-sm text-stone-500">Loading…</p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((p) => (
            <div key={p.id} className="overflow-hidden rounded-lg border border-stone-200 bg-white">
              {p.image && (
                <div className="relative aspect-video">
                  <Image src={p.image} alt={p.title} fill className="object-cover" />
                </div>
              )}
              <div className="p-4">
                <p className="text-xs uppercase tracking-[0.1em] text-[#b8874a]">{p.category}</p>
                <h3 className="mt-1 font-semibold text-stone-900">{p.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-stone-500">{p.description}</p>
                <div className="mt-3 flex gap-3 text-sm">
                  <button onClick={() => openEdit(p)} className="text-stone-600 hover:text-stone-900">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:text-red-700">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 px-4">
          <form
            onSubmit={handleSave}
            className="max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-lg bg-white p-6"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-stone-900">
                {form.id ? "Edit project" : "New project"}
              </h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-stone-400">
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Title"
                className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none"
              />
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Description"
                rows={3}
                className="w-full resize-none rounded-md border border-stone-300 px-3 py-2 text-sm outline-none"
              />

              {form.image && (
                <div className="relative aspect-video overflow-hidden rounded-md border border-stone-200">
                  <Image src={form.image} alt="" fill className="object-cover" />
                </div>
              )}
              <button
                type="button"
                onClick={() => setShowPicker(true)}
                className="w-full rounded-md border border-stone-300 py-2 text-sm text-stone-600"
              >
                {form.image ? "Change image" : "Select image"}
              </button>

              <input
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Category (e.g. AI, Robotics, Web)"
                className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none"
              />
              <input
                value={form.technologies}
                onChange={(e) => setForm({ ...form, technologies: e.target.value })}
                placeholder="Technologies, comma separated"
                className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none"
              />
              <input
                value={form.externalUrl}
                onChange={(e) => setForm({ ...form, externalUrl: e.target.value })}
                placeholder="External URL (optional)"
                className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none"
              />
            </div>

            <button className="mt-5 w-full rounded-md bg-[#b8874a] py-2.5 text-sm font-medium text-stone-950">
              Save project
            </button>
          </form>
        </div>
      )}

      {showPicker && (
        <MediaPickerModal onClose={() => setShowPicker(false)} onSelect={(url) => setForm({ ...form, image: url })} />
      )}
    </div>
  );
}
