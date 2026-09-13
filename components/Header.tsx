"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeSwitcher from "./ThemeSwitcher";
import SearchOverlay from "./SearchOverlay";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/notes", label: "Notes" },
  { href: "/projects", label: "Projects" },
  { href: "/#about", label: "About" },
  { href: "/archive", label: "Archive" },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-colors duration-500 ${
          scrolled ? "bg-[var(--overlay)] backdrop-blur-md border-b border-[var(--border)]" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
          <Link href="/" className="font-display text-lg tracking-tight text-[var(--ink)]" data-cursor-hover>
            Arda Mol
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="ink-link text-sm text-[var(--ink-muted)] hover:text-[var(--ink)] transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="rounded-full border border-[var(--border-strong)] p-2 text-[var(--ink-muted)] hover:border-accent/60 hover:text-accent transition-colors"
              data-cursor-hover
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
                <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <div className="hidden md:block">
              <ThemeSwitcher />
            </div>
            <button
              className="md:hidden text-[var(--ink)]"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label="Menu"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                {menuOpen ? (
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-[var(--border)] bg-[var(--overlay)] px-6 py-6">
            <nav className="flex flex-col gap-5">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} className="font-display text-2xl text-[var(--ink)]">
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="mt-6">
              <ThemeSwitcher />
            </div>
          </div>
        )}
      </header>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
    </>
  );
}
