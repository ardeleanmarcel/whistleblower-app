// src/lib/requireAuth.ts
import { NextResponse } from "next/server";
import { getCurrentManager } from "./auth";
import type { Manager } from "@prisma/client";

export async function requireAuth(): Promise<
  | { manager: null; response: NextResponse }
  | { manager: Manager; response: undefined }
> {
  const manager = await getCurrentManager();
  if (!manager) {
    return {
      manager: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { manager, response: undefined };
}
