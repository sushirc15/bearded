import { NextResponse } from "next/server";
import { PRIZE_SPLIT, getPrizeForRank } from "@/config/prizes";

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar?: string;
  wagered: number;
  prize: number;
  rankDelta?: number; // positive = climbed, negative = dropped, 0 = unchanged
}

export interface LeaderboardApiResponse {
  period: "current" | "previous";
  totalPrizePool: number;
  currency: string;
  updatedAt: string;
  nextResetIso: string;
  entries: LeaderboardEntry[];
  source: "mock" | "live_api";
}

// Realistic mock data for the current active race
const MOCK_CURRENT_ENTRIES: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "Be***r",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=BeardedTitan&backgroundColor=00e700",
    wagered: 184520,
    prize: 125,
    rankDelta: 0,
  },
  {
    rank: 2,
    username: "Kr***9",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=KryptonNine&backgroundColor=c9d1d9",
    wagered: 142800,
    prize: 60,
    rankDelta: 1,
  },
  {
    rank: 3,
    username: "Ze***x",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ZenithApex&backgroundColor=cd7f32",
    wagered: 119450,
    prize: 35,
    rankDelta: -1,
  },
  {
    rank: 4,
    username: "No***a",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=NovaStrike&backgroundColor=e5383b",
    wagered: 94300,
    prize: 20,
    rankDelta: 2,
  },
  {
    rank: 5,
    username: "Sh***w",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ShadowSpin&backgroundColor=00e700",
    wagered: 78150,
    prize: 10,
    rankDelta: -1,
  },
  {
    rank: 6,
    username: "Cy***r",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=CyberBeard",
    wagered: 62400,
    prize: 0,
    rankDelta: 0,
  },
  {
    rank: 7,
    username: "Lu***7",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=LuckySevens",
    wagered: 51200,
    prize: 0,
    rankDelta: 3,
  },
  {
    rank: 8,
    username: "Va***r",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Valkyrie",
    wagered: 44850,
    prize: 0,
    rankDelta: -2,
  },
  {
    rank: 9,
    username: "Bl***e",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=BlazeRunner",
    wagered: 38900,
    prize: 0,
    rankDelta: 1,
  },
  {
    rank: 10,
    username: "Ti***n",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=TitanSlot",
    wagered: 33150,
    prize: 0,
    rankDelta: 0,
  },
];

// Realistic mock data for the previous finished month
const MOCK_PREVIOUS_ENTRIES: LeaderboardEntry[] = [
  {
    rank: 1,
    username: "Ph***x",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=PhoenixGold&backgroundColor=00e700",
    wagered: 241900,
    prize: 125,
    rankDelta: 0,
  },
  {
    rank: 2,
    username: "Be***r",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=BeardedTitan&backgroundColor=c9d1d9",
    wagered: 215400,
    prize: 60,
    rankDelta: 0,
  },
  {
    rank: 3,
    username: "Vo***x",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=VortexWager&backgroundColor=cd7f32",
    wagered: 168900,
    prize: 35,
    rankDelta: 0,
  },
  {
    rank: 4,
    username: "St***m",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=StormBlade",
    wagered: 132000,
    prize: 20,
    rankDelta: 0,
  },
  {
    rank: 5,
    username: "Kr***9",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=KryptonNine",
    wagered: 111500,
    prize: 10,
    rankDelta: 0,
  },
  {
    rank: 6,
    username: "Ga***t",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=GambitAce",
    wagered: 89700,
    prize: 0,
    rankDelta: 0,
  },
  {
    rank: 7,
    username: "Ze***x",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ZenithApex",
    wagered: 76400,
    prize: 0,
    rankDelta: 0,
  },
  {
    rank: 8,
    username: "Dr***n",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=DragonBreath",
    wagered: 65100,
    prize: 0,
    rankDelta: 0,
  },
  {
    rank: 9,
    username: "Sh***w",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ShadowSpin",
    wagered: 58200,
    prize: 0,
    rankDelta: 0,
  },
  {
    rank: 10,
    username: "Ap***o",
    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=ApolloRays",
    wagered: 49800,
    prize: 0,
    rankDelta: 0,
  },
];

export const dynamic = "force-dynamic";
export const revalidate = 60; // 60s cache revalidation

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") === "previous" ? "previous" : "current";

    const useMock =
      process.env.USE_MOCK_DATA === "true" ||
      !process.env.AFFILIATE_API_KEY ||
      process.env.AFFILIATE_API_KEY === "mock_affiliate_key_placeholder";

    // Dynamic reset date: 1st of next month 00:00:00 UTC if not specified
    let resetIso = process.env.LEADERBOARD_RESET_ISO;
    if (!resetIso) {
      const now = new Date();
      const nextMonth = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1, 0, 0, 0));
      resetIso = nextMonth.toISOString();
    }

    if (useMock) {
      const entries = period === "previous" ? MOCK_PREVIOUS_ENTRIES : MOCK_CURRENT_ENTRIES;

      return NextResponse.json(
        {
          period,
          totalPrizePool: 250,
          currency: "USD",
          updatedAt: new Date().toISOString(),
          nextResetIso: resetIso,
          entries,
          source: "mock",
        } satisfies LeaderboardApiResponse,
        {
          headers: {
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
          },
        }
      );
    }

    // Live API integration
    const apiKey = process.env.AFFILIATE_API_KEY!;
    const apiUrl = process.env.AFFILIATE_API_URL || "https://api.affiliate-provider.example/v1";

    const response = await fetch(`${apiUrl}/leaderboard?period=${period}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`Affiliate API responded with status ${response.status}`);
    }

    const rawData = await response.json();

    // Map and normalize affiliate response
    const normalizedEntries: LeaderboardEntry[] = (rawData.data || rawData || []).map(
      (item: any, idx: number) => {
        const rank = item.rank || idx + 1;
        return {
          rank,
          username: item.username || `User_${rank}`,
          avatar: item.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${item.username || rank}`,
          wagered: Number(item.wagered || item.wager_amount || 0),
          prize: getPrizeForRank(rank),
          rankDelta: item.delta !== undefined ? Number(item.delta) : 0,
        };
      }
    );

    return NextResponse.json(
      {
        period,
        totalPrizePool: 250,
        currency: "USD",
        updatedAt: new Date().toISOString(),
        nextResetIso: resetIso,
        entries: normalizedEntries,
        source: "live_api",
      } satisfies LeaderboardApiResponse,
      {
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
        },
      }
    );
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch leaderboard data",
        message: error instanceof Error ? error.message : "Internal error",
      },
      { status: 500 }
    );
  }
}
