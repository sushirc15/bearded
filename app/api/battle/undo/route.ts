import { NextRequest, NextResponse } from "next/server";
import { dbStore } from "@/lib/db/store";
import { isAdminRequest } from "@/lib/auth/session";
import { realtimeBus } from "@/lib/realtime/broadcast";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized: Admin session required" }, { status: 403 });
  }

  try {
    const res = dbStore.undoBattle();
    if (!res) {
      return NextResponse.json({ ok: false, error: "No battle history to undo" }, { status: 400 });
    }

    realtimeBus.broadcast("battle", {
      type: "battle_undo",
      battle: res.battle,
      score: res.score,
    });

    return NextResponse.json({
      ok: true,
      battle: res.battle,
      score: res.score,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to undo battle" }, { status: 500 });
  }
}
