"use client";

import React from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Sparkles, Gift, Flame, MessageSquare, Clock, CheckCircle2, Trophy, ExternalLink } from "lucide-react";
import { siteConfig } from "@/config/site";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { CodeChip } from "@/components/ui/code-chip";
import { sectionRevealVariants, childRevealVariants } from "@/lib/motion";

// Dynamically import SpinWheel for Lighthouse & initial bundle performance
const SpinWheel = dynamic(
  () => import("./spin-wheel").then((mod) => mod.SpinWheel),
  {
    ssr: false,
    loading: () => (
      <div className="w-72 h-72 sm:w-96 sm:h-96 rounded-full bg-surface-card border border-white/10 animate-pulse mx-auto" />
    ),
  }
);

interface ActiveGiveaway {
  id: string;
  title: string;
  prize: string;
  keyword: string;
  endsIn: string;
  participants: number;
  type: "Stream Chat" | "Discord Drop" | "Bonus Buy";
}

const ACTIVE_GIVEAWAYS: ActiveGiveaway[] = [
  {
    id: "giveaway-1",
    title: "Friday Stream Bonus Buy Drop",
    prize: "$100 USDC",
    keyword: "!BEARDDROP",
    endsIn: "Today during stream",
    participants: 168,
    type: "Stream Chat",
  },
  {
    id: "giveaway-2",
    title: "Weekly Discord Active Chat Rain",
    prize: "$50 Reload Balance",
    keyword: "React with 🧔 in #giveaways",
    endsIn: "In 2 days",
    participants: 94,
    type: "Discord Drop",
  },
  {
    id: "giveaway-3",
    title: "Pragmatic Multiplier Hit Bounty",
    prize: "$100 Instant Cash",
    keyword: "Submit replay ID in Discord",
    endsIn: "In 5 days",
    participants: 42,
    type: "Bonus Buy",
  },
];

const RECENT_WINNERS = [
  { username: "Lu***7", prize: "$100 Bonus Buy", date: "Yesterday", event: "Friday Stream Wheel" },
  { username: "St***m", prize: "$50 Discord Rain", date: "2 days ago", event: "VIP Discord Drop" },
  { username: "Be***r", prize: "50 Free Spins", date: "3 days ago", event: "Kick Chat Raffle" },
  { username: "Vo***x", prize: "$75 Cash Drop", date: "4 days ago", event: "Big Win Bounty" },
];

export function GiveawaysView() {
  return (
    <motion.div
      variants={sectionRevealVariants}
      initial="hidden"
      animate="visible"
      className="space-y-16 sm:space-y-24"
    >
      {/* Header */}
      <motion.div variants={childRevealVariants} className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-ember/15 border border-brand-ember/30 text-brand-amber text-xs font-heading font-black uppercase tracking-wider mb-4">
          <Sparkles className="w-4 h-4 text-brand-amber" />
          <span>Stream Giveaways &amp; Wheel Spins</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-text-primary mb-4">
          Community Giveaways &amp; Wheel
        </h1>

        <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6">
          Every stream features spontaneous bonus buy raffles and wheel spins. Enter directly via Kick
          chat keywords or through our VIP Discord.
        </p>

        <div className="flex justify-center">
          <CodeChip showPulsingGlow={true} />
        </div>
      </motion.div>

      {/* 1. Live Interactive Wheel Spin Section */}
      <motion.section
        variants={childRevealVariants}
        className="rounded-3xl p-8 sm:p-12 bg-surface-card/60 backdrop-blur-2xl border-2 border-brand-neon/50 shadow-glow relative overflow-hidden text-center"
      >
        <div className="max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-brand-lime mb-2">
            <Trophy className="w-4 h-4 text-brand-lime" />
            <span>Interactive Stream Simulator</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-heading font-black text-text-primary tracking-tight">
            The Bearded Wheel of Fortune
          </h2>
          <p className="text-xs sm:text-sm text-text-muted mt-2">
            When The Bearded Gamer hits a 500x+ bonus win on stream, this wheel is spun live for chat
            viewers registered under code <strong>{siteConfig.code}</strong>.
          </p>
        </div>

        <SpinWheel />
      </motion.section>

      {/* 2. Active Giveaways Section */}
      <motion.section variants={childRevealVariants}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-ember/15 text-brand-amber text-xs font-heading font-black uppercase tracking-wider mb-2 border border-brand-ember/30">
              <Gift className="w-3.5 h-3.5" />
              <span>Current Drops</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-text-primary tracking-tight">
              Active Community Raffles
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ACTIVE_GIVEAWAYS.map((g) => (
            <div
              key={g.id}
              className="p-7 rounded-3xl bg-surface-card/60 backdrop-blur-2xl border border-brand-neon/20 shadow-card flex flex-col justify-between group hover:border-brand-neon/60 hover:shadow-card-hover transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase bg-brand-amber/15 text-brand-amber border border-brand-amber/30">
                    {g.type}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-text-muted">
                    <Clock className="w-3 h-3 text-brand-ember" />
                    {g.endsIn}
                  </span>
                </div>

                <h3 className="font-heading font-black text-lg text-text-primary mb-2">
                  {g.title}
                </h3>

                <div className="p-3.5 rounded-2xl bg-surface-elevated border border-white/5 mb-5 text-center">
                  <span className="text-[10px] uppercase font-bold text-text-muted block">
                    Prize Pool
                  </span>
                  <span className="text-2xl font-heading font-black text-brand-lime">
                    {g.prize}
                  </span>
                </div>

                {/* Entry Instructions */}
                <div className="space-y-2 mb-6 text-xs text-text-muted">
                  <p className="font-semibold text-text-primary">How to enter:</p>
                  <div className="p-2.5 rounded-xl bg-black/40 border border-brand-ember/30 font-mono text-brand-amber text-center select-all">
                    {g.keyword}
                  </div>
                  <p className="text-[11px] text-text-faint">
                    Must be registered with code <strong>{siteConfig.code}</strong>.
                  </p>
                </div>
              </div>

              <a
                href={siteConfig.kickUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <MagneticButton variant="secondary" size="md" className="w-full">
                  <Flame className="w-4 h-4 text-brand-ember" />
                  <span>Enter on Stream</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </MagneticButton>
              </a>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 3. Recent Winners History List */}
      <motion.section variants={childRevealVariants}>
        <div className="rounded-3xl p-8 bg-surface-card border border-white/10 shadow-card">
          <div className="flex items-center justify-between pb-6 border-b border-white/[0.08] mb-6">
            <div>
              <h3 className="font-heading font-black text-xl text-text-primary">
                Recent Giveaway Winners
              </h3>
              <p className="text-xs text-text-muted mt-1">
                Verified community winners and payout history.
              </p>
            </div>
            <Trophy className="w-6 h-6 text-brand-amber" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {RECENT_WINNERS.map((winner, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-surface-elevated/70 border border-white/5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-heading font-bold text-sm text-text-primary">
                      {winner.username}
                    </span>
                    <span className="text-[10px] text-text-faint">{winner.date}</span>
                  </div>
                  <p className="text-xs text-text-muted truncate">{winner.event}</p>
                </div>

                <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs text-text-muted">Won:</span>
                  <span className="font-heading font-black text-sm text-brand-lime">
                    {winner.prize}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
