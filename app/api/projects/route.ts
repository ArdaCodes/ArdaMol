import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import slugify from "slugify";

export async function GET() {
  const projects = await prisma.project.findMany({ orderBy: { date: "desc" } });
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const baseSlug = slugify(body.title, { lower: true, strict: true });
  let slug = baseSlug;
  let counter = 1;
  while (await prisma.project.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${counter++}`;
  }

  const project = await prisma.project.create({
    data: {
      title: body.title,
      slug,
      description: body.description || "",
      image: body.image || null,
      category: body.category || "Web",
      technologies: body.technologies || "",
      externalUrl: body.externalUrl || null,
      date: body.date ? new Date(body.date) : new Date(),
    },
  });

  return NextResponse.json({ project });
}
