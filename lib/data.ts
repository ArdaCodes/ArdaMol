import { prisma } from "@/lib/prisma";

export async function getPublishedPosts() {
  return prisma.post.findMany({
    where: { status: "published" },
    include: { category: true, tags: { include: { tag: true } } },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getFeaturedPost() {
  const featured = await prisma.post.findFirst({
    where: { status: "published", featured: true },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });
  if (featured) return featured;
  return prisma.post.findFirst({
    where: { status: "published" },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
  });
}

export async function getLatestPosts(take = 6, excludeSlug?: string) {
  return prisma.post.findMany({
    where: { status: "published", slug: excludeSlug ? { not: excludeSlug } : undefined },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take,
  });
}

export async function getPostBySlug(slug: string) {
  return prisma.post.findUnique({
    where: { slug },
    include: { category: true, tags: { include: { tag: true } } },
  });
}

export async function getAdjacentPosts(publishedAt: Date | null, currentSlug: string) {
  if (!publishedAt) return { prev: null, next: null };
  const [prev, next] = await Promise.all([
    prisma.post.findFirst({
      where: { status: "published", publishedAt: { lt: publishedAt }, slug: { not: currentSlug } },
      orderBy: { publishedAt: "desc" },
    }),
    prisma.post.findFirst({
      where: { status: "published", publishedAt: { gt: publishedAt }, slug: { not: currentSlug } },
      orderBy: { publishedAt: "asc" },
    }),
  ]);
  return { prev, next };
}

export async function getRelatedPosts(categoryId: string | null, currentSlug: string, take = 3) {
  if (!categoryId) return [];
  return prisma.post.findMany({
    where: { status: "published", categoryId, slug: { not: currentSlug } },
    include: { category: true },
    orderBy: { publishedAt: "desc" },
    take,
  });
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export async function getTags() {
  return prisma.tag.findMany({ orderBy: { name: "asc" } });
}

export async function getProjects() {
  return prisma.project.findMany({ orderBy: { date: "desc" } });
}
