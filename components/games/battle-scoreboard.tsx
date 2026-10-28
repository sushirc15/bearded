"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { ScoreState } from "@/lib/db/store";
import { cn } from "@/lib/utils";

interface BattleScoreboardProps {
  score: ScoreState;
  isAdmin: boolean;
  onResetScore?: () => void;
}

export function BattleScoreboard({ score, isAdmin, onResetScore }: BattleScoreboardProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handleReset() {
    setConfirmOpen(false);
    onResetScore?.();
  }

  return (
    <div className="relative">
      <div className="p-3.5 sm:p-5 rounded-2xl bg-surface-card/90 backdrop-blur-2xl border border-white/[0.08] shadow-card flex items-center justify-between gap-4 sm:gap-6 clip-chamfer">
        {/* House Score */}
        <div className="flex flex-col items-center sm:items-start">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-brand-amber font-bold">
            BEARDED GAMER
          </span>
          <div className="overflow-hidden h-10 sm:h-12 flex items-center">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={`house-${score.houseWins}`}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -24, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="font-display font-black italic text-3xl sm:text-5xl text-white leading-none tracking-tight"
              >
                {score.houseWins}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Divider / Colon */}
        <div className="flex flex-col items-center justify-center">
          <span className="font-display font-black text-2xl sm:text-3xl text-brand-neon/60">
            :
          </span>
        </div>

        {/* Chat Score */}
        <div className="flex flex-col items-center sm:items-end">
          <span className="text-[10px] sm:text-xs font-mono uppercase tracking-[0.25em] text-brand-lime font-bold">
            CHAT WINS
          </span>
          <div className="overflow-hidden h-10 sm:h-12 flex items-center">
            <AnimatePresence mode="popLayout">
              <motion.span
                key={`chat-${score.chatWins}`}
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -24, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="font-display font-black italic text-3xl sm:text-5xl text-brand-lime leading-none tracking-tight"
              >
                {score.chatWins}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Admin Reset Button */}
        {isAdmin && (
          <div className="pl-3 sm:pl-4 border-l border-white/[0.08]">
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="w-8 h-8 rounded-lg bg-surface-elevated hover:bg-brand-crimson/20 border border-white/[0.08] hover:border-brand-crimson/50 text-text-muted hover:text-brand-crimson flex items-center justify-center transition-all"
              title="Reset battle score"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Confirm Reset Dialog */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 z-50 p-4 rounded-xl bg-[#1E1813] border border-brand-crimson/50 shadow-2xl min-w-[260px]"
          >
            <div className="flex items-center gap-2 text-brand-crimson mb-2 font-heading font-black text-xs uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Reset Scoreboard?</span>
            </div>
            <p className="text-xs text-text-muted mb-3 leading-relaxed">
              This will reset Bearded Gamer and Chat wins back to 0-0. This action is saved to the database.
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="px-2.5 py-1 rounded text-xs text-text-muted hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="px-3 py-1 rounded bg-brand-crimson text-xs font-bold text-white hover:bg-brand-crimson/80"
              >
                Reset
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
