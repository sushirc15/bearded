import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { dbStore, RollState, SlotInfo } from "@/lib/db/store";
import { gamesProvider } from "@/lib/games/provider";
import { isAdminRequest } from "@/lib/auth/session";
import { realtimeBus } from "@/lib/realtime/broadcast";

export const dynamic = "force-dynamic";

const rollSchema = z.object({
  provider: z.string().optional(),
});

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized: Admin session required" }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parse = rollSchema.safeParse(body);
    const provider = parse.success ? parse.data.provider : undefined;

    const winningGame = await gamesProvider.getRandomSlot(provider);

    const slotInfo: SlotInfo = {
      id: winningGame.id,
      name: winningGame.title,
      provider: winningGame.provider,
      thumbnail: winningGame.imageUrl,
      rtp: winningGame.rtp,
      volatility: winningGame.volatility,
      accent: winningGame.accent || "#00E700",
    };

    const rollId = crypto.randomUUID();
    // Jitter between -30px and +30px so cards don't land at the exact same sub-pixel spot every spin
    const jitter = Math.floor(Math.random() * 61) - 30;

    const rollState: RollState = {
      rollId,
      slotId: slotInfo.id,
      slot: slotInfo,
      startedAt: Date.now(),
      durationMs: 5500,
      jitter,
    };

    dbStore.setCurrentRoll(rollState);

    realtimeBus.broadcast("battle", {
      type: "roll_started",
      roll: rollState,
      battle: dbStore.getBattle(),
    });

    return NextResponse.json({
      ok: true,
      roll: rollState,
      battle: dbStore.getBattle(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to process roll" }, { status: 500 });
  }
}
