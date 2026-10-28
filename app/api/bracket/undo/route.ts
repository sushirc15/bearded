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
    const bracket = dbStore.undoBracket();
    if (!bracket) {
      return NextResponse.json({ ok: false, error: "No bracket history to undo" }, { status: 400 });
    }

    realtimeBus.broadcast("bracket", {
      type: "bracket_undo",
      bracket,
    });

    return NextResponse.json({
      ok: true,
      bracket,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to undo bracket" }, { status: 500 });
  }
}
