import Image from "next/image";
import { getProjects } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Projects",
};

export const revalidate = 0;

export default async function ProjectsPage() {
  const [projects, allSettings] = await Promise.all([
    getProjects(),
    prisma.setting.findMany(),
  ]);

  const s: Record<string, string> = {};

  for (const item of allSettings) {
    s[item.key] = item.value;
  }

  return (
    <main className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:px-10 md:pt-44">
      <Reveal>
        <p className="text-[11px] uppercase tracking-[0.14em] text-accent">
          {s.projectsPageLabel || "Projects"}
        </p>

        <h1 className="mt-3 font-display text-5xl text-[var(--ink)] md:text-6xl">
          {s.projectsPageHeadline || "Things I've built."}
        </h1>

        <p className="mt-5 max-w-lg text-[var(--ink-muted)]">
          {s.projectsPageDesc ||
            "A working record of experiments across AI, robotics, the web, and the occasional creative side-quest."}
        </p>
      </Reveal>

      {projects.length === 0 && (
        <div className="mt-24 flex flex-col items-center text-center">
          <p className="font-display text-3xl text-[var(--ink)]">
            No projects on display yet.
          </p>

          <p className="mt-3 max-w-sm text-[var(--ink-muted)]">
            The workshop is quiet for now - new work will appear here soon.
          </p>
        </div>
      )}

      <div className="mt-16 grid grid-cols-1 gap-10 md:grid-cols-2">
        {projects.map((p: any, i: number) => (
          <Reveal key={p.slug} delay={i * 0.05}>
            <article className="group overflow-hidden rounded-sm border border-[var(--border)]">
              <div className="relative aspect-[16/10]">
                {p.image && (
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>

              <div className="p-6">
                <p className="text-[11px] uppercase tracking-[0.12em] text-accent">
                  {p.category}
                </p>

                <h3 className="mt-2 font-display text-2xl text-[var(--ink)]">
                  {p.title}
                </h3>

                <p className="mt-2 text-sm text-[var(--ink-muted)]">
                  {p.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {p.technologies &&
                    p.technologies.split(",").map((t: string) => (
                      <span
                        key={t}
                        className="rounded-full border border-[var(--border-strong)] px-2.5 py-1 text-[11px] text-[var(--ink-muted)]"
                      >
                        {t.trim()}
                      </span>
                    ))}
                </div>

                {p.externalUrl && (
                  <a
                    href={p.externalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="ink-link mt-5 inline-block text-sm text-[var(--ink)]"
                  >
                    {s.projectsVisitButtonText || "Visit project"}
                  </a>
                )}
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </main>
  );
}