import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbStore } from "@/lib/db/store";
import { isAdminRequest } from "@/lib/auth/session";
import { realtimeBus } from "@/lib/realtime/broadcast";

export const dynamic = "force-dynamic";

const multipliersSchema = z.object({
  houseMultiplier: z.number().nullable().optional(),
  chatMultiplier: z.number().nullable().optional(),
});

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized: Admin session required" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const result = multipliersSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Invalid payload", issues: result.error.issues }, { status: 400 });
    }

    const { houseMultiplier, chatMultiplier } = result.data;
    const battle = dbStore.setMultipliers(houseMultiplier, chatMultiplier);

    realtimeBus.broadcast("battle", {
      type: "multipliers_updated",
      battle,
    });

    return NextResponse.json({
      ok: true,
      battle,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to set multipliers" }, { status: 500 });
  }
}
