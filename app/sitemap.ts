import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await prisma.post.findMany({ where: { status: "published" } });
  const base = "https://ardamol.com";

  const staticRoutes = ["", "/notes", "/projects", "/archive"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const postRoutes = posts.map((p: any) => ({
    url: `${base}/notes/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  return [...staticRoutes, ...postRoutes];
}
