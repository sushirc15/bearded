"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Trophy,
  Flame,
  ArrowRight,
  Sparkles,
  Gift,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Crown,
} from "lucide-react";
import { LiveStatusWidget } from "./live-status-widget";
import { HowItWorks } from "./how-it-works";
import { RulesSection } from "./rules-section";
import { AnimatedCounter } from "@/components/ui/counter";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { CodeChip } from "@/components/ui/code-chip";
import { PerkCard } from "@/components/perks/perk-card";
import { PERKS_DATA } from "@/config/perks";
import { PRIZE_POOL_TOTAL, formatCurrency, formatWager } from "@/config/prizes";
import { siteConfig } from "@/config/site";
import { sectionRevealVariants, childRevealVariants } from "@/lib/motion";
import { LeaderboardEntry } from "@/app/api/leaderboard/route";
import { LeaderboardPodium } from "@/components/leaderboard/podium";

const DEFAULT_TOP3: LeaderboardEntry[] = [
  { rank: 1, username: "Be***r", wagered: 184520, prize: 125, rankDelta: 0 },
  { rank: 2, username: "Kr***9", wagered: 142800, prize: 60, rankDelta: 1 },
  { rank: 3, username: "Ze***x", wagered: 119450, prize: 35, rankDelta: -1 },
];

export function HomeView() {
  const [leaderboardPreview, setLeaderboardPreview] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    async function loadPreview() {
      try {
        const res = await fetch("/api/leaderboard?period=current");
        if (res.ok) {
          const json = await res.json();
          setLeaderboardPreview(json.entries.slice(0, 3));
        }
      } catch (err) {
        // Fallback
      }
    }
    loadPreview();
  }, []);

  // Top 3 featured perks for preview
  const previewPerks = PERKS_DATA.slice(0, 3);

  return (
    <motion.div
      variants={sectionRevealVariants}
      initial="hidden"
      animate="visible"
      className="space-y-24 sm:space-y-32"
    >
      {/* 1. HERO SECTION */}
      <motion.section
        variants={childRevealVariants}
        className="relative pt-6 sm:pt-14 pb-12 text-center max-w-4xl mx-auto flex flex-col items-center"
      >
        {/* Glow backdrop behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-3xl h-96 bg-radial-gradient from-brand-neon/25 via-brand-neon/10 to-transparent blur-3xl pointer-events-none -z-10" />

        {/* 2. LIVE STATUS WIDGET (Hero Eyebrow) */}
        <div className="mb-8">
          <LiveStatusWidget />
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-text-primary leading-[1.08] mb-6">
          Streamer Rewards for the{" "}
          <span className="text-transparent bg-clip-text bg-gradient-brand drop-shadow-[0_0_35px_rgba(0,231,0,0.5)]">
            Bearded Community
          </span>
        </h1>

        {/* Subtext */}
        <p className="text-base sm:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed mb-8">
          Unlock exclusive $250 monthly wager races on Gamba, instant rakeback, and daily Kick stream bonus
          drops with code <strong className="text-brand-neon font-mono">{siteConfig.code}</strong>.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <Link href="/leaderboard">
            <MagneticButton variant="primary" size="lg">
              <Trophy className="w-5 h-5 text-white" />
              <span>Join the Leaderboard</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </MagneticButton>
          </Link>

          <a href={siteConfig.kickUrl} target="_blank" rel="noopener noreferrer">
            <MagneticButton variant="secondary" size="lg">
              <Flame className="w-5 h-5 text-brand-ember" />
              <span>Watch on Kick</span>
              <ExternalLink className="w-4 h-4 text-text-muted" />
            </MagneticButton>
          </a>
        </div>

        {/* Code Chip in Hero */}
        <div className="flex flex-col items-center">
          <p className="text-xs uppercase tracking-wider text-text-muted font-bold mb-2">
            Referral Code for Instant VIP Perks
          </p>
          <CodeChip showPulsingGlow={true} />
        </div>
      </motion.section>

      {/* 3. PRIZE POOL TEASER SECTION */}
      <motion.section
        variants={childRevealVariants}
        className="rounded-3xl p-8 sm:p-12 bg-surface-card/50 backdrop-blur-2xl border border-brand-neon/25 shadow-card relative overflow-hidden"
      >
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/[0.08]">
            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-ember/15 text-brand-amber text-xs font-heading font-black uppercase tracking-wider mb-2">
                <Trophy className="w-3.5 h-3.5" />
                <span>Monthly Race Highlight</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-heading font-black text-text-primary tracking-tight">
                Current Prize Pool
              </h2>
            </div>

            <div className="text-center md:text-right">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black text-transparent bg-clip-text bg-gradient-brand">
                <AnimatedCounter to={PRIZE_POOL_TOTAL} prefix="$" />
              </div>
              <span className="text-xs text-text-muted uppercase tracking-wider font-semibold">
                Guaranteed Monthly Cash
              </span>
            </div>
          </div>

          {/* Top-3 Stepped Cyber Podium */}
          <div className="py-6">
            <div className="text-center mb-6">
              <span className="text-[11px] uppercase tracking-widest text-brand-neon font-mono font-bold px-3 py-1 rounded-full bg-brand-neon/10 border border-brand-neon/30 inline-flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5 text-brand-neon" />
                <span>Live Podium Standings</span>
              </span>
              <p className="text-xs text-text-muted mt-2">
                Top 3 positions qualify for the lion&apos;s share ($220 of $250) of the Gamba cash race.
              </p>
            </div>

            <LeaderboardPodium
              entries={leaderboardPreview.length >= 3 ? leaderboardPreview : DEFAULT_TOP3}
            />
          </div>

          {/* CTA Footer */}
          <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-text-muted">
              Race ends on the 1st of each month. Automatic leaderboard tracking.
            </span>
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-1.5 text-xs font-heading font-bold text-brand-amber hover:text-white transition-colors"
            >
              <span>Explore Full Leaderboard</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* 4. PERKS PREVIEW SECTION */}
      <motion.section variants={childRevealVariants}>
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 gap-2">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-ember/15 text-brand-amber text-xs font-heading font-black uppercase tracking-wider mb-2">
              <Gift className="w-3.5 h-3.5" />
              <span>Community Benefits</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-text-primary tracking-tight">
              Why Play With The Bearded Gamer?
            </h2>
          </div>

          <Link
            href="/rewards"
            className="inline-flex items-center gap-1 text-xs font-heading font-bold text-brand-amber hover:text-white transition-colors"
          >
            <span>View all 7 perks</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {previewPerks.map((perk) => (
            <PerkCard key={perk.id} perk={perk} />
          ))}
        </div>
      </motion.section>

      {/* 5. HOW IT WORKS SECTION (Scroll-linked progress line) */}
      <motion.div variants={childRevealVariants}>
        <HowItWorks />
      </motion.div>

      {/* 6. COMMUNITY & STREAM RULES SECTION */}
      <motion.div variants={childRevealVariants}>
        <RulesSection />
      </motion.div>

      {/* 7. FINAL CTA BANNER */}
      <motion.section
        variants={childRevealVariants}
        className="rounded-3xl p-8 sm:p-14 bg-gradient-to-br from-[#122416]/80 via-surface-card/70 to-surface-card/70 backdrop-blur-2xl border-2 border-brand-neon shadow-glow-lg relative overflow-hidden text-center"
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-neon/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-brand-lime/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-ember/20 text-brand-amber text-xs font-heading font-black uppercase tracking-wider border border-brand-amber/30">
            <Sparkles className="w-4 h-4 text-brand-amber" />
            <span>Ready To Join The Crew?</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-heading font-black text-text-primary tracking-tight leading-tight">
            Claim Your Rakeback &amp; Climb The Board Today
          </h2>

          <p className="text-sm sm:text-base text-text-muted leading-relaxed">
            Create an account in under 60 seconds. Sign up with promo code{" "}
            <span className="text-brand-amber font-mono font-bold">{siteConfig.code}</span> to activate
            all community perks automatically.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a href={siteConfig.affiliateUrl} target="_blank" rel="noopener noreferrer">
              <MagneticButton variant="primary" size="lg">
                <span>Sign Up &amp; Claim Perks</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </a>
            <CodeChip showPulsingGlow={true} />
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
