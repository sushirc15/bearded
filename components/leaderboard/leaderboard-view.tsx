"use client";

import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw, AlertCircle, Trophy, ShieldCheck, Flame, ArrowUpRight } from "lucide-react";
import { LeaderboardApiResponse } from "@/app/api/leaderboard/route";
import { LeaderboardPodium } from "./podium";
import { LeaderboardTable } from "./table";
import { PeriodTabs } from "./period-tabs";
import { Countdown } from "@/components/ui/countdown";
import { AnimatedCounter } from "@/components/ui/counter";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { CodeChip } from "@/components/ui/code-chip";
import { PRIZE_SPLIT, PRIZE_POOL_TOTAL, formatCurrency } from "@/config/prizes";
import { siteConfig } from "@/config/site";
import { sectionRevealVariants, childRevealVariants } from "@/lib/motion";

export function LeaderboardView() {
  const [period, setPeriod] = useState<"current" | "previous">("current");
  const [data, setData] = useState<LeaderboardApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [secondsAgo, setSecondsAgo] = useState(0);

  const fetchLeaderboard = useCallback(async (p: "current" | "previous", isBackground = false) => {
    if (!isBackground) setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/leaderboard?period=${p}`);
      if (!res.ok) throw new Error("Could not load leaderboard data");
      const json: LeaderboardApiResponse = await res.json();
      setData(json);
      setSecondsAgo(0);
    } catch (err: any) {
      setError(err?.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(period);
  }, [period, fetchLeaderboard]);

  // Auto-refresh every 60s
  useEffect(() => {
    const refreshInterval = setInterval(() => {
      fetchLeaderboard(period, true);
    }, 60000);

    const secondsInterval = setInterval(() => {
      setSecondsAgo((s) => s + 1);
    }, 1000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(secondsInterval);
    };
  }, [period, fetchLeaderboard]);

  return (
    <motion.div
      variants={sectionRevealVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 sm:space-y-16"
    >
      {/* Hero Strip */}
      <motion.div
        variants={childRevealVariants}
        className="relative rounded-3xl p-8 sm:p-12 bg-surface-card/50 backdrop-blur-2xl border-2 border-brand-neon/30 shadow-card overflow-hidden text-center"
      >
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-64 bg-radial-gradient from-brand-neon/25 via-brand-neon/10 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
          {/* Header Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-neon/15 border border-brand-neon/30 text-brand-neon text-xs font-heading font-black uppercase tracking-wider mb-6">
            <Trophy className="w-4 h-4 text-brand-neon" />
            <span>Gamba Exclusive Wager Race #25082</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-heading font-black tracking-tight text-text-primary mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-brand">
              <AnimatedCounter to={PRIZE_POOL_TOTAL} prefix="$" />
            </span>{" "}
            Prize Pool
          </h1>

          <p className="text-base sm:text-lg text-text-muted max-w-xl mb-8 leading-relaxed">
            Every wager counts toward the top of the board. Compete all month long on Gamba under code{" "}
            <span className="text-brand-neon font-mono font-bold">{siteConfig.code}</span> to take home guaranteed cash prizes.
          </p>

          {/* Reset Countdown */}
          <div className="flex flex-col items-center mb-8">
            <p className="text-xs uppercase tracking-wider text-text-muted font-bold mb-3">
              Race Resets In
            </p>
            <Countdown targetDateIso={data?.nextResetIso} />
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <MagneticButton
              variant="primary"
              size="lg"
              onClick={() => window.open(siteConfig.affiliateUrl, "_blank")}
            >
              <span>Join Race on Gamba</span>
              <ArrowUpRight className="w-4 h-4 text-black" />
            </MagneticButton>
            <CodeChip showPulsingGlow={true} />
            <a
              href={siteConfig.gambaLeaderboardUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl bg-surface-elevated hover:bg-surface-hover border border-white/10 text-xs font-heading font-bold text-brand-lime flex items-center gap-1.5 transition-colors"
            >
              <span>View on Gamba.com</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Prize Split Strip */}
        <div className="mt-12 pt-8 border-t border-white/[0.08] grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-4xl mx-auto">
          {PRIZE_SPLIT.map((tier) => (
            <div
              key={tier.rank}
              className="p-3.5 rounded-xl bg-surface-elevated/70 border border-white/[0.08] flex flex-col items-center justify-center text-center group hover:border-brand-neon/40 transition-colors"
            >
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-heading font-bold text-text-muted uppercase">
                  #{tier.rank} Place
                </span>
                <span className="text-[10px] font-mono text-brand-lime font-bold">
                  ({tier.percentage})
                </span>
              </div>
              <span className="text-xl font-heading font-black text-white mt-1 group-hover:text-brand-neon transition-colors">
                {formatCurrency(tier.amount)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Period Tabs & Auto-refresh status */}
      <motion.div
        variants={childRevealVariants}
        className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/[0.06] pb-6"
      >
        <PeriodTabs period={period} onChange={(p) => setPeriod(p)} />

        <div className="flex items-center gap-3 text-xs text-text-muted">
          <button
            onClick={() => fetchLeaderboard(period)}
            className="flex items-center gap-1.5 hover:text-text-primary transition-colors focus:outline-none"
            title="Force refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-brand-neon ${loading ? "animate-spin" : ""}`} />
            <span>Updated {secondsAgo}s ago</span>
          </button>
          <span className="w-1 h-1 rounded-full bg-brand-lime" />
          <span className="text-text-faint">Auto-sync 60s</span>
        </div>
      </motion.div>

      {/* Error State */}
      {error && (
        <div className="p-6 rounded-2xl bg-brand-crimson/10 border border-brand-crimson/30 text-center max-w-md mx-auto">
          <AlertCircle className="w-8 h-8 text-brand-crimson mx-auto mb-2" />
          <p className="text-sm font-semibold text-text-primary">{error}</p>
          <button
            onClick={() => fetchLeaderboard(period)}
            className="mt-4 px-4 py-2 rounded-xl bg-surface-elevated text-xs font-bold text-text-primary hover:bg-surface-hover"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !data && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-80 rounded-2xl bg-surface-card border border-white/5 animate-pulse"
              />
            ))}
          </div>
          <div className="h-64 rounded-2xl bg-surface-card border border-white/5 animate-pulse" />
        </div>
      )}

      {/* Main Content */}
      {data && !loading && (
        <>
          {/* Podium (Top 3) */}
          <motion.section variants={childRevealVariants}>
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-heading font-black text-text-primary">
                Current Podium Leaders
              </h2>
              <p className="text-xs text-text-muted mt-1">
                Top 3 positions qualify for the highest cash payouts.
              </p>
            </div>
            <LeaderboardPodium entries={data.entries} />
          </motion.section>

          {/* Table (Ranks 4-10+) */}
          <motion.section variants={childRevealVariants}>
            <div className="text-center mb-6">
              <h2 className="text-lg sm:text-xl font-heading font-bold text-text-primary">
                Ranks 4 – 10
              </h2>
              <p className="text-xs text-text-muted mt-1">
                4th and 5th places share in the guaranteed cash prize pool.
              </p>
            </div>
            <LeaderboardTable entries={data.entries} />
          </motion.section>
        </>
      )}

      {/* Fair Play & Affiliate Rules note */}
      <motion.div
        variants={childRevealVariants}
        className="p-6 sm:p-7 rounded-3xl bg-surface-card border-2 border-brand-neon/30 text-xs text-text-muted flex items-start gap-4 shadow-glow"
      >
        <ShieldCheck className="w-6 h-6 text-brand-neon shrink-0 mt-0.5" />
        <div className="space-y-1.5">
          <p className="font-heading font-bold text-sm text-white flex items-center gap-2">
            <span>How does Gamba distribute the $250 prize pool?</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-neon/20 text-brand-neon border border-brand-neon/40">
              INSTANT AUTO-CREDIT
            </span>
          </p>
          <p className="text-text-muted leading-relaxed">
            All rankings are tracked automatically by Gamba.com via exclusive race <strong>#25082</strong> for
            players registered with code <strong className="text-brand-neon font-mono">BeardedGamer</strong>.
            The second the countdown timer expires, cash prizes (1st $125, 2nd $60, 3rd $35, 4th $20, 5th $10)
            are deposited directly into winners’ Gamba account balances with zero wagering requirements.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
