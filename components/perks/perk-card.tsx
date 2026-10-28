"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Gift,
  Percent,
  Zap,
  Video,
  Coins,
  MessageSquare,
  Crown,
  Check,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { PerkItem } from "@/config/perks";
import { cn } from "@/lib/utils";

interface PerkCardProps {
  perk: PerkItem;
}

const iconMap = {
  gift: Gift,
  percent: Percent,
  zap: Zap,
  video: Video,
  coins: Coins,
  messageSquare: MessageSquare,
  crown: Crown,
};

export function PerkCard({ perk }: PerkCardProps) {
  const Icon = iconMap[perk.iconName] || Gift;

  return (
    <motion.div
      whileHover={{ y: -6, transition: { duration: 0.25 } }}
      className={cn(
        "relative rounded-2xl p-7 flex flex-col justify-between group transition-all duration-300 backdrop-blur-2xl select-none",
        perk.isTopPerk
          ? "bg-[#111c13]/70 border-2 border-brand-neon shadow-glow-lg"
          : "bg-surface-card/60 border border-brand-neon/20 shadow-card hover:border-brand-neon/60 hover:shadow-card-hover"
      )}
    >
      {/* Animated gradient border for Top Perk */}
      {perk.isTopPerk && (
        <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-brand text-background-dark font-heading font-black text-[11px] tracking-wider uppercase shadow-glow flex items-center gap-1.5 border border-white">
          <Sparkles className="w-3.5 h-3.5 fill-background-dark" />
          <span>Top Community Perk</span>
        </div>
      )}

      {/* Shine Sweep Overlay */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
        <div className="absolute -inset-[100%] top-0 block w-[200%] h-full bg-shimmer-gradient -skew-x-12 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer-slide transition-opacity duration-300" />
      </div>

      <div>
        {/* Top Header: Badge & Icon */}
        <div className="flex items-center justify-between mb-5">
          <span className="px-3 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider bg-white/[0.05] border border-white/10 text-brand-neon">
            {perk.badge}
          </span>
          <div
            className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center border transition-colors",
              perk.isTopPerk
                ? "bg-brand-neon/20 border-brand-neon/40 text-brand-neon shadow-glow"
                : "bg-surface-elevated border-white/10 text-brand-neon group-hover:border-brand-neon/40"
            )}
          >
            <Icon className="w-5 h-5" />
          </div>
        </div>

        {/* Big Stat */}
        <div className="mb-4">
          <div className="text-3xl sm:text-4xl font-heading font-black tracking-tight text-text-primary">
            {perk.stat}
          </div>
          <p className="text-xs font-medium text-brand-lime mt-0.5">{perk.statLabel}</p>
        </div>

        {/* Title & Description */}
        <h3 className="font-heading font-black text-xl text-text-primary mb-2 group-hover:text-brand-neon transition-colors">
          {perk.title}
        </h3>
        <p className="text-xs sm:text-sm text-text-muted leading-relaxed mb-6">
          {perk.description}
        </p>

        {/* Bullet Steps */}
        <div className="space-y-2.5 mb-8 pt-4 border-t border-white/[0.06]">
          {perk.bullets.map((bullet, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-text-muted">
              <div className="w-4 h-4 rounded-full bg-brand-neon/15 border border-brand-neon/30 flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 text-brand-neon" />
              </div>
              <span className="leading-snug">{bullet}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card CTA */}
      <div className="pt-2">
        {perk.isExternal ? (
          <a
            href={perk.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "w-full py-2.5 px-4 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 border",
              perk.isTopPerk
                ? "bg-gradient-brand text-black font-black border-brand-neon hover:shadow-glow"
                : "bg-surface-elevated hover:bg-surface-hover text-text-primary border-white/10 hover:border-brand-neon/40"
            )}
          >
            <span>{perk.ctaText}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        ) : (
          <Link
            href={perk.ctaHref}
            className={cn(
              "w-full py-2.5 px-4 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all duration-200 border",
              perk.isTopPerk
                ? "bg-gradient-brand text-black font-black border-brand-neon hover:shadow-glow"
                : "bg-surface-elevated hover:bg-surface-hover text-text-primary border-white/10 hover:border-brand-neon/40"
            )}
          >
            <span>{perk.ctaText}</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>
    </motion.div>
  );
}
