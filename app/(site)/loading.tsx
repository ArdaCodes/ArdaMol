export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-4">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent" />
      <p className="text-xs uppercase tracking-[0.14em] text-stone-500">Loading</p>
    </div>
  );
}
