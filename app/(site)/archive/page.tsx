import Link from "next/link";
import { getPublishedPosts } from "@/lib/data";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Archive" };
export const revalidate = 0;

export default async function ArchivePage() {
  const posts = await getPublishedPosts();

  const grouped: Record<string, Record<string, typeof posts>> = {};
  for (const post of posts) {
    if (!post.publishedAt) continue;
    const d = new Date(post.publishedAt);
    const year = String(d.getFullYear());
    const month = d.toLocaleString("en-US", { month: "long" });
    grouped[year] = grouped[year] || {};
    grouped[year][month] = grouped[year][month] || [];
    grouped[year][month].push(post);
  }
  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="mx-auto max-w-4xl px-6 pb-28 pt-36 md:px-10 md:pt-44">
      <Reveal>
        <p className="text-[11px] uppercase tracking-[0.14em] text-accent">Archive</p>
        <h1 className="mt-3 font-display text-5xl text-[var(--ink)] md:text-6xl">Every note, by year.</h1>
      </Reveal>

      <div className="mt-16 space-y-16">
        {years.map((year) => (
          <Reveal key={year}>
            <div className="flex flex-col gap-8 border-l border-[var(--border-strong)] pl-8 md:flex-row md:gap-16 md:pl-0 md:border-l-0">
              <p className="font-display text-4xl text-accent md:w-32 md:shrink-0">{year}</p>
              <div className="flex-1 space-y-10">
                {Object.entries(grouped[year])
                  .sort((a, b) => new Date(`${b[0]} 1, ${year}`).getTime() - new Date(`${a[0]} 1, ${year}`).getTime())
                  .map(([month, monthPosts]) => (
                    <div key={month}>
                      <p className="mb-3 text-sm uppercase tracking-[0.1em] text-[var(--ink-dim)]">{month}</p>
                      <ul className="space-y-3">
                        {monthPosts.map((p: any) => (
                          <li key={p.slug}>
                            <Link
                              href={`/notes/${p.slug}`}
                              className="flex items-baseline justify-between gap-4 border-b border-[var(--border)] py-2 group"
                            >
                              <span className="font-display text-lg text-[var(--ink)] group-hover:text-accent transition-colors">
                                {p.title}
                              </span>
                              <span className="shrink-0 text-xs text-[var(--ink-dim)]">
                                {p.category?.name}
                              </span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
