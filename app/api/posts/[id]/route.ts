import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import slugify from "slugify";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { tags: true },
  });
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const existing = await prisma.post.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let slug = existing.slug;
  if (body.slug) {
    const desired = slugify(body.slug, { lower: true, strict: true });
    if (desired !== existing.slug) {
      let candidate = desired;
      let counter = 1;
      while (await prisma.post.findFirst({ where: { slug: candidate, NOT: { id: params.id } } })) {
        candidate = `${desired}-${counter++}`;
      }
      slug = candidate;
    }
  }

  const words = (body.content ?? existing.content).trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(words / 200));

  const willPublish = body.status === "published" && existing.status !== "published";

  if (body.featured) {
    await prisma.post.updateMany({
      where: { id: { not: params.id } },
      data: { featured: false },
    });
  }

  if (body.tagIds) {
    await prisma.postTag.deleteMany({ where: { postId: params.id } });
  }

  const post = await prisma.post.update({
    where: { id: params.id },
    data: {
      title: body.title ?? existing.title,
      slug,
      excerpt: body.excerpt ?? existing.excerpt,
      content: body.content ?? existing.content,
      coverImage: body.coverImage ?? existing.coverImage,
      readingTime,
      featured: body.featured ?? existing.featured,
      status: body.status ?? existing.status,
      publishedAt: willPublish ? new Date() : existing.publishedAt,
      seoTitle: body.seoTitle ?? existing.seoTitle,
      seoDesc: body.seoDesc ?? existing.seoDesc,
      categoryId: body.categoryId ?? existing.categoryId,
      tags: body.tagIds?.length
        ? { create: body.tagIds.map((tagId: string) => ({ tagId })) }
        : undefined,
    },
  });

  return NextResponse.json({ post });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
