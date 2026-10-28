export interface PrizeTier {
  rank: number;
  amount: number;
  percentage: string;
  label: string;
  badgeColor: string;
  glowColor: string;
}

export const PRIZE_POOL_TOTAL = 250;

// Gamba Exclusive Race #25082 Prize Distribution ($250 Total)
export const PRIZE_SPLIT: PrizeTier[] = [
  {
    rank: 1,
    amount: 125,
    percentage: "50%",
    label: "1st Place Champion",
    badgeColor: "bg-[#00E700]/15 text-[#00E700] border-[#00E700]/40 shadow-glow-lime",
    glowColor: "rgba(0, 231, 0, 0.45)",
  },
  {
    rank: 2,
    amount: 60,
    percentage: "24%",
    label: "2nd Place Runner-Up",
    badgeColor: "bg-[#C9D1D9]/15 text-[#C9D1D9] border-[#C9D1D9]/40",
    glowColor: "rgba(201, 209, 217, 0.3)",
  },
  {
    rank: 3,
    amount: 35,
    percentage: "14%",
    label: "3rd Place Podium",
    badgeColor: "bg-[#CD7F32]/15 text-[#CD7F32] border-[#CD7F32]/40",
    glowColor: "rgba(205, 127, 50, 0.3)",
  },
  {
    rank: 4,
    amount: 20,
    percentage: "8%",
    label: "4th Place Qualifier",
    badgeColor: "bg-brand-neon/10 text-brand-neon border-brand-neon/30",
    glowColor: "rgba(0, 231, 0, 0.2)",
  },
  {
    rank: 5,
    amount: 10,
    percentage: "4%",
    label: "5th Place Qualifier",
    badgeColor: "bg-brand-neon/10 text-brand-neon border-brand-neon/30",
    glowColor: "rgba(0, 231, 0, 0.2)",
  },
];

export function getPrizeForRank(rank: number): number {
  const match = PRIZE_SPLIT.find((tier) => tier.rank === rank);
  return match ? match.amount : 0;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatWager(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}
