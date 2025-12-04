import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { signAuthToken, verifyPassword } from "../../../lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const manager = await prisma.manager.findUnique({ where: { email } });
  if (!manager) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const ok = await verifyPassword(password, manager.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { error: "Invalid email or password" },
      { status: 401 }
    );
  }

  const token = signAuthToken({
    managerId: manager.id,
    companyId: manager.companyId,
  });

  const res = NextResponse.json({ success: true });
  res.cookies.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return res;
}
