import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const pinSetting = await prisma.setting.findUnique({ where: { key: "secretPagePin" } });
  const correctPin = pinSetting?.value || "";

  if (correctPin && body.pin !== correctPin) {
    return NextResponse.json({ error: "Wrong PIN" }, { status: 403 });
  }

  const contentSetting = await prisma.setting.findUnique({ where: { key: "secretPageContent" } });
  return NextResponse.json({ ok: true, content: contentSetting?.value || "" });
}
