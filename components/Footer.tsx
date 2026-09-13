import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--border)] bg-[var(--bg)]">
      <svg
        className="pointer-events-none absolute bottom-0 left-0 w-full opacity-[0.08]"
        viewBox="0 0 1440 180"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 180V90h40V60h20V40h30v20h15V40h10V20h20v20h10v40h20V60h30v30h20V70h15V50h25v20h10v40h30V90h20v50h20V70h35V50h15V30h20v20h10v-10h15v20h10v20h30V70h20v20h30v20h30V70h20v50h35v-30h20v10h15v20h30v-40h20v10h20V90h30v10h20v-10h30v90H0Z"
          fill="currentColor"
          className="text-accent"
        />
      </svg>

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-display text-2xl text-[var(--ink)]">Arda Mol</p>
            <p className="mt-2 max-w-xs text-sm text-[var(--ink-muted)]">
              The Castle of Ideas — a personal record of things learned, built, and
              documented along the way.
            </p>
          </div>

          <div className="flex gap-16">
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
                Explore
              </p>
              <ul className="space-y-2 text-sm text-[var(--ink-muted)]">
                <li><Link href="/notes" className="ink-link">Notes</Link></li>
                <li><Link href="/projects" className="ink-link">Projects</Link></li>
                <li><Link href="/archive" className="ink-link">Archive</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 text-[11px] uppercase tracking-[0.14em] text-[var(--ink-dim)]">
                Elsewhere
              </p>
              <ul className="space-y-2 text-sm text-[var(--ink-muted)]">
                <li><a className="ink-link" href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
                <li><a className="ink-link" href="https://twitter.com" target="_blank" rel="noreferrer">X / Twitter</a></li>
                <li><a className="ink-link" href="mailto:hello@ardamol.com">Email</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-start justify-between gap-4 border-t border-[var(--border)] pt-6 text-xs text-[var(--ink-dim)] md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Arda Mol. All rights reserved.</p>
          <Link href="/admin/login" className="text-[var(--ink-dim)] hover:text-[var(--ink-muted)] transition-colors">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
