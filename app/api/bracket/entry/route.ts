import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbStore } from "@/lib/db/store";
import { isAdminRequest } from "@/lib/auth/session";
import { realtimeBus } from "@/lib/realtime/broadcast";

export const dynamic = "force-dynamic";

const entrySchema = z.object({
  index: z.number().int().min(0),
  slot: z.string().optional(),
  player: z.string().optional(),
});

export async function PATCH(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized: Admin session required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const result = entrySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid payload", issues: result.error.issues }, { status: 400 });
    }

    const { index, slot, player } = result.data;
    const bracket = dbStore.updateBracketEntry(index, slot, player);

    realtimeBus.broadcast("bracket", {
      type: "bracket_entry_updated",
      index,
      bracket,
    });

    return NextResponse.json({
      ok: true,
      bracket,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update entry" }, { status: 500 });
  }
}
