import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/auth/session";

export async function GET(request: Request) {
  const isAdmin = isAdminRequest(request);
  return NextResponse.json({ isAdmin });
}
