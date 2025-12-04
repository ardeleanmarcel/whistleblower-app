import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { manager, response } = await requireAuth();
  if (!manager) return response;

  const { id } = await params;
  const { status } = await req.json();

  const report = await prisma.report.findUnique({
    where: { id },
  });

  if (!report || report.companyId !== manager.companyId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.report.update({
    where: { id },
    data: { status },
  });

  return NextResponse.json(updated);
}
