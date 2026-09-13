import Link from "next/link";
import Image from "next/image";
import ParallaxHero from "@/components/ParallaxHero";
import NoteCard from "@/components/NoteCard";
import Reveal from "@/components/Reveal";
import { getFeaturedPost, getLatestPosts, getProjects } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function HomePage() {
  const [featured, latest, projects, allSettings] = await Promise.all([
    getFeaturedPost(),
    getLatestPosts(6, undefined),
    getProjects(),
    prisma.setting.findMany(),
  ]);

  const s: Record<string, string> = {};
  for (const item of allSettings as any[]) s[item.key] = item.value;

  const latestExcludingFeatured = latest.filter((p: any) => p.slug !== featured?.slug).slice(0, 6);

  const timeline = [
    { year: "2023", label: s.timeline2023 || "Started building small side projects seriously" },
    { year: "2024", label: s.timeline2024 || "Went deep on AI systems and robotics experiments" },
    { year: "2025", label: s.timeline2025 || "Began documenting the process publicly" },
    { year: "2026", label: s.timeline2026 || "Arda Mol — The Castle of Ideas — goes live" },
  ];

  return (
    <>
      <ParallaxHero
        tagline={s.siteTagline || "Thoughts. Stories. Projects. Experiments."}
        eyebrow={s.heroEyebrow}
        titleMain={s.heroTitleMain}
        titleAccent={s.heroTitleAccent}
        exploreNotesText={s.heroExploreNotesText}
        viewProjectsText={s.heroViewProjectsText}
        scrollText={s.heroScrollText}
      />

      {/* ABOUT */}
      <section id="about" className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
        <Reveal>
          <p className="font-display text-2xl leading-snug text-[var(--ink)] md:text-3xl md:leading-snug">
            {s.aboutHeadline ||
              "Things I learn, build and document. This is a running record of experiments that worked, ideas that didn't, and the occasional project I'm proud enough to show."}
          </p>
        </Reveal>
        <Reveal delay={0.1} className="mt-8">
          <p className="max-w-xl text-[var(--ink-muted)]">
            {s.aboutText ||
              "I'm Arda — I write mostly about AI, robotics, programming and the small ideas in between. Everything here is written first for myself, and shared in case it's useful to anyone else digging through the same questions."}
          </p>
        </Reveal>
      </section>

      {/* FEATURED NOTE */}
      {featured && (
        <section className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
          <Reveal>
            <p className="mb-6 text-[11px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
              {s.featuredNoteLabel || "Featured note"}
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <NoteCard post={featured} size="large" />
          </Reveal>
        </section>
      )}

      {/* LATEST NOTES */}
      <section className="mx-auto max-w-6xl px-6 pb-24 md:px-10">
        <Reveal className="mb-10 flex items-end justify-between">
          <h2 className="font-display text-3xl text-[var(--ink)] md:text-4xl">
            {s.latestNotesTitle || "Latest notes"}
          </h2>
          <Link href="/notes" className="ink-link hidden text-sm text-[var(--ink-muted)] md:block">
            {s.latestNotesViewAll || "View all →"}
          </Link>
        </Reveal>
        <div className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {latestExcludingFeatured.map((post: any, i: number) => (
            <Reveal key={post.slug} delay={i * 0.05}>
              <NoteCard post={post} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* PROJECTS */}
      <section className="border-t border-[var(--border)] bg-[var(--surface)]">
        <div className="mx-auto max-w-6xl px-6 py-24 md:px-10">
          <Reveal className="mb-10">
            <h2 className="font-display text-3xl text-[var(--ink)] md:text-4xl">
              {s.projectsSectionTitle || "Projects"}
            </h2>
            <p className="mt-3 max-w-lg text-[var(--ink-muted)]">
              {s.projectsSectionDesc || "A handful of things I've built across AI, robotics, and the web."}
            </p>
          </Reveal>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.slice(0, 4).map((p: any, i: number) => (
              <Reveal key={p.slug} delay={i * 0.06}>
                <Link
                  href="/projects"
                  data-cursor-hover
                  className="group relative block overflow-hidden rounded-sm border border-[var(--border)]"
                >
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
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                  </div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <p className="text-[11px] uppercase tracking-[0.12em] text-accent">{p.category}</p>
                    <h3 className="mt-1 font-display text-2xl text-[var(--ink)]">{p.title}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section className="mx-auto max-w-6xl px-6 py-24 md:px-10">
        <Reveal className="mb-12">
          <h2 className="font-display text-3xl text-[var(--ink)] md:text-4xl">
            {s.timelineTitle || "Timeline"}
          </h2>
        </Reveal>
        <div className="border-l border-[var(--border-strong)] pl-8">
          {timeline.map((t, i) => (
            <Reveal key={t.year} delay={i * 0.05} className="relative mb-10 last:mb-0">
              <span className="absolute -left-[2.35rem] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" />
              <p className="font-mono text-sm text-accent">{t.year}</p>
              <p className="mt-1 text-[var(--ink-muted)]">{t.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--bg)] py-28 text-center">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(184,135,74,0.12),transparent_60%)]" />
        <Reveal className="relative mx-auto max-w-2xl px-6">
          <h2 className="font-display text-4xl text-[var(--ink)] md:text-5xl">
            {s.ctaHeadline || "Explore the archive."}
          </h2>
          <Link
            href="/notes"
            data-cursor-hover
            className="mt-8 inline-flex items-center gap-2 text-lg text-accent"
          >
            {s.ctaButtonText || "View All Notes"}
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </Reveal>
      </section>
    </>
  );
}