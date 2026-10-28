import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbStore } from "@/lib/db/store";
import { isAdminRequest } from "@/lib/auth/session";
import { realtimeBus } from "@/lib/realtime/broadcast";

export const dynamic = "force-dynamic";

const advanceSchema = z.object({
  roundIndex: z.number().int().min(0),
  matchIndex: z.number().int().min(0),
  winner: z.string().min(1),
});

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized: Admin session required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const result = advanceSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid payload", issues: result.error.issues }, { status: 400 });
    }

    const { roundIndex, matchIndex, winner } = result.data;
    const bracket = dbStore.advanceBracketWinner(roundIndex, matchIndex, winner);

    realtimeBus.broadcast("bracket", {
      type: "bracket_advanced",
      roundIndex,
      matchIndex,
      winner,
      bracket,
    });

    return NextResponse.json({
      ok: true,
      bracket,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to advance bracket winner" }, { status: 500 });
  }
}
