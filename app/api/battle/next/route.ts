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
    const battle = dbStore.nextBattle();
    const score = dbStore.getScore();

    realtimeBus.broadcast("battle", {
      type: "next_battle",
      battle,
      score,
    });

    return NextResponse.json({
      ok: true,
      battle,
      score,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to start next battle" }, { status: 500 });
  }
}
