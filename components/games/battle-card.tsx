"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown,
  Sparkles,
  Shuffle,
  Users,
  Edit2,
  Check,
  RotateCcw,
  Zap,
} from "lucide-react";
import { SlotInfo } from "@/lib/db/store";
import { cn } from "@/lib/utils";

interface BattleCardProps {
  side: "house" | "chat";
  slot: SlotInfo | null;
  chatterName?: string | null;
  chatterAvatar?: string | null;
  multiplier: number | null;
  isWinner: boolean;
  isLoser: boolean;
  isAdmin: boolean;
  onMultiplierChange?: (value: number | null) => void;
  onPickChatter?: () => void;
  onManualChatter?: (name: string) => void;
  onQuickReRoll?: () => void;
}

export function BattleCard({
  side,
  slot,
  chatterName,
  chatterAvatar,
  multiplier,
  isWinner,
  isLoser,
  isAdmin,
  onMultiplierChange,
  onPickChatter,
  onManualChatter,
  onQuickReRoll,
}: BattleCardProps) {
  const [isEditingChatter, setIsEditingChatter] = useState(false);
  const [manualNameInput, setManualNameInput] = useState("");
  const [multiplierInput, setMultiplierInput] = useState<string>(
    multiplier !== null && multiplier !== undefined ? String(multiplier) : ""
  );

  // Sync prop changes
  React.useEffect(() => {
    setMultiplierInput(
      multiplier !== null && multiplier !== undefined ? String(multiplier) : ""
    );
  }, [multiplier]);

  function handleMultiplierBlur() {
    if (!isAdmin) return;
    const val = parseFloat(multiplierInput);
    if (!isNaN(val) && val >= 0) {
      onMultiplierChange?.(val);
    } else if (multiplierInput.trim() === "") {
      onMultiplierChange?.(null);
    }
  }

  function handleManualNameSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (manualNameInput.trim()) {
      onManualChatter?.(manualNameInput.trim());
      setIsEditingChatter(false);
      setManualNameInput("");
    }
  }

  const isHouse = side === "house";

  return (
    <div
      className={cn(
        "relative flex-1 min-w-[290px] rounded-2xl p-5 sm:p-6 transition-all duration-300 clip-chamfer-lg card-tilt",
        isHouse
          ? "bg-gradient-to-br from-[#121A13] via-[#0E150F] to-[#080D08]"
          : "bg-gradient-to-br from-[#142216] via-[#0F1A11] to-[#0A120C]",
        isWinner &&
          "border-2 border-brand-gold shadow-[0_0_40px_rgba(255,200,61,0.5)] ring-2 ring-brand-gold/50 z-20 scale-[1.02]",
        isLoser && "opacity-60 grayscale-[30%] border border-white/[0.05]",
        !isWinner && !isLoser && "border border-white/[0.08] hover:border-brand-neon/30"
      )}
    >
      {/* Subtle diagonal stripe texture */}
      <div className="absolute inset-0 bg-stripes opacity-20 pointer-events-none rounded-2xl" />

      {/* Floating Crown Icon for Winner */}
      <AnimatePresence>
        {isWinner && (
          <motion.div
            initial={{ scale: 0, y: 15, rotate: -15 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0 }}
            className="absolute -top-5 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center p-2 rounded-full bg-gradient-to-r from-brand-lime via-brand-gold to-brand-lime text-black shadow-[0_0_20px_rgba(255,200,61,0.8)] border border-white/40"
          >
            <Crown className="w-5 h-5 fill-current" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 flex flex-col h-full justify-between gap-5">
        {/* Card Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className={cn(
                "relative w-11 h-11 rounded-xl overflow-hidden border-2 flex items-center justify-center shadow-glow",
                isHouse ? "border-brand-neon/70 bg-[#131F14]" : "border-brand-lime/70 bg-[#162312]"
              )}
            >
              {isHouse ? (
                <Image
                  src="/bearded-logo.png"
                  alt="The Bearded Gamer"
                  fill
                  className="object-cover"
                />
              ) : chatterAvatar ? (
                <Image
                  src={chatterAvatar}
                  alt={chatterName || "Chat Challenger"}
                  fill
                  className="object-cover"
                />
              ) : (
                <Users className="w-5 h-5 text-brand-lime" />
              )}
            </div>

            {/* Title & Tag */}
            <div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-[10px] font-mono uppercase tracking-[0.25em] font-black px-2 py-0.5 rounded",
                    isHouse
                      ? "bg-brand-neon/20 text-brand-neon border border-brand-neon/30"
                      : "bg-brand-lime/20 text-brand-lime border border-brand-lime/30"
                  )}
                >
                  {isHouse ? "THE HOUSE" : "CHALLENGER · FROM CHAT"}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse" />
              </div>

              <div className="flex items-center gap-2 mt-1">
                <h3 className="font-display font-black text-xl text-white tracking-tight">
                  {isHouse ? "The Bearded Gamer" : chatterName || "Awaiting Challenger"}
                </h3>
                {!isHouse && isAdmin && (
                  <button
                    type="button"
                    onClick={() => setIsEditingChatter(!isEditingChatter)}
                    className="text-text-muted hover:text-white"
                    title="Edit username manually"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions (Admin) */}
          {isAdmin && (
            <div className="flex items-center gap-1.5">
              {isHouse ? (
                <button
                  type="button"
                  onClick={onQuickReRoll}
                  className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-text-muted hover:text-white transition-colors"
                  title="Re-roll house slot"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onPickChatter}
                  className="px-2.5 py-1.5 rounded-lg bg-brand-lime/15 hover:bg-brand-lime/25 border border-brand-lime/30 text-[11px] font-mono text-brand-lime font-bold transition-all flex items-center gap-1"
                  title="Pick random active chatter from Kick stream"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Roll Chatter</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Manual Chatter Input (Admin) */}
        <AnimatePresence>
          {!isHouse && isEditingChatter && isAdmin && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleManualNameSubmit}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Enter chatter username..."
                value={manualNameInput}
                onChange={(e) => setManualNameInput(e.target.value)}
                className="flex-1 px-3 py-1.5 rounded-lg bg-surface-elevated border border-white/20 text-xs text-white focus:outline-none focus:border-brand-lime"
                autoFocus
              />
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-brand-lime text-black text-xs font-bold"
              >
                Set
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        {/* Slot Thumbnail & Name Body */}
        <div className="relative rounded-xl overflow-hidden border border-white/[0.08] min-h-[220px] flex flex-col justify-between p-4 bg-surface-elevated/70">
          {slot ? (
            <motion.div
              layoutId={slot.id}
              className="absolute inset-0 z-0"
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
            >
              {slot.thumbnail ? (
                <Image
                  src={slot.thumbnail}
                  alt={slot.name}
                  fill
                  sizes="400px"
                  className="object-cover opacity-50"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-ember/30 to-surface" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#15110E] via-[#15110E]/70 to-transparent" />
            </motion.div>
          ) : (
            <div className="absolute inset-0 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-6 text-center">
              <Zap className="w-8 h-8 text-white/20 mb-2 animate-pulse" />
              <p className="text-xs font-mono uppercase tracking-widest text-text-muted">
                Awaiting Roll...
              </p>
              <p className="text-[11px] text-text-muted/60 mt-1">
                Spin the Random Slot Picker above to assign.
              </p>
            </div>
          )}

          {/* Slot Metadata (When Assigned) */}
          {slot && (
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-brand-amber">
                  {slot.provider}
                </span>
                {slot.volatility && (
                  <span className="text-[10px] font-mono text-text-muted uppercase">
                    {slot.volatility} Volatility
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-display font-black text-2xl text-white tracking-tight leading-tight line-clamp-2">
                  {slot.name}
                </h4>
                {slot.rtp && (
                  <span className="text-xs font-mono text-brand-lime mt-1 inline-block">
                    RTP {slot.rtp}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Multiplier Section */}
        <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-text-muted">
              MULTIPLIER RESULT
            </span>
            <span className="text-[11px] text-text-muted font-sans">
              Highest multiplier takes the win
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin ? (
              <div className="flex items-center gap-1 bg-surface-elevated px-3 py-1.5 rounded-xl border border-white/15 focus-within:border-brand-neon">
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={multiplierInput}
                  onChange={(e) => setMultiplierInput(e.target.value)}
                  onBlur={handleMultiplierBlur}
                  className="w-20 bg-transparent text-right font-display font-black text-2xl text-white focus:outline-none"
                />
                <span className="font-display font-bold text-lg text-brand-lime">x</span>
              </div>
            ) : (
              <div className="font-display font-black text-3xl text-white tracking-tight">
                {multiplier !== null && multiplier !== undefined
                  ? `${multiplier.toFixed(2)}x`
                  : "--x"}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
