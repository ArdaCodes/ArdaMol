"use client";

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
      <p className="font-mono text-xs tracking-[0.2em] text-accent">THE TORCHES WENT OUT</p>
      <h1 className="mt-4 font-display text-5xl text-stone-50 md:text-6xl">
        Something broke.
      </h1>
      <p className="mt-4 max-w-sm text-[var(--ink-muted)]">
        An unexpected error occurred while rendering this page.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-full bg-accent px-6 py-3 text-sm font-medium text-stone-950 transition-transform hover:scale-[1.03]"
      >
        Try again
      </button>
    </div>
  );
}
