"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Gift } from "lucide-react";
import { LeaderboardEntry } from "@/app/api/leaderboard/route";
import { GamerAvatar } from "@/components/ui/gamer-avatar";
import { formatCurrency, formatWager } from "@/config/prizes";
import { cn } from "@/lib/utils";

interface TableProps {
  entries: LeaderboardEntry[];
}

export function LeaderboardTable({ entries }: TableProps) {
  // Show ranks 4 and above in the table
  const tableRows = entries.filter((e) => e.rank > 3);

  if (tableRows.length === 0) {
    return (
      <div className="text-center py-12 text-text-muted bg-surface-card rounded-2xl border border-white/5">
        No additional participants recorded yet.
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-2xl border border-brand-neon/25 bg-surface-card/60 backdrop-blur-2xl shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-brand-neon/20 bg-surface-elevated/50 text-[11px] font-heading font-bold text-text-muted uppercase tracking-wider">
              <th scope="col" className="py-4 px-4 sm:px-6 w-16 text-center">
                Rank
              </th>
              <th scope="col" className="py-4 px-4 sm:px-6">
                Player
              </th>
              <th scope="col" className="py-4 px-4 sm:px-6 text-right">
                Wagered
              </th>
              <th scope="col" className="py-4 px-4 sm:px-6 text-right">
                Prize
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {tableRows.map((entry, index) => {
              const isPrized = entry.prize > 0;
              return (
                <motion.tr
                  key={entry.rank}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.35,
                    delay: index * 0.04,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className={cn(
                    "group hover:bg-surface-elevated/70 transition-colors duration-200 select-none",
                    isPrized ? "bg-brand-neon/[0.03]" : ""
                  )}
                >
                  {/* Rank Column */}
                  <td className="py-3.5 px-4 sm:px-6 text-center">
                    <div className="inline-flex items-center justify-center">
                      <span
                        className={cn(
                          "w-8 h-8 rounded-xl font-heading font-black text-xs flex items-center justify-center border",
                          isPrized
                            ? "bg-brand-neon/15 text-brand-neon border-brand-neon/40 shadow-sm"
                            : "bg-surface-elevated text-text-muted border-white/5"
                        )}
                      >
                        #{entry.rank}
                      </span>
                    </div>
                  </td>

                  {/* Player Column */}
                  <td className="py-3.5 px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <GamerAvatar
                        username={entry.username}
                        rank={entry.rank}
                        size="sm"
                        className="group-hover:scale-105 transition-transform"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-heading font-bold text-sm text-text-primary group-hover:text-brand-neon transition-colors">
                            {entry.username}
                          </span>
                          {/* Rank Delta */}
                          {entry.rankDelta !== undefined && entry.rankDelta !== 0 && (
                            <span
                              className={cn(
                                "inline-flex items-center text-[10px] font-mono font-bold px-1.5 py-0.2 rounded",
                                entry.rankDelta > 0
                                  ? "text-brand-lime bg-brand-lime/10"
                                  : "text-brand-crimson bg-brand-crimson/10"
                              )}
                            >
                              {entry.rankDelta > 0 ? (
                                <TrendingUp className="w-2.5 h-2.5 mr-0.5" />
                              ) : (
                                <TrendingDown className="w-2.5 h-2.5 mr-0.5" />
                              )}
                              {entry.rankDelta > 0 ? `+${entry.rankDelta}` : entry.rankDelta}
                            </span>
                          )}
                        </div>
                        {isPrized && (
                          <span className="text-[10px] text-brand-neon font-medium">
                            Prize Tier Qualified
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Wagered Column */}
                  <td className="py-3.5 px-4 sm:px-6 text-right font-mono font-semibold text-text-primary text-sm">
                    {formatWager(entry.wagered)}
                  </td>

                  {/* Prize Column */}
                  <td className="py-3.5 px-4 sm:px-6 text-right">
                    {isPrized ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-brand-neon/15 border border-brand-neon/30 text-brand-neon font-heading font-black text-xs">
                        <Gift className="w-3 h-3 text-brand-neon" />
                        {formatCurrency(entry.prize)}
                      </span>
                    ) : (
                      <span className="text-xs font-mono text-text-faint">
                        --
                      </span>
                    )}
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
