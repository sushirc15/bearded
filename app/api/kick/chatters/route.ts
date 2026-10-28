import { NextRequest, NextResponse } from "next/server";
import { kickProvider } from "@/lib/kick/provider";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const minutes = url.searchParams.get("minutes")
    ? parseInt(url.searchParams.get("minutes")!, 10)
    : 15;

  const chatters = await kickProvider.getActiveChatters({ minutes });
  return NextResponse.json({
    chatters,
    count: chatters.length,
  });
}
