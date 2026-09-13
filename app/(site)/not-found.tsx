import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs tracking-[0.2em] text-accent">LOST IN THE FOG</p>
      <h1 className="mt-4 font-display text-7xl text-stone-50 md:text-8xl">404</h1>
      <p className="mt-4 max-w-sm text-[var(--ink-muted)]">
        This corridor of the castle doesn't lead anywhere. The page you're
        looking for may have moved or never existed.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-accent px-6 py-3 text-sm font-medium text-stone-950 transition-transform hover:scale-[1.03]"
      >
        Back to the gate
      </Link>
    </div>
  );
}
