export interface NavItem {
  label: string;
  href: string;
  badge?: string;
}

export const siteConfig = {
  name: "The Bearded Gamer",
  shortName: "TheBeardedGamer",
  partnerCasino: "GAMBA",
  code: process.env.NEXT_PUBLIC_SITE_CODE || process.env.SITE_CODE || "BeardedGamer",
  kickChannel: process.env.NEXT_PUBLIC_KICK_CHANNEL || "TThebeardedGamer",
  kickUrl: "https://kick.com/TThebeardedGamer",
  affiliateUrl: "https://gamba.com/?c=BeardedGamer",
  gambaLeaderboardUrl: "https://gamba.com/promotions/exclusive-leaderboards/25082",
  discordUrl: "https://discord.gg/WzJ6zDRQzG",
  twitterUrl: "https://x.com/thebeardedgamer",
  description:
    "Official rewards, high-roller VIP perks, and $250 monthly wager race for The Bearded Gamer community on Gamba.",
  navItems: [
    { label: "Home", href: "/" },
    { label: "Leaderboard", href: "/leaderboard", badge: "$250" },
    { label: "Rewards", href: "/rewards" },
    { label: "Games", href: "/games" },
    { label: "Rules", href: "/#rules" },
  ] as NavItem[],
  footerLinks: {
    pages: [
      { label: "Home", href: "/" },
      { label: "Monthly Leaderboard", href: "/leaderboard" },
      { label: "Rewards & Perks", href: "/rewards" },
      { label: "Games & Tournaments", href: "/games" },
      { label: "Chat & Discord Rules", href: "/#rules" },
    ],
    social: [
      { label: "Kick Stream", href: "https://kick.com/TThebeardedGamer" },
      { label: "Gamba Exclusive Race", href: "https://gamba.com/promotions/exclusive-leaderboards/25082" },
      { label: "Discord VIP", href: "https://discord.gg/WzJ6zDRQzG" },
      { label: "X / Twitter", href: "https://x.com/thebeardedgamer" },
    ],
  },
  disclaimer:
    "This is an independent affiliate site. Gamba operates the casino, games, and all platform rewards, subject to their terms of service.",
  responsibleGambling: {
    ageRequirement: "18+",
    therapyUrl: "https://www.gamblingtherapy.org",
    text: "18+ Only. Please gamble responsibly. Only bet what you can afford to lose.",
  },
  rules: [
    {
      num: 1,
      rule: "Do NOT beg for money/tips/fees. (LOANS are the same thing as begging)",
    },
    {
      num: 2,
      rule: "Do not use hate speech. No racism, sexism, etc.",
    },
    {
      num: 3,
      rule: "Do not post/use affiliate links in chat unless approved by a MOD",
    },
    {
      num: 4,
      rule: "Follow all of Discord’s TOS",
    },
    {
      num: 5,
      rule: "Do not be disrespectful to anybody.",
    },
    {
      num: 6,
      rule: "Don’t be toxic, unless it is in good fun.",
    },
  ],
  rulesNotice: "Not following the rules will result in ban/mute. THANK YOU!!",
};
