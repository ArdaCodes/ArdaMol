import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getPostBySlug, getAdjacentPosts, getRelatedPosts } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { extractToc, slugifyHeading } from "@/lib/toc";
import ReadingProgress from "@/components/ReadingProgress";
import NoteCard from "@/components/NoteCard";
import Reveal from "@/components/Reveal";
import VideoEmbed from "@/components/VideoEmbed";
import type { Metadata } from "next";

function splitContentSegments(content: string) {
  const parts = content.split(/\{\{(youtube|vimeo):([\w-]+)\}\}/g);
  const segments: { type: "markdown" | "video"; text?: string; provider?: "youtube" | "vimeo"; id?: string }[] = [];
  for (let i = 0; i < parts.length; i += 3) {
    const text = parts[i];
    if (text && text.trim()) segments.push({ type: "markdown", text });
    const provider = parts[i + 1] as "youtube" | "vimeo" | undefined;
    const id = parts[i + 2];
    if (provider && id) segments.push({ type: "video", provider, id });
  }
  return segments;
}

export const revalidate = 0;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};
  return {
    title: post.seoTitle || post.title,
    description: post.seoDesc || post.excerpt,
    alternates: { canonical: `/notes/${post.slug}` },
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDesc || post.excerpt,
      images: post.coverImage ? [post.coverImage] : undefined,
    },
  };
}

export default async function NoteDetailPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);
  if (!post || post.status !== "published") notFound();

  const toc = extractToc(post.content);
  const { prev, next } = await getAdjacentPosts(post.publishedAt, post.slug);
  const related = await getRelatedPosts(post.categoryId, post.slug);

  return (
    <article>
      <ReadingProgress />

      <header className="mx-auto max-w-3xl px-6 pt-36 md:px-10 md:pt-44">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.14em] text-accent">
            {post.category?.name || "Note"}
          </p>
          <h1 className="mt-4 font-display text-4xl leading-tight text-[var(--ink)] md:text-6xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg text-[var(--ink-muted)]">{post.excerpt}</p>
          <p className="mt-5 text-sm text-[var(--ink-dim)]">
            {formatDate(post.publishedAt)} · {post.readingTime} min read
          </p>
        </Reveal>
      </header>

      {post.coverImage && (
        <div className="relative mx-auto mt-12 aspect-[16/8] w-full max-w-5xl overflow-hidden rounded-sm px-0 md:px-10">
          <Image src={post.coverImage} alt={post.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-12 px-6 py-16 md:grid-cols-[1fr_200px] md:px-10">
        <div className="prose-note">
          {splitContentSegments(post.content).map((seg, i) =>
            seg.type === "video" ? (
              <VideoEmbed key={i} provider={seg.provider!} id={seg.id!} />
            ) : (
              <ReactMarkdown
                key={i}
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => <h2 id={slugifyHeading(String(children))}>{children}</h2>,
                  h3: ({ children }) => <h3 id={slugifyHeading(String(children))}>{children}</h3>,
                }}
              >
                {seg.text}
              </ReactMarkdown>
            )
          )}

          {post.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-[var(--border)] pt-8">
              {post.tags.map(({ tag }: any) => (
                <span
                  key={tag.id}
                  className="rounded-full border border-[var(--border-strong)] px-3 py-1 text-xs text-[var(--ink-muted)]"
                >
                  #{tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {toc.length > 0 && (
          <aside className="hidden md:block">
            <div className="sticky top-32">
              <p className="mb-4 text-[11px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
                On this page
              </p>
              <ul className="space-y-3 border-l border-[var(--border)] pl-4 text-sm">
                {toc.map((item) => (
                  <li key={item.id} className={item.level === 3 ? "ml-3" : ""}>
                    <a href={`#${item.id}`} className="text-[var(--ink-muted)] hover:text-accent transition-colors">
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        )}
      </div>

      {/* prev / next */}
      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-4 border-t border-[var(--border)] px-6 py-10 md:grid-cols-2 md:px-10">
        {prev ? (
          <Link href={`/notes/${prev.slug}`} className="group" data-cursor-hover>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--ink-dim)]">← Previous</p>
            <p className="mt-2 font-display text-xl text-[var(--ink)] group-hover:text-accent transition-colors">
              {prev.title}
            </p>
          </Link>
        ) : <div />}
        {next ? (
          <Link href={`/notes/${next.slug}`} className="group text-right" data-cursor-hover>
            <p className="text-xs uppercase tracking-[0.12em] text-[var(--ink-dim)]">Next →</p>
            <p className="mt-2 font-display text-xl text-[var(--ink)] group-hover:text-accent transition-colors">
              {next.title}
            </p>
          </Link>
        ) : <div />}
      </div>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-28 pt-6 md:px-10">
          <h2 className="mb-10 font-display text-2xl text-[var(--ink)]">Related notes</h2>
          <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-3">
            {related.map((p: any) => (
              <NoteCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
