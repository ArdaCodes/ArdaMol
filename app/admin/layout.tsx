import AuthProvider from "@/components/AuthProvider";
import AdminShell from "@/components/AdminShell";

export const metadata = { title: "Admin — Arda Mol", robots: { index: false, follow: false } };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
