import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbStore } from "@/lib/db/store";
import { isAdminRequest } from "@/lib/auth/session";
import { realtimeBus } from "@/lib/realtime/broadcast";

export const dynamic = "force-dynamic";

const declareSchema = z.object({
  winner: z.enum(["house", "chat"]),
  houseMultiplier: z.number().optional(),
  chatMultiplier: z.number().optional(),
});

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized: Admin session required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const result = declareSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid payload", issues: result.error.issues }, { status: 400 });
    }

    const { winner, houseMultiplier, chatMultiplier } = result.data;
    const { battle, score } = dbStore.declareWinner(winner, houseMultiplier, chatMultiplier);

    realtimeBus.broadcast("battle", {
      type: "winner_declared",
      winner,
      battle,
      score,
    });

    return NextResponse.json({
      ok: true,
      winner,
      battle,
      score,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to declare winner" }, { status: 500 });
  }
}
