"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trophy, Users, Clock, Flame, ArrowUpRight } from "lucide-react";
import { TournamentItem } from "@/lib/games/provider";
import { siteConfig } from "@/config/site";

interface TournamentsGridProps {
  tournaments: TournamentItem[];
}

export function TournamentsGrid({ tournaments }: TournamentsGridProps) {
  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-neon/15 text-brand-neon text-xs font-heading font-black uppercase tracking-wider mb-2 border border-brand-neon/30">
          <Trophy className="w-3.5 h-3.5" />
          <span>Active Gamba Races</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-heading font-black text-text-primary tracking-tight">
          Slot Tournaments &amp; Multiplier Races
        </h2>
        <p className="text-xs sm:text-sm text-text-muted mt-1">
          Spin on featured Gamba tournament slots with code <strong className="text-brand-neon font-mono">{siteConfig.code}</strong> to score leaderboard points and cash drops.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tournaments.map((tourney) => (
          <motion.div
            key={tourney.id}
            whileHover={{ y: -4 }}
            className="p-6 rounded-3xl bg-surface-card/60 backdrop-blur-2xl border border-brand-neon/20 hover:border-brand-neon/60 shadow-card hover:shadow-card-hover flex flex-col justify-between group transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-heading font-bold uppercase tracking-wider bg-brand-lime/15 text-brand-lime border border-brand-lime/30">
                  {tourney.status === "active" ? "Running" : "Upcoming"}
                </span>
                <span className="flex items-center gap-1 text-xs text-text-muted">
                  <Clock className="w-3 h-3 text-brand-ember" />
                  {tourney.endsAt}
                </span>
              </div>

              <h3 className="font-heading font-black text-lg text-text-primary mb-2 group-hover:text-brand-amber transition-colors">
                {tourney.title}
              </h3>

              <div className="p-3 rounded-xl bg-surface-elevated/70 border border-white/5 mb-4">
                <span className="text-[10px] uppercase tracking-wider text-text-muted block">
                  Prize Pool
                </span>
                <span className="text-2xl font-heading font-black text-brand-amber">
                  {tourney.prizePool}
                </span>
              </div>

              <div className="space-y-1.5 text-xs text-text-muted mb-6">
                <div className="flex items-center justify-between">
                  <span>Featured Slot:</span>
                  <span className="font-semibold text-text-primary">{tourney.featuredGame}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Minimum Bet:</span>
                  <span className="font-mono text-text-primary">{tourney.minBet}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Participants:</span>
                  <span className="flex items-center gap-1 font-mono text-brand-lime">
                    <Users className="w-3 h-3" />
                    {tourney.participantsCount}
                  </span>
                </div>
              </div>
            </div>

            <a
              href={siteConfig.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-brand text-black font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-glow hover:opacity-95 transition-all"
            >
              <span>Play Race on Gamba</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-black" />
            </a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
