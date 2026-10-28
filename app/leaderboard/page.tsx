import { Metadata } from "next";
import { LeaderboardView } from "@/components/leaderboard/leaderboard-view";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Monthly $250 Leaderboard | The Bearded Gamer Rewards",
  description:
    "Compete in The Bearded Gamer's monthly $250 wager race. Live rankings, top-3 podium prizes, and instant rewards for the community.",
  openGraph: {
    title: "Monthly $250 Leaderboard | The Bearded Gamer",
    description: "Compete for $250 in cash prizes this month on Kick.",
    url: "https://thebeardedgamer.rewards/leaderboard",
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Bearded Gamer Monthly Leaderboard",
      },
    ],
  },
};

export default function LeaderboardPage() {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <LeaderboardView />
    </div>
  );
}
