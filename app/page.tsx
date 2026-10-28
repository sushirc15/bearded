import { Metadata } from "next";
import { HomeView } from "@/components/home/home-view";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "The Bearded Gamer | Official Streamer Rewards & $250 Wager Race",
  description:
    "Official rewards website for The Bearded Gamer on Kick. Compete for $250 in monthly leaderboard prizes, get instant 15% rakeback, and daily stream code drops.",
  openGraph: {
    title: "The Bearded Gamer | Official Streamer Rewards & Races",
    description:
      "Join The Bearded Gamer community on Kick. $250 monthly wager race, instant rakeback, and exclusive VIP perks.",
    url: "https://thebeardedgamer.rewards",
    siteName: siteConfig.name,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "The Bearded Gamer Streamer Rewards",
      },
    ],
  },
};

export default function HomePage() {
  return (
    <div className="pt-28 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <HomeView />
    </div>
  );
}
