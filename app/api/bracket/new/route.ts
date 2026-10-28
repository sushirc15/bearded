import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbStore } from "@/lib/db/store";
import { isAdminRequest } from "@/lib/auth/session";
import { realtimeBus } from "@/lib/realtime/broadcast";

export const dynamic = "force-dynamic";

const newBracketSchema = z.object({
  size: z.union([z.literal(4), z.literal(8), z.literal(16)]).default(8),
});

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized: Admin session required" }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parse = newBracketSchema.safeParse(body);
    const size = parse.success ? parse.data.size : 8;

    const bracket = dbStore.newBracket(size);

    realtimeBus.broadcast("bracket", {
      type: "bracket_new",
      bracket,
    });

    return NextResponse.json({
      ok: true,
      bracket,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create new bracket" }, { status: 500 });
  }
}
