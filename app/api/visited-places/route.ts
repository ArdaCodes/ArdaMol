import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";

export async function GET() {
  const places = await prisma.visitedPlace.findMany();
  return NextResponse.json({ places });
}

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const place = await prisma.visitedPlace.upsert({
    where: { type_code: { type: body.type, code: body.code } },
    update: { name: body.name, note: body.note || "" },
    create: { type: body.type, code: body.code, name: body.name, note: body.note || "" },
  });
  return NextResponse.json({ place });
}
