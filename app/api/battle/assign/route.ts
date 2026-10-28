import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbStore, SlotInfo } from "@/lib/db/store";
import { isAdminRequest } from "@/lib/auth/session";
import { realtimeBus } from "@/lib/realtime/broadcast";

export const dynamic = "force-dynamic";

const assignSchema = z.object({
  target: z.enum(["house", "chat"]),
  slot: z.object({
    id: z.string(),
    name: z.string(),
    provider: z.string(),
    thumbnail: z.string().optional(),
    rtp: z.string().optional(),
    volatility: z.string().optional(),
    accent: z.string().optional(),
  }),
});

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized: Admin session required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const result = assignSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid payload", issues: result.error.issues }, { status: 400 });
    }

    const { target, slot } = result.data;
    const updatedBattle = dbStore.assignSlot(target, slot as SlotInfo);

    realtimeBus.broadcast("battle", {
      type: "slot_assigned",
      target,
      slot,
      battle: updatedBattle,
    });

    return NextResponse.json({
      ok: true,
      battle: updatedBattle,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to assign slot" }, { status: 500 });
  }
}
