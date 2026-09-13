import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const project = await prisma.project.update({
    where: { id: params.id },
    data: {
      title: body.title,
      description: body.description,
      image: body.image,
      category: body.category,
      technologies: body.technologies,
      externalUrl: body.externalUrl,
      date: body.date ? new Date(body.date) : undefined,
    },
  });
  return NextResponse.json({ project });
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.project.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
