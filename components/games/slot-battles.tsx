"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Trophy,
  Crown,
  Sparkles,
  ExternalLink,
  Flame,
  Shuffle,
  RotateCcw,
  Zap,
} from "lucide-react";
import { GambaSlot, GAMBA_SLOTS } from "@/config/gamba-slots";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface SlotBattlesProps {
  initialHouseSlot?: GambaSlot | null;
  initialChatSlot?: GambaSlot | null;
}

export function SlotBattles({
  initialHouseSlot = null,
  initialChatSlot = null,
}: SlotBattlesProps) {
  const [houseSlot, setHouseSlot] = useState<GambaSlot | null>(initialHouseSlot);
  const [chatSlot, setChatSlot] = useState<GambaSlot | null>(initialChatSlot);
  const [winner, setWinner] = useState<"HOUSE" | "CHAT" | null>(null);
  const [battleCount, setBattleCount] = useState<number>(1);
  const [houseWins, setHouseWins] = useState<number>(7);
  const [chatWins, setChatWins] = useState<number>(5);

  React.useEffect(() => {
    if (initialHouseSlot) setHouseSlot(initialHouseSlot);
  }, [initialHouseSlot]);

  React.useEffect(() => {
    if (initialChatSlot) setChatSlot(initialChatSlot);
  }, [initialChatSlot]);

  // Trigger win declaration
  function handleDeclareWinner(side: "HOUSE" | "CHAT") {
    setWinner(side);
    if (side === "HOUSE") {
      setHouseWins((prev) => prev + 1);
    } else {
      setChatWins((prev) => prev + 1);
    }

    try {
      confetti({
        particleCount: 130,
        spread: 80,
        origin: { y: 0.6 },
        colors: side === "HOUSE" ? ["#00E700", "#BDF76B", "#FFFFFF"] : ["#8B5CF6", "#C084FC", "#00E700"],
      });
    } catch {
      // safe fallback
    }
  }

  // Quick roll for house or chat
  function handleQuickRoll(side: "HOUSE" | "CHAT") {
    const randomSlot = GAMBA_SLOTS[Math.floor(Math.random() * GAMBA_SLOTS.length)];
    if (side === "HOUSE") {
      setHouseSlot(randomSlot);
    } else {
      setChatSlot(randomSlot);
    }
  }

  // Reset battle
  function handleNextBattle() {
    setHouseSlot(null);
    setChatSlot(null);
    setWinner(null);
    setBattleCount((prev) => prev + 1);
  }

  return (
    <div className="space-y-6">
      {/* 1. Winner Banner */}
      <AnimatePresence>
        {winner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "p-6 rounded-3xl border-2 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left shadow-glow-lg",
              winner === "HOUSE"
                ? "bg-gradient-to-r from-brand-neon/20 via-surface-card to-brand-neon/10 border-brand-neon text-white"
                : "bg-gradient-to-r from-[#7C3AED]/25 via-surface-card to-[#7C3AED]/15 border-[#8B5CF6] text-white"
            )}
          >
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-glow text-black font-heading font-black",
                  winner === "HOUSE" ? "bg-brand-neon" : "bg-[#8B5CF6] text-white"
                )}
              >
                <Crown className="w-8 h-8 fill-current animate-bounce" />
              </div>
              <div>
                <span className="text-[11px] font-mono uppercase tracking-widest text-brand-neon font-bold block">
                  SHOWDOWN WINNER DECLARED
                </span>
                <h4 className="text-2xl font-heading font-black">
                  {winner === "HOUSE" ? "THE BEARDED GAMER (THE HOUSE) WINS!" : "CHAT & VIEWERS TAKE THE WIN!"}
                </h4>
                <p className="text-xs text-text-muted mt-0.5">
                  Winning slot:{" "}
                  <strong className="text-white">
                    {(winner === "HOUSE" ? houseSlot?.name : chatSlot?.name) || "Gamba Community Slot"}
                  </strong>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={siteConfig.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-brand-neon text-black font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow hover:scale-105 transition-transform"
              >
                <span>Spin on Gamba</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={handleNextBattle}
                className="px-4 py-2.5 rounded-xl bg-surface-elevated hover:bg-white/10 border border-white/10 text-xs font-heading font-bold text-text-primary uppercase tracking-wider transition-colors"
              >
                Next Battle
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Head-to-Head VS Cards (Screenshot 4: media_1793198915344_c7028142.png) */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        {/* Center VS Badge */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden md:flex w-14 h-14 rounded-2xl bg-[#090e14] border-2 border-brand-neon/80 shadow-[0_0_20px_#00E700] items-center justify-center font-heading font-black text-xl text-brand-neon select-none">
          VS
        </div>

        {/* LEFT CARD: THE HOUSE (The Bearded Gamer) */}
        <div
          className={cn(
            "relative rounded-3xl p-6 sm:p-8 bg-[#0d141e]/85 backdrop-blur-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden",
            winner === "HOUSE"
              ? "border-brand-neon ring-2 ring-brand-neon/60 shadow-[0_0_40px_rgba(0,231,0,0.35)]"
              : "border-brand-neon/30 hover:border-brand-neon/60 shadow-card"
          )}
        >
          {/* Top Left Angled Tab (Screenshot 4) */}
          <div className="absolute top-0 left-0 bg-brand-neon text-black font-heading font-black text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-br-2xl shadow-sm flex items-center gap-1.5">
            <Flame className="w-3 h-3 fill-black" />
            <span>THE HOUSE</span>
          </div>

          <div className="pt-6 flex flex-col items-center text-center">
            {/* Streamer Avatar in Glowing Green Circular Ring */}
            <div className="relative mb-4 mt-2">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-b from-brand-neon to-brand-lime shadow-[0_0_25px_#00E700] flex items-center justify-center">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-black">
                  <Image
                    src="/bearded-hero.png"
                    alt="The Bearded Gamer"
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Streamer Title */}
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
              THE BEARDED GAMER
            </h3>
            <span className="text-[10px] font-mono uppercase tracking-widest text-brand-lime font-bold mt-1">
              {houseWins} Total Wins
            </span>

            {/* PLAYING: Slot Display Box */}
            <div className="w-full mt-6 mb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted font-bold block mb-2">
                PLAYING
              </span>

              <div
                className={cn(
                  "w-full py-4 px-4 rounded-2xl border transition-all flex items-center justify-between",
                  houseSlot
                    ? "bg-surface-elevated/80 border-brand-neon/60 text-white shadow-glow"
                    : "bg-[#080d14]/80 border-white/10 text-text-muted"
                )}
              >
                {houseSlot ? (
                  <div className="text-left min-w-0 pr-2">
                    <span className="font-heading font-black text-base text-brand-neon block truncate">
                      {houseSlot.name}
                    </span>
                    <span className="text-xs font-mono text-text-muted block">
                      {houseSlot.provider} • {houseSlot.rtp}
                    </span>
                  </div>
                ) : (
                  <span className="font-heading font-bold text-sm text-text-faint mx-auto">
                    No slot yet
                  </span>
                )}

                <button
                  onClick={() => handleQuickRoll("HOUSE")}
                  className="p-2 rounded-xl bg-surface-card hover:bg-white/10 text-brand-neon border border-brand-neon/30 text-xs font-heading font-bold flex items-center gap-1 shrink-0 transition-colors"
                  title="Roll random Gamba slot"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Roll</span>
                </button>
              </div>
            </div>
          </div>

          {/* DECLARE WINNER BUTTON (Screenshot 4) */}
          <button
            onClick={() => handleDeclareWinner("HOUSE")}
            className="w-full py-3.5 px-6 rounded-2xl bg-brand-neon/20 hover:bg-brand-neon text-brand-neon hover:text-black border-2 border-brand-neon font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow hover:shadow-[0_0_30px_#00E700] transition-all"
          >
            <Crown className="w-4 h-4 fill-current" />
            <span>DECLARE WINNER</span>
          </button>
        </div>

        {/* RIGHT CARD: CHALLENGER · FROM CHAT */}
        <div
          className={cn(
            "relative rounded-3xl p-6 sm:p-8 bg-[#0d141e]/85 backdrop-blur-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden",
            winner === "CHAT"
              ? "border-[#8B5CF6] ring-2 ring-[#8B5CF6]/60 shadow-[0_0_40px_rgba(139,92,246,0.35)]"
              : "border-white/15 hover:border-[#8B5CF6]/50 shadow-card"
          )}
        >
          {/* Top Left Angled Tab (Screenshot 4) */}
          <div className="absolute top-0 left-0 bg-[#5B21B6] text-white font-heading font-black text-[11px] uppercase tracking-wider px-4 py-1.5 rounded-br-2xl shadow-sm flex items-center gap-1.5">
            <Zap className="w-3 h-3 fill-current text-[#C084FC]" />
            <span>CHALLENGER · FROM CHAT</span>
          </div>

          <div className="pt-6 flex flex-col items-center text-center">
            {/* Chat Avatar in Glowing Purple Ring with Kick "K" */}
            <div className="relative mb-4 mt-2">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-b from-[#8B5CF6] to-[#06B6D4] shadow-[0_0_25px_rgba(139,92,246,0.5)] flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#0a0f17] flex items-center justify-center">
                  {/* Stylized Kick Green K */}
                  <span className="font-heading font-black text-4xl sm:text-5xl text-brand-neon drop-shadow-[0_0_12px_#00E700]">
                    K
                  </span>
                </div>
              </div>
            </div>

            {/* Chat Title */}
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-white tracking-wide uppercase">
              CHAT
            </h3>
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#C084FC] font-bold mt-1">
              {chatWins} Total Wins
            </span>

            {/* PLAYING: Slot Display Box */}
            <div className="w-full mt-6 mb-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted font-bold block mb-2">
                PLAYING
              </span>

              <div
                className={cn(
                  "w-full py-4 px-4 rounded-2xl border transition-all flex items-center justify-between",
                  chatSlot
                    ? "bg-surface-elevated/80 border-[#8B5CF6]/60 text-white shadow-glow"
                    : "bg-[#080d14]/80 border-white/10 text-text-muted"
                )}
              >
                {chatSlot ? (
                  <div className="text-left min-w-0 pr-2">
                    <span className="font-heading font-black text-base text-[#C084FC] block truncate">
                      {chatSlot.name}
                    </span>
                    <span className="text-xs font-mono text-text-muted block">
                      {chatSlot.provider} • {chatSlot.rtp}
                    </span>
                  </div>
                ) : (
                  <span className="font-heading font-bold text-sm text-text-faint mx-auto">
                    No slot yet
                  </span>
                )}

                <button
                  onClick={() => handleQuickRoll("CHAT")}
                  className="p-2 rounded-xl bg-surface-card hover:bg-white/10 text-[#C084FC] border border-[#8B5CF6]/30 text-xs font-heading font-bold flex items-center gap-1 shrink-0 transition-colors"
                  title="Roll random Gamba slot"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Roll</span>
                </button>
              </div>
            </div>
          </div>

          {/* DECLARE WINNER BUTTON (Screenshot 4) */}
          <button
            onClick={() => handleDeclareWinner("CHAT")}
            className="w-full py-3.5 px-6 rounded-2xl bg-[#5B21B6]/30 hover:bg-[#5B21B6] text-white border-2 border-[#8B5CF6]/60 hover:border-[#8B5CF6] font-heading font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow transition-all"
          >
            <Crown className="w-4 h-4 fill-current text-[#C084FC]" />
            <span>DECLARE WINNER</span>
          </button>
        </div>
      </div>
    </div>
  );
}
