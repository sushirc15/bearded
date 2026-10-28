import { Metadata } from "next";
import { RewardsView } from "@/components/perks/rewards-view";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Perks & Rewards | The Bearded Gamer",
  description:
    "Claim weekly reloads, instant 15% rakeback, level-up bonuses, and live Kick stream giveaways with code BEARDED.",
  openGraph: {
    title: "Streamer Rewards & VIP Perks | The Bearded Gamer",
    description: "Instant rakeback, weekly reloads, and $250 monthly leaderboard.",
    url: "https://thebeardedgamer.rewards/rewards",
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Bearded Gamer Rewards & Perks",
      },
    ],
  },
};

export default function RewardsPage() {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <RewardsView />
    </div>
  );
}
