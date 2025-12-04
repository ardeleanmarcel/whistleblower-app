import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, signAuthToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password, companyName } = await req.json();

  if (!email || !password || !companyName) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  // Check if manager already exists
  const existingManager = await prisma.manager.findUnique({
    where: { email },
  });

  if (existingManager) {
    return NextResponse.json(
      { error: "Email already registered" },
      { status: 409 }
    );
  }

  // Create company and manager in a transaction
  const passwordHash = await hashPassword(password);

  const company = await prisma.company.create({
    data: { name: companyName },
  });

  const manager = await prisma.manager.create({
    data: {
      email,
      passwordHash,
      companyId: company.id,
    },
    include: { company: true },
  });

  // Sign JWT token
  const token = signAuthToken({
    managerId: manager.id,
    companyId: manager.companyId,
  });

  const res = NextResponse.json({
    success: true,
    manager: {
      email: manager.email,
      company: manager.company.name,
    },
  });

  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return res;
}
