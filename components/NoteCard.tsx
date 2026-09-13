import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

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
  return (
    <Link
      href={`/notes/${post.slug}`}
      data-cursor-hover
      className="group block"
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
      </div>

      <div className="mt-4">
        <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.12em] text-accent">
          {post.category && <span>{post.category.name}</span>}
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
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm text-[var(--ink-muted)]">
          Read note
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}
