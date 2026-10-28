"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trophy, Gift, Sparkles, MessageCircle, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { PERKS_DATA } from "@/config/perks";
import { PerkCard } from "./perk-card";
import { CodeChip } from "@/components/ui/code-chip";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { siteConfig } from "@/config/site";
import { sectionRevealVariants, childRevealVariants } from "@/lib/motion";

export function RewardsView() {
  return (
    <motion.div
      variants={sectionRevealVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 sm:space-y-16"
    >
      {/* Header with Floating Gift Icons */}
      <motion.div variants={childRevealVariants} className="text-center max-w-3xl mx-auto relative">
        {/* Decorative Floating Gift Icons */}
        <div className="absolute -top-6 left-4 sm:left-12 opacity-60 animate-bounce text-2xl pointer-events-none">
          🎁
        </div>
        <div className="absolute top-2 right-4 sm:right-12 opacity-60 animate-bounce delay-300 text-2xl pointer-events-none">
          ✨
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-neon/15 border border-brand-neon/30 text-brand-neon text-xs font-heading font-black uppercase tracking-wider mb-4">
          <Gift className="w-4 h-4 text-brand-neon" />
          <span>Community Rewards Hub</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-text-primary mb-4">
          Rewards &amp; VIP Perks
        </h1>

        <p className="text-base sm:text-lg text-text-muted leading-relaxed">
          Unlock maximum player return with the highest rakeback tiers, automated weekly reloads,
          stream giveaways, and our monthly $250 wager tournament.
        </p>
      </motion.div>

      {/* Headline Prize Card + Signup Card (2-column banner) */}
      <motion.div variants={childRevealVariants} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Headline Prize Card */}
        <div className="lg:col-span-7 rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-[#122416]/85 via-surface-card/60 to-surface-card/60 backdrop-blur-2xl border-2 border-brand-neon/60 shadow-glow relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-8 -top-8 w-44 h-44 bg-brand-neon/15 rounded-full blur-3xl pointer-events-none" />

          <div>
            <div className="flex items-center gap-2 text-xs font-heading font-black uppercase tracking-wider text-brand-lime mb-3">
              <Trophy className="w-4 h-4 text-brand-neon" />
              <span>Flagship Community Event • Gamba</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-heading font-black text-text-primary tracking-tight mb-3">
              $250 Monthly Leaderboard
            </h2>
            <p className="text-sm text-text-muted leading-relaxed max-w-lg mb-6">
              Compete against fellow community members all month long on Gamba. Top 5 wagerers are guaranteed
              direct cash prizes, with $125 (50%) going straight to 1st place.
            </p>

            <div className="flex flex-wrap items-center gap-3 mb-8">
              <span className="px-3 py-1 rounded-lg bg-surface-elevated/80 text-xs font-mono font-bold text-brand-neon border border-brand-neon/30 shadow-sm">
                1st: $125 Cash (50%)
              </span>
              <span className="px-3 py-1 rounded-lg bg-surface-elevated/80 text-xs font-mono font-bold text-rank-silver border border-white/10">
                2nd: $60 (24%)
              </span>
              <span className="px-3 py-1 rounded-lg bg-surface-elevated/80 text-xs font-mono font-bold text-rank-bronze border border-white/10">
                3rd: $35 (14%)
              </span>
              <span className="px-3 py-1 rounded-lg bg-surface-elevated/80 text-xs font-mono font-bold text-text-muted border border-white/10">
                4th: $20 (8%)
              </span>
              <span className="px-3 py-1 rounded-lg bg-surface-elevated/80 text-xs font-mono font-bold text-text-muted border border-white/10">
                5th: $10 (4%)
              </span>
            </div>
          </div>

          <div>
            <Link href="/leaderboard">
              <MagneticButton variant="primary" size="md">
                <span>View Live Leaderboard</span>
                <ArrowRight className="w-4 h-4 text-black" />
              </MagneticButton>
            </Link>
          </div>
        </div>

        {/* Ready to start Signup Card */}
        <div
          id="signup"
          className="lg:col-span-5 rounded-3xl p-8 sm:p-10 bg-surface-card/60 backdrop-blur-2xl border border-brand-neon/25 shadow-card flex flex-col justify-between relative overflow-hidden"
        >
          <div>
            <div className="flex items-center gap-2 text-xs font-heading font-bold uppercase tracking-wider text-brand-lime mb-3">
              <Sparkles className="w-4 h-4 text-brand-lime" />
              <span>Instant Activation</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-heading font-black text-text-primary mb-3">
              Ready to start?
            </h3>
            <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-6">
              Create an account using the streamer referral code to link your profile to all rewards,
              rakeback, and leaderboard tracking.
            </p>

            {/* Copy-to-clipboard Code Chip */}
            <div className="mb-6">
              <p className="text-xs text-text-muted uppercase font-bold tracking-wider mb-2">
                Step 1: Copy Streamer Code
              </p>
              <CodeChip className="w-full justify-between" showPulsingGlow={true} />
            </div>

            <div className="space-y-2 mb-6 text-xs text-text-muted">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-lime shrink-0" />
                <span>Automatic wager race tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-lime shrink-0" />
                <span>Immediate highest rakeback rate</span>
              </div>
            </div>
          </div>

          <div>
            <a
              href={siteConfig.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-block"
            >
              <MagneticButton variant="primary" size="md" className="w-full">
                <span>Sign Up &amp; Claim Perks</span>
                <ArrowRight className="w-4 h-4" />
              </MagneticButton>
            </a>
          </div>
        </div>
      </motion.div>

      {/* Perks Grid (3 columns desktop, 1 column mobile) */}
      <motion.section variants={childRevealVariants}>
        <div className="flex flex-col sm:flex-row items-baseline justify-between mb-8 gap-2">
          <div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-text-primary">
              All Available Perks &amp; Benefits
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-1">
              Data-driven benefits active for all players registered under code{" "}
              <strong className="text-brand-neon">{siteConfig.code}</strong>.
            </p>
          </div>
          <span className="text-xs font-mono text-text-muted bg-white/5 px-3 py-1 rounded-lg border border-white/10">
            {PERKS_DATA.length} Exclusive Perks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PERKS_DATA.map((perk) => (
            <PerkCard key={perk.id} perk={perk} />
          ))}
        </div>
      </motion.section>

      {/* Support Banner: Need help creating your account? */}
      <motion.div
        variants={childRevealVariants}
        className="rounded-3xl p-8 sm:p-10 bg-surface-card/60 backdrop-blur-2xl border-2 border-brand-neon/30 shadow-card flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-brand-neon/20 border border-brand-neon/40 flex items-center justify-center shrink-0">
            <MessageCircle className="w-6 h-6 text-brand-neon" />
          </div>
          <div>
            <h3 className="text-xl font-heading font-black text-text-primary">
              Need help creating or verifying your account?
            </h3>
            <p className="text-xs sm:text-sm text-text-muted mt-1 leading-relaxed max-w-xl">
              Our community moderators and streamer staff are available around the clock in the VIP
              Discord to help you register, link your code, and verify your leaderboard status.
            </p>
          </div>
        </div>

        <a
          href={siteConfig.discordUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <MagneticButton variant="secondary" size="md">
            <span>Join Discord Support</span>
            <ArrowRight className="w-4 h-4 text-brand-neon" />
          </MagneticButton>
        </a>
      </motion.div>

      {/* Fine Print Line */}
      <motion.div
        variants={childRevealVariants}
        className="text-center pt-4 border-t border-white/[0.06] text-xs text-text-faint space-y-1.5"
      >
        <p>
          * Perks and rakeback apply exclusively to accounts registered using promo code{" "}
          <strong className="text-brand-neon font-mono">{siteConfig.code}</strong>.
        </p>
        <p>
          The $250 leaderboard resets on the 1st of each calendar month at 00:00 UTC. Payouts are
          distributed in crypto or site balance within 24 hours. 18+ Gamble responsibly.
        </p>
      </motion.div>
    </motion.div>
  );
}
