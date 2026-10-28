import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbStore } from "@/lib/db/store";
import { kickProvider } from "@/lib/kick/provider";
import { isAdminRequest } from "@/lib/auth/session";
import { realtimeBus } from "@/lib/realtime/broadcast";

export const dynamic = "force-dynamic";

const chatterSchema = z
  .object({
    username: z.string().min(1).optional(),
    avatar: z.string().optional(),
  })
  .optional();

export async function POST(req: NextRequest) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized: Admin session required" }, { status: 403 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const parse = chatterSchema.safeParse(body);

    let chatterName: string;
    let chatterAvatar: string;

    if (parse.success && parse.data?.username) {
      chatterName = parse.data.username;
      chatterAvatar =
        parse.data.avatar ||
        `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80`;
    } else {
      const chatter = await kickProvider.pickRandomChatter();
      chatterName = chatter.username;
      chatterAvatar = chatter.avatar;
    }

    const updatedBattle = dbStore.setChatter(chatterName, chatterAvatar);

    realtimeBus.broadcast("battle", {
      type: "chatter_picked",
      chatter: { username: chatterName, avatar: chatterAvatar },
      battle: updatedBattle,
    });

    return NextResponse.json({
      ok: true,
      chatter: { username: chatterName, avatar: chatterAvatar },
      battle: updatedBattle,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to pick chatter" }, { status: 500 });
  }
}
