export interface PerkItem {
  id: string;
  badge: string;
  stat: string;
  statLabel: string;
  title: string;
  description: string;
  bullets: [string, string];
  ctaText: string;
  ctaHref: string;
  isExternal?: boolean;
  isTopPerk?: boolean;
  accentColor?: string;
  iconName: "gift" | "percent" | "zap" | "video" | "coins" | "messageSquare" | "crown";
}

export const PERKS_DATA: PerkItem[] = [
  {
    id: "weekly-bonus",
    badge: "Every Saturday",
    stat: "$$$",
    statLabel: "Cash boost based on wager",
    title: "Weekly Reload Bonus",
    description:
      "Claim your customized weekly reload calculated straight from your weekly gameplay volume. No playthrough hurdles.",
    bullets: [
      "Calculated automatically every Saturday 12:00 UTC",
      "Immediate withdrawable or playable funds",
    ],
    ctaText: "Claim Reload",
    ctaHref: "https://gamba.com/?c=BeardedGamer",
    isExternal: true,
    isTopPerk: false,
    iconName: "gift",
  },
  {
    id: "rakeback",
    badge: "Instant Payouts",
    stat: "Up to 15%",
    statLabel: "House edge returned",
    title: "Instant Rakeback",
    description:
      "Earn a direct percentage back on every spin, bet, and hand win or lose. Click and claim in real-time.",
    bullets: [
      "Accumulates live on every single wager",
      "Zero wagering requirement to withdraw",
    ],
    ctaText: "Activate on Gamba",
    ctaHref: "https://gamba.com/?c=BeardedGamer",
    isExternal: true,
    isTopPerk: true, // Marked as Top Perk with animated gradient border
    iconName: "percent",
  },
  {
    id: "rank-up-boost",
    badge: "Level Up",
    stat: "Level Boost",
    statLabel: "Milestone rewards",
    title: "VIP Rank-Up Boost",
    description:
      "Every tier you unlock triggers an instant cash prize and permanently raises your bonus percentages.",
    bullets: [
      "Unlock Bronze to Diamond tier cash drops",
      "Dedicated VIP host at high tiers",
    ],
    ctaText: "Check VIP Tiers",
    ctaHref: "https://gamba.com/?c=BeardedGamer",
    isExternal: true,
    iconName: "zap",
  },
  {
    id: "kick-giveaways",
    badge: "Live Streams",
    stat: "Daily Streams",
    statLabel: "Interactive chat drops",
    title: "Live Kick Giveaways",
    description:
      "Tune into The Bearded Gamer streams on Kick for spontaneous chat rain, wheel spins, and bonus buy entries.",
    bullets: [
      "Enter stream giveaways with chat keywords",
      "Wheel spins triggered on big bonus hits",
    ],
    ctaText: "Watch on Kick",
    ctaHref: "https://kick.com/TThebeardedGamer",
    isExternal: true,
    isTopPerk: false,
    iconName: "video",
  },
  {
    id: "code-drops",
    badge: "Flash Drops",
    stat: "Promo Codes",
    statLabel: "First-come first-serve",
    title: "Secret Code Drops",
    description:
      "Active wagerers get exclusive access to limited-redemption promo codes dropped during live streams and in Discord.",
    bullets: [
      "High-value drops during epic stream sessions",
      "Redeemable directly in the casino rewards tab",
    ],
    ctaText: "Join Stream Alerts",
    ctaHref: "https://kick.com/TThebeardedGamer",
    isExternal: true,
    isTopPerk: false,
    iconName: "coins",
  },
  {
    id: "discord-access",
    badge: "Community",
    stat: "24/7 Crew",
    statLabel: "VIP Chat & Events",
    title: "VIP Discord Lounge",
    description:
      "Private channels, slot replay showcases, high-roller chat, tip alerts, and community tournaments.",
    bullets: [
      "Link your account for the exclusive Beard role",
      "Member-only giveaways and community polls",
    ],
    ctaText: "Join Discord",
    ctaHref: "https://discord.gg/WzJ6zDRQzG",
    isExternal: true,
    isTopPerk: false,
    iconName: "messageSquare",
  },
  {
    id: "vip-club",
    badge: "Elite High Roller",
    stat: "Custom Perks",
    statLabel: "Concierge & Custom Lossback",
    title: "Bearded VIP High Rollers",
    description:
      "Bespoke perks tailored to top wagerers. Custom bonus buy funding, personalized lossback, and direct streamer co-ops.",
    bullets: [
      "Direct 1-on-1 contact with the team",
      "Exclusive tournament invitations & prize pools",
    ],
    ctaText: "Inquire VIP",
    ctaHref: "https://discord.gg/WzJ6zDRQzG",
    isExternal: true,
    isTopPerk: false,
    iconName: "crown",
  },
];
