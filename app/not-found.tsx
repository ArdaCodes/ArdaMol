import Link from "next/link";

export default function RootNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-stone-950 px-6 text-center text-stone-50">
      <p className="font-mono text-xs tracking-[0.2em] text-[#b8874a]">LOST IN THE FOG</p>
      <h1 className="mt-4 text-7xl">404</h1>
      <p className="mt-4 max-w-sm text-stone-400">
        This corridor of the castle doesn't lead anywhere.
      </p>
      <Link
        href="/"
        className="mt-8 rounded-full bg-[#b8874a] px-6 py-3 text-sm font-medium text-stone-950"
      >
        Back to the gate
      </Link>
    </div>
  );
}
