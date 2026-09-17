"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/categories", label: "Categories" },
  { href: "/admin/tags", label: "Tags" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/map", label: "Map" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/appearance", label: "Appearance" },
  { href: "/admin/settings", label: "Settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-stone-300 bg-white px-6 py-8 md:flex">
      <Link href="/" className="font-display text-lg text-stone-900">
        Arda Mol
      </Link>
      <p className="mb-8 mt-1 text-xs uppercase tracking-[0.12em] text-stone-400">Admin</p>

      <nav className="flex-1 space-y-1">
        {NAV.map((item) => {
          const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                active ? "bg-stone-900 text-white" : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="mt-6 rounded-md border border-stone-300 px-3 py-2 text-left text-sm text-stone-600 hover:bg-stone-100"
      >
        Logout
      </button>
    </aside>
  );
}
