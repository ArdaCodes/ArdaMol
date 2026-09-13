import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  if (q.trim().length < 2) return NextResponse.json({ results: [] });

  const posts = await prisma.post.findMany({
    where: {
      status: "published",
      OR: [
        { title: { contains: q } },
        { excerpt: { contains: q } },
        { content: { contains: q } },
      ],
    },
    include: { category: true },
    take: 8,
    orderBy: { publishedAt: "desc" },
  });

  return NextResponse.json({
    results: posts.map((p: any) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category?.name || "Note",
    })),
  });
}
