import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const entries: [string, string][] = [];
  if (body.content !== undefined) entries.push(["secretPageContent", body.content]);
  if (body.goals !== undefined) entries.push(["secretGoals", JSON.stringify(body.goals)]);
  if (body.grudges !== undefined) entries.push(["secretGrudges", JSON.stringify(body.grudges)]);

  for (const [key, value] of entries) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
  return NextResponse.json({ ok: true });
}
