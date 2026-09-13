import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

// Deterministic color per category name, so the same category always
// gets the same accent dot without needing a color field in the DB.
const CATEGORY_COLORS = ["#c9a24a", "#a8422f", "#7a5aa8", "#3f7ea6", "#4a7a52", "#c79a3f"];
function colorForCategory(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return CATEGORY_COLORS[Math.abs(hash) % CATEGORY_COLORS.length];
}

export default function NoteCard({
  post,
  size = "default",
}: {
  post: {
    slug: string;
    title: string;
    excerpt: string;
    coverImage?: string | null;
    publishedAt?: Date | string | null;
    readingTime: number;
    category?: { name: string } | null;
  };
  size?: "default" | "large";
}) {
  const dotColor = post.category ? colorForCategory(post.category.name) : "#c9a24a";

  return (
    <Link
      href={`/notes/${post.slug}`}
      data-cursor-hover
      className="group block transition-transform duration-300 hover:-translate-y-1"
    >
      <div className="relative overflow-hidden rounded-sm">
        <div className={size === "large" ? "aspect-[16/9]" : "aspect-[4/3]"}>
          {post.coverImage && (
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {/* Reading time badge, appears on hover */}
        <div className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-[11px] text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M12 7v5l3.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          {post.readingTime} min
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.12em] text-accent">
          {post.category && (
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: dotColor }} />
              {post.category.name}
            </span>
          )}
          <span className="text-[var(--ink-dim)]">
            {formatDate(post.publishedAt)} · {post.readingTime} min
          </span>
        </div>
        <h3
          className={`mt-2 font-display text-[var(--ink)] transition-transform duration-300 group-hover:translate-x-1 ${
            size === "large" ? "text-3xl md:text-4xl" : "text-xl"
          }`}
        >
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm text-[var(--ink-muted)]">{post.excerpt}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm