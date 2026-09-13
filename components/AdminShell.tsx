"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return <div className="min-h-screen bg-stone-950">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <AdminSidebar />
      <div className="md:ml-64">
        <div className="mx-auto max-w-5xl px-6 py-10 md:px-10">{children}</div>
      </div>
    </div>
  );
}
