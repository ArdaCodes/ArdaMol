import { getPublishedPosts, getCategories, getTags } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import NotesExplorer from "@/components/NotesExplorer";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Notes" };
export const revalidate = 0;

export default async function NotesPage() {
  const [posts, categories, tags, allSettings] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
    getTags(),
    prisma.setting.findMany(),
  ]);

  const s: Record<string, string> = {};
  for (const item of allSettings as any[]) s[item.key] = item.value;

  const serializable = posts.map((p: any) => ({
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    coverImage: p.coverImage,
    publishedAt: p.publishedAt,
    readingTime: p.readingTime,
    category: p.category ? { name: p.category.name, slug: p.category.slug } : null,
    tags: p.tags.map((t: any) => t.tag.slug),
  }));

  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:px-10 md:pt-44">
      <Reveal>
        <p className="text-[11px] uppercase tracking-[0.14em] text-accent">
          {s.notesPageLabel || "Notes"}
        </p>
        <h1 className="mt-3 font-display text-5xl text-[var(--ink)] md:text-6xl">
          {s.notesPageHeadline || "Thoughts, ideas, experiments and things worth remembering."}
        </h1>
      </Reveal>

      {serializable.length === 0 && (
        <div className="mt-24 flex flex-col items-center text-center">
          <p className="font-display text-3xl text-[var(--ink)]">This corridor is still empty.</p>
          <p className="mt-3 max-w-sm text-[var(--ink-muted)]">
            No notes have been published yet. Check back soon — the torches are still being lit.
          </p>
        </div>
      )}

      <NotesExplorer
        posts={serializable}
        categories={categories.map((c: any) => ({ name: c.name, slug: c.slug }))}
        tags={tags.map((t: any) => ({ name: t.name, slug: t.slug }))}
      />
    </div>
  );
}