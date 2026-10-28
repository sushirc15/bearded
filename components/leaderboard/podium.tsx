"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Crown, Sparkles, TrendingUp, TrendingDown, Minus, Zap } from "lucide-react";
import { LeaderboardEntry } from "@/app/api/leaderboard/route";
import { GamerAvatar } from "@/components/ui/gamer-avatar";
import { formatCurrency, formatWager } from "@/config/prizes";
import { cn } from "@/lib/utils";

interface PodiumProps {
  entries: LeaderboardEntry[];
}

const CLIP_CYBER_OUTER = "polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px)";
const CLIP_CYBER_INNER = "polygon(17px 0, 100% 0, 100% calc(100% - 17px), calc(100% - 17px) 100%, 0 100%, 0 17px)";

function PodiumStep({
  entry,
  orderClass,
  rank,
  prizeAmount,
  percentage,
  pedestalHeight,
  borderColor,
  badgeBg,
  badgeText,
  trophyColor,
}: {
  entry?: LeaderboardEntry;
  orderClass: string;
  rank: 1 | 2 | 3;
  prizeAmount: number;
  percentage: string;
  pedestalHeight: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  trophyColor: string;
}) {
  const isFirst = rank === 1;

  if (!entry) {
    return (
      <div className={cn("w-full h-80 rounded-2xl bg-surface-card/40 border border-white/5 animate-pulse", orderClass)} />
    );
  }

  return (
    <div className={cn("flex flex-col items-center w-full max-w-sm", orderClass)}>
      {/* Top Floating Badge */}
      <div
        className={cn(
          "relative z-20 flex items-center gap-1.5 px-4 py-1 mb-[-12px] font-heading font-black text-xs uppercase tracking-wider rounded-md border shadow-lg select-none",
          badgeBg,
          badgeText
        )}
      >
        {isFirst ? (
          <Crown className="w-4 h-4 fill-current text-brand-neon" />
        ) : (
          <Trophy className={cn("w-3.5 h-3.5 fill-current", trophyColor)} />
        )}
        <span>{isFirst ? "1st Champion" : rank === 2 ? "2nd Runner-Up" : "3rd Podium"}</span>
      </div>

      {/* Cyber Chamfered Card */}
      <motion.div
        whileHover={{ y: isFirst ? -22 : -15, scale: isFirst ? 1.05 : 1.03 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        style={{
          clipPath: CLIP_CYBER_OUTER,
          padding: "2px",
          background: borderColor,
        }}
        className={cn(
          "w-full relative shadow-card group transition-all duration-300",
          isFirst
            ? "shadow-glow-lg ring-1 ring-brand-neon/60 hover:shadow-[0_0_60px_rgba(0,231,0,0.5)]"
            : rank === 2
            ? "ring-1 ring-[#C9D1D9]/40 hover:shadow-[0_0_40px_rgba(201,209,217,0.35)]"
            : "ring-1 ring-[#CD7F32]/40 hover:shadow-[0_0_40px_rgba(205,127,50,0.35)]"
        )}
      >
        <div
          style={{
            clipPath: CLIP_CYBER_INNER,
            background: isFirst
              ? "radial-gradient(ellipse at 50% 15%, rgba(0, 231, 0, 0.22) 0%, rgba(14, 24, 16, 0.85) 60%, rgba(6, 10, 7, 0.95) 100%)"
              : "radial-gradient(ellipse at 50% 15%, rgba(255, 255, 255, 0.08) 0%, rgba(16, 22, 17, 0.85) 60%, rgba(6, 10, 7, 0.95) 100%)",
          }}
          className="relative flex flex-col items-center text-center p-6 sm:p-8 backdrop-blur-2xl"
        >
          {/* Avatar with radiant glow */}
          <div className="relative mb-4 mt-2">
            <div
              className={cn(
                "absolute -inset-2 rounded-full blur-xl opacity-60 pointer-events-none",
                isFirst ? "bg-brand-neon" : rank === 2 ? "bg-[#C9D1D9]" : "bg-[#CD7F32]"
              )}
            />
            <GamerAvatar
              username={entry.username}
              rank={rank}
              size={isFirst ? "xl" : "lg"}
              className={cn(
                "transition-transform duration-300 group-hover:scale-105",
                isFirst && "border-brand-neon"
              )}
            />

            {/* Rank Delta */}
            {entry.rankDelta !== undefined && (
              <div className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-surface-card border border-white/20 flex items-center gap-0.5 shadow-md">
                {entry.rankDelta > 0 && (
                  <>
                    <TrendingUp className="w-3 h-3 text-brand-neon" />
                    <span className="text-brand-neon">+{entry.rankDelta}</span>
                  </>
                )}
                {entry.rankDelta < 0 && (
                  <>
                    <TrendingDown className="w-3 h-3 text-brand-crimson" />
                    <span className="text-brand-crimson">{entry.rankDelta}</span>
                  </>
                )}
                {entry.rankDelta === 0 && (
                  <>
                    <Minus className="w-3 h-3 text-text-faint" />
                    <span className="text-text-muted">0</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Username */}
          <h3 className={cn("font-heading font-black text-text-primary mb-1 tracking-tight truncate max-w-full", isFirst ? "text-xl sm:text-2xl text-white" : "text-lg sm:text-xl")}>
            {entry.username}
          </h3>

          <p className="text-[11px] font-heading font-bold uppercase tracking-wider text-text-muted mb-3">
            Wagered: <span className="text-text-primary font-mono">{formatWager(entry.wagered)}</span>
          </p>

          {/* Prize Badge */}
          <div className="w-full pt-3 border-t border-brand-neon/20 flex items-center justify-between">
            <div className="text-left">
              <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider block">
                Prize Share
              </span>
              <span className="text-[11px] text-brand-lime font-mono font-bold">
                {percentage} of Pool
              </span>
            </div>

            <div
              className={cn(
                "flex items-center gap-1 px-3 py-1.5 rounded-xl font-heading font-black border transition-all",
                isFirst
                  ? "bg-brand-neon text-black border-brand-neon text-base sm:text-lg shadow-glow"
                  : "bg-surface-elevated/80 border-white/10 text-brand-lime text-sm sm:text-base group-hover:border-brand-neon/40"
              )}
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>{formatCurrency(prizeAmount)}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stepped Pedestal Block */}
      <div
        className={cn(
          "w-[90%] flex flex-col items-center justify-center border-t-2 select-none transition-all",
          isFirst
            ? "bg-gradient-to-b from-brand-neon/25 to-brand-neon/5 border-brand-neon shadow-glow"
            : rank === 2
            ? "bg-gradient-to-b from-[#C9D1D9]/20 to-[#C9D1D9]/5 border-[#C9D1D9]/50"
            : "bg-gradient-to-b from-[#CD7F32]/20 to-[#CD7F32]/5 border-[#CD7F32]/50",
          pedestalHeight
        )}
        style={{
          clipPath: "polygon(12px 0, calc(100% - 12px) 0, 100% 100%, 0 100%)",
        }}
      >
        <span
          className={cn(
            "font-heading font-black text-2xl sm:text-3xl tracking-tight opacity-90",
            isFirst ? "text-brand-neon drop-shadow-[0_0_12px_#00E700]" : rank === 2 ? "text-[#C9D1D9]" : "text-[#CD7F32]"
          )}
        >
          #{rank}
        </span>
        <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted">
          {isFirst ? "CHAMPION" : rank === 2 ? "2ND PLACE" : "3RD PLACE"}
        </span>
      </div>
    </div>
  );
}

export function LeaderboardPodium({ entries }: PodiumProps) {
  const first = entries.find((e) => e.rank === 1);
  const second = entries.find((e) => e.rank === 2);
  const third = entries.find((e) => e.rank === 3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-end max-w-5xl mx-auto pt-8 pb-10">
      {/* 2nd Place (Left on Desktop, 2nd in 2-1-3 layout) */}
      <PodiumStep
        entry={second}
        orderClass="order-2 md:order-1"
        rank={2}
        prizeAmount={60}
        percentage="24%"
        pedestalHeight="h-20 sm:h-28"
        borderColor="linear-gradient(180deg, rgba(201,209,217,0.9) 0%, rgba(201,209,217,0.4) 40%, rgba(255,255,255,0.05) 100%)"
        badgeBg="bg-[#1B2228] border-[#C9D1D9]/40"
        badgeText="text-[#C9D1D9]"
        trophyColor="text-[#C9D1D9]"
      />

      {/* 1st Place (Center on Desktop, Raised & Tallest Pedestal) */}
      <PodiumStep
        entry={first}
        orderClass="order-1 md:order-2"
        rank={1}
        prizeAmount={125}
        percentage="50%"
        pedestalHeight="h-32 sm:h-44"
        borderColor="linear-gradient(180deg, rgba(0,231,0,0.95) 0%, rgba(189,247,107,0.6) 40%, rgba(0,231,0,0.1) 100%)"
        badgeBg="bg-gradient-brand text-black border-brand-neon shadow-glow"
        badgeText="text-black font-black"
        trophyColor="text-black"
      />

      {/* 3rd Place (Right on Desktop) */}
      <PodiumStep
        entry={third}
        orderClass="order-3 md:order-3"
        rank={3}
        prizeAmount={35}
        percentage="14%"
        pedestalHeight="h-14 sm:h-20"
        borderColor="linear-gradient(180deg, rgba(205,127,50,0.9) 0%, rgba(205,127,50,0.4) 40%, rgba(255,255,255,0.05) 100%)"
        badgeBg="bg-[#281D14] border-[#CD7F32]/40"
        badgeText="text-[#CD7F32]"
        trophyColor="text-[#CD7F32]"
      />
    </div>
  );
}
