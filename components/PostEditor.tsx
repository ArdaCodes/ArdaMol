"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import EditorToolbar from "./EditorToolbar";
import MediaPickerModal from "./MediaPickerModal";

interface Category {
  id: string;
  name: string;
}
interface Tag {
  id: string;
  name: string;
}

export interface PostData {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  categoryId: string;
  tagIds: string[];
  status: string;
  featured: boolean;
  seoTitle: string;
  seoDesc: string;
}

const EMPTY: PostData = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  coverImage: "",
  categoryId: "",
  tagIds: [],
  status: "draft",
  featured: false,
  seoTitle: "",
  seoDesc: "",
};

function slugify(str: string) {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

export default function PostEditor({ initial }: { initial?: PostData }) {
  const router = useRouter();
  const [post, setPost] = useState<PostData>(initial || EMPTY);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");
  const [pickerFor, setPickerFor] = useState<"cover" | "inline" | null>(null);
  const [slugTouched, setSlugTouched] = useState(!!initial?.slug);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const skipNextAutosave = useRef(!!initial);
  const postId = useRef(initial?.id);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []));
    fetch("/api/tags")
      .then((r) => r.json())
      .then((d) => setTags(d.tags || []));
  }, []);

  const save = useCallback(async (data: PostData, statusOverride?: string) => {
    setSaveState("saving");
    const payload = { ...data, status: statusOverride || data.status };
    if (postId.current) {
      const res = await fetch(`/api/posts/${postId.current}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      setSaveState("saved");
      return json.post;
    } else {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      postId.current = json.post.id;
      setSaveState("saved");
      router.replace(`/admin/posts/${json.post.id}`);
      return json.post;
    }
  }, [router]);

  // Autosave (debounced) whenever post state changes, except on first mount for existing posts
  useEffect(() => {
    if (skipNextAutosave.current) {
      skipNextAutosave.current = false;
      return;
    }
    if (!post.title && !post.content) return;
    const t = setTimeout(() => {
      save(post);
    }, 1500);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post]);

  function update<K extends keyof PostData>(key: K, value: PostData[K]) {
    setPost((p) => ({
      ...p,
      [key]: value,
      ...(key === "title" && !slugTouched ? { slug: slugify(String(value)) } : {}),
    }));
  }

  function toggleTag(id: string) {
    setPost((p) => ({
      ...p,
      tagIds: p.tagIds.includes(id) ? p.tagIds.filter((t) => t !== id) : [...p.tagIds, id],
    }));
  }

  async function handlePublish() {
    await save(post, "published");
  }

  async function handleUnpublish() {
    await save(post, "draft");
  }

  return (
    <div className="pb-24">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-2xl text-stone-900">
          {postId.current ? "Edit Post" : "New Post"}
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-400">
            {saveState === "saving" && "Saving…"}
            {saveState === "saved" && "Saved"}
          </span>
          {post.status === "published" ? (
            <button onClick={handleUnpublish} className="rounded-md border border-stone-300 px-4 py-2 text-sm text-stone-700">
              Unpublish
            </button>
          ) : (
            <button onClick={handlePublish} className="rounded-md bg-[#b8874a] px-4 py-2 text-sm font-medium text-stone-950">
              Publish
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_280px]">
        <div>
          <input
            value={post.title}
            onChange={(e) => update("title", e.target.value)}
            placeholder="Post title"
            className="w-full border-b border-stone-300 bg-transparent pb-3 font-serif text-3xl text-stone-900 outline-none placeholder:text-stone-300"
          />

          <div className="mt-3 flex items-center gap-2 text-sm text-stone-400">
            <span>/notes/</span>
            <input
              value={post.slug}
              onChange={(e) => {
                setSlugTouched(true);
                update("slug", slugify(e.target.value));
              }}
              className="flex-1 bg-transparent outline-none"
            />
          </div>

          <textarea
            value={post.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
            placeholder="Short excerpt (shown in note cards and previews)"
            rows={2}
            className="mt-5 w-full resize-none rounded-md border border-stone-300 p-3 text-sm text-stone-800 outline-none focus:border-stone-500"
          />

          <div className="mt-6">
            <EditorToolbar
              textareaRef={textareaRef}
              onChange={(v) => update("content", v)}
              onRequestImage={() => setPickerFor("inline")}
            />
            <textarea
              ref={textareaRef}
              value={post.content}
              onChange={(e) => update("content", e.target.value)}
              placeholder="Write in Markdown — ## headings, **bold**, > quotes, ```code```..."
              rows={20}
              className="w-full rounded-b-md border border-stone-300 p-4 font-mono text-sm text-stone-800 outline-none focus:border-stone-500"
            />
          </div>

          <div className="mt-8 space-y-3 border-t border-stone-200 pt-6">
            <p className="text-xs uppercase tracking-[0.1em] text-stone-400">SEO</p>
            <input
              value={post.seoTitle}
              onChange={(e) => update("seoTitle", e.target.value)}
              placeholder="SEO title (defaults to post title)"
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
            />
            <textarea
              value={post.seoDesc}
              onChange={(e) => update("seoDesc", e.target.value)}
              placeholder="SEO description (defaults to excerpt)"
              rows={2}
              className="w-full resize-none rounded-md border border-stone-300 px-3 py-2 text-sm outline-none focus:border-stone-500"
            />
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.1em] text-stone-400">Cover image</p>
            {post.coverImage ? (
              <div className="relative mb-2 aspect-video overflow-hidden rounded-md border border-stone-200">
                <Image src={post.coverImage} alt="" fill className="object-cover" />
              </div>
            ) : null}
            <button
              onClick={() => setPickerFor("cover")}
              className="w-full rounded-md border border-stone-300 py-2 text-sm text-stone-600 hover:bg-stone-50"
            >
              {post.coverImage ? "Change image" : "Select image"}
            </button>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.1em] text-stone-400">Category</p>
            <select
              value={post.categoryId}
              onChange={(e) => update("categoryId", e.target.value)}
              className="w-full rounded-md border border-stone-300 px-3 py-2 text-sm outline-none"
            >
              <option value="">None</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.1em] text-stone-400">Tags</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((t) => (
                <button
                  key={t.id}
                  onClick={() => toggleTag(t.id)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    post.tagIds.includes(t.id)
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-300 text-stone-600"
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-stone-700">
            <input
              type="checkbox"
              checked={post.featured}
              onChange={(e) => update("featured", e.target.checked)}
            />
            Feature on homepage
          </label>
        </div>
      </div>

      {pickerFor && (
        <MediaPickerModal
          onClose={() => setPickerFor(null)}
          onSelect={(url) => {
            if (pickerFor === "cover") {
              update("coverImage", url);
            } else {
              const ta = textareaRef.current;
              const snippet = `\n![Image](${url})\n`;
              if (ta) {
                const { selectionStart, selectionEnd, value } = ta;
                update("content", value.slice(0, selectionStart) + snippet + value.slice(selectionEnd));
              } else {
                update("content", post.content + snippet);
              }
            }
          }}
        />
      )}
    </div>
  );
}
