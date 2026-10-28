import { NextRequest, NextResponse } from "next/server";
import { gamesProvider, PROVIDERS } from "@/lib/games/provider";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const provider = url.searchParams.get("provider") || undefined;
  const search = url.searchParams.get("search") || undefined;
  const category = url.searchParams.get("category") || undefined;

  const [poolInfo, slots] = await Promise.all([
    gamesProvider.getPoolInfo(),
    gamesProvider.getGames({ provider, search, category }),
  ]);

  return NextResponse.json({
    poolInfo,
    providers: PROVIDERS,
    count: slots.length,
    slots,
  });
}
