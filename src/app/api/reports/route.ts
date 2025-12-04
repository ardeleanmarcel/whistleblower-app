import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/requireAuth";

export async function GET() {
  const { manager, response } = await requireAuth();
  if (!manager) return response;

  const reports = await prisma.report.findMany({
    where: { companyId: manager.companyId },
    orderBy: { createdAt: "desc" },
    include: { magicLink: true },
  });

  return NextResponse.json(reports);
}
