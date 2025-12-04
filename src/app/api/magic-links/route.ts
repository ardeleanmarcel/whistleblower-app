import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";
import { randomBytes } from "node:crypto";

export async function GET() {
  const { manager, response } = await requireAuth();
  if (!manager) return response;

  const links = await prisma.magicLink.findMany({
    where: { companyId: manager.companyId },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(links);
}

export async function POST(req: NextRequest) {
  const { manager, response } = await requireAuth();
  if (!manager) return response;

  const { label } = await req.json();

  const token = randomBytes(16).toString("hex");

  const link = await prisma.magicLink.create({
    data: {
      label,
      token,
      companyId: manager.companyId,
    },
  });

  return NextResponse.json(link, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const { manager, response } = await requireAuth();
  if (!manager) return response;

  const { id, active } = await req.json();

  const updated = await prisma.magicLink.update({
    where: { id },
    data: { active },
  });

  // Important: ensure this link belongs to the same company
  if (updated.companyId !== manager.companyId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(updated);
}
