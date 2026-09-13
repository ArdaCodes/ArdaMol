import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const media = await prisma.media.findUnique({ where: { id: params.id } });
  if (media) {
    try {
      const filePath = path.join(process.cwd(), "public", media.url);
      await unlink(filePath);
    } catch {
      // file may already be gone; ignore
    }
    await prisma.media.delete({ where: { id: params.id } });
  }
  return NextResponse.json({ ok: true });
}
