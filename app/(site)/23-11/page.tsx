import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/require-admin";
import SecretGate from "@/components/SecretGate";

export const metadata = { title: "23-11", robots: { index: false, follow: false } };
export const revalidate = 0;

export default async function SecretPage() {
  const session = await requireAdmin();
  if (!session) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-3xl px-6 pb-28 pt-36 md:px-10 md:pt-44">
      <p className="text-[11px] uppercase tracking-[0.14em] text-accent">Private</p>
      <h1 className="mt-3 font-display text-4xl text-[var(--ink)] md:text-5xl">23-11</h1>
      <SecretGate />
    </div>
  );
}
