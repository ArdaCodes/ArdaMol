import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import slugify from "slugify";

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const posts = await prisma.post.findMany({
    include: { category: true, tags: { include: { tag: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ posts });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const baseSlug = body.slug ? slugify(body.slug, { lower: true, strict: true }) : slugify(body.title || "untitled", { lower: true, strict: true });

  let slug = baseSlug;
  let counter = 1;
  while (await prisma.post.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const words = (body.content || "").trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(words / 200));

  const post = await prisma.post.create({
    data: {
      title: body.title || "Untitled",
      slug,
      excerpt: body.excerpt || "",
      content: body.content || "",
      coverImage: body.coverImage || null,
      readingTime,
      featured: !!body.featured,
      status: body.status || "draft",
      publishedAt: body.status === "published" ? new Date() : null,
      seoTitle: body.seoTitle || null,
      seoDesc: body.seoDesc || null,
      categoryId: body.categoryId || null,
      tags: body.tagIds?.length
        ? { create: body.tagIds.map((tagId: string) => ({ tagId })) }
        : undefined,
    },
  });

  return NextResponse.json({ post });
}
