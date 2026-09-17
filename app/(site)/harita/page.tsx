import { prisma } from "@/lib/prisma";
import PublicMapClient from "@/components/PublicMapClient";

export const metadata = { title: "Map" };
export const revalidate = 0;

export default async function MapPage() {
  const places = await prisma.visitedPlace.findMany();

  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-36 md:px-10 md:pt-44">
      <p className="text-[11px] uppercase tracking-[0.14em] text-accent">Map</p>
      <h1 className="mt-3 font-display text-5xl text-[var(--ink)] md:text-6xl">
        Places I have been.
      </h1>
      <p className="mt-5 max-w-lg text-[var(--ink-muted)]">
        Click a colored province or country to read the note.
      </p>

      <PublicMapClient places={places} />
    </div>
  );
}
