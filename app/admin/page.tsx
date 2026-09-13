import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";

export const revalidate = 0;

export default async function AdminDashboard() {
  const [postCount, publishedCount, draftCount, projectCount, mediaCount, recentPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { status: "published" } }),
      prisma.post.count({ where: { status: "draft" } }),
      prisma.project.count(),
      prisma.media.count(),
      prisma.post.findMany({ orderBy: { updatedAt: "desc" }, take: 5, include: { category: true } }),
    ]);

  const stats = [
    { label: "Total posts", value: postCount },
    { label: "Published", value: publishedCount },
    { label: "Drafts", value: draftCount },
    { label: "Projects", value: projectCount },
    { label: "Media files", value: mediaCount },
  ];

  return (
    <div>
      <h1 className="font-serif text-3xl text-stone-900">Dashboard</h1>
      <p className="mt-1 text-stone-500">Welcome back to the castle.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-lg border border-stone-200 bg-white p-4">
            <p className="text-2xl font-semibold text-stone-900">{s.value}</p>
            <p className="mt-1 text-xs text-stone-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-stone-900">Recent posts</h2>
        <Link href="/admin/posts/new" className="rounded-md bg-stone-900 px-4 py-2 text-sm text-white">
          + New Post
        </Link>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-stone-200 bg-white">
        {recentPosts.length === 0 ? (
          <p className="p-6 text-sm text-stone-500">No posts yet.</p>
        ) : (
          <table className="w-full text-sm">
            <tbody>
              {recentPosts.map((p: any) => (
                <tr key={p.id} className="border-b border-stone-100 last:border-0">
                  <td className="px-5 py-3">
                    <Link href={`/admin/posts/${p.id}`} className="font-medium text-stone-900 hover:text-[#b8874a]">
                      {p.title}
                    </Link>
                    <p className="text-xs text-stone-400">{p.category?.name || "Uncategorized"}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs ${
                        p.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right text-stone-400">{formatDate(p.updatedAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
