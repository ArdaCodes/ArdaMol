import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG and WEBP are supported" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadsDir, { recursive: true });

  const ext = file.name.split(".").pop() || "jpg";
  const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
  await writeFile(path.join(uploadsDir, filename), buffer);

  const url = `/uploads/${filename}`;
  const media = await prisma.media.create({
    data: { filename: file.name, url, mimeType: file.type },
  });

  return NextResponse.json({ media });
}
