import { NextRequest, NextResponse } from "next/server";
import { dbStore } from "@/lib/db/store";
import { isAdminRequest } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const isAdmin = isAdminRequest(req);
  return NextResponse.json({
    bracket: dbStore.getBracket(),
    isAdmin,
  });
}
