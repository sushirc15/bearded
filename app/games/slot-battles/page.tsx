"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Swords,
  Crown,
  Sparkles,
  RotateCcw,
  Trophy,
  Flame,
  ArrowRight,
  ExternalLink,
  Shield,
  AlertCircle,
} from "lucide-react";
import { SlotRoller } from "@/components/games/slot-roller";
import { BattleCard } from "@/components/games/battle-card";
import { BattleScoreboard } from "@/components/games/battle-scoreboard";
import { ViewerLockChip } from "@/components/ui/viewer-lock-chip";
import { useRealtime } from "@/lib/realtime/use-realtime";
import { BattleState, ScoreState, RollState, SlotInfo } from "@/lib/db/store";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const DEFAULT_SCORE: ScoreState = { houseWins: 7, chatWins: 5 };
const DEFAULT_BATTLE: BattleState = {
  id: "battle_init",
  status: "idle",
  houseSlot: null,
  chatSlot: null,
  chatterName: null,
  chatterAvatar: null,
  houseMultiplier: null,
  chatMultiplier: null,
  winner: null,
  lastAssignedSlot: null,
  createdAt: new Date().toISOString(),
};

export default function SlotBattlesPage() {
  const [battle, setBattle] = useState<BattleState>(DEFAULT_BATTLE);
  const [score, setScore] = useState<ScoreState>(DEFAULT_SCORE);
  const [currentRoll, setCurrentRoll] = useState<RollState | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isChatterRolling, setIsChatterRolling] = useState<boolean>(false);
  const [shufflingChatterName, setShufflingChatterName] = useState<string | null>(null);

  // Fetch initial state
  const loadInitialState = React.useCallback(async () => {
    try {
      const res = await fetch("/api/battle/state");
      if (res.ok) {
        const data = await res.json();
        if (data.battle) setBattle(data.battle);
        if (data.score) setScore(data.score);
        if (data.currentRoll) setCurrentRoll(data.currentRoll);
        setIsAdmin(Boolean(data.isAdmin));
      }
    } catch (err) {
      console.error("Failed to load battle state", err);
    }
  }, []);

  useEffect(() => {
    loadInitialState();
  }, [loadInitialState]);

  // Realtime SSE sync
  useRealtime({
    channel: "battle",
    onMessage: (event: any) => {
      if (event.type === "roll_started") {
        setCurrentRoll(event.roll);
        if (event.battle) setBattle(event.battle);
      } else if (event.type === "slot_assigned") {
        setBattle(event.battle);
      } else if (event.type === "chatter_picked") {
        setBattle(event.battle);
      } else if (event.type === "multipliers_updated") {
        setBattle(event.battle);
      } else if (event.type === "winner_declared") {
        setBattle(event.battle);
        setScore(event.score);
        triggerConfetti(event.winner);
      } else if (event.type === "next_battle") {
        setBattle(event.battle);
        setScore(event.score);
        setCurrentRoll(null);
      } else if (event.type === "battle_undo") {
        setBattle(event.battle);
        setScore(event.score);
      } else if (event.type === "score_reset") {
        setScore(event.score);
      }
    },
    onReconnect: loadInitialState,
  });

  // Confetti trigger
  function triggerConfetti(winner: "house" | "chat") {
    try {
      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 },
        colors:
          winner === "house"
            ? ["#00E700", "#BDF76B", "#FFFFFF", "#B6FF3B"]
            : ["#B6FF3B", "#00E700", "#FFFFFF", "#BDF76B"],
      });
    } catch {
      // safe fallback
    }
  }

  // Admin: Assign slot to corner
  async function handleAssignSlot(target: "house" | "chat", slot: SlotInfo) {
    if (!isAdmin) return;
    try {
      const res = await fetch("/api/battle/assign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target, slot }),
      });
      if (res.ok) {
        const data = await res.json();
        setBattle(data.battle);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Admin: Pick random active Kick chatter (1.5s slot-machine shuffle)
  async function handlePickChatter() {
    if (!isAdmin || isChatterRolling) return;
    setIsChatterRolling(true);

    // Fetch active chatters
    try {
      const res = await fetch("/api/kick/chatters");
      const data = await res.json();
      const chatters = data.chatters || [];

      if (chatters.length > 0) {
        let count = 0;
        const interval = setInterval(() => {
          const rand = chatters[Math.floor(Math.random() * chatters.length)];
          setShufflingChatterName(rand.username);
          count++;
          if (count >= 12) {
            clearInterval(interval);
            executeChatterPick();
          }
        }, 110);
      } else {
        executeChatterPick();
      }
    } catch {
      executeChatterPick();
    }

    async function executeChatterPick() {
      try {
        const res = await fetch("/api/battle/pick-chatter", { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          setBattle(data.battle);
        }
      } finally {
        setIsChatterRolling(false);
        setShufflingChatterName(null);
      }
    }
  }

  // Admin: Manual chatter name
  async function handleManualChatter(name: string) {
    if (!isAdmin) return;
    try {
      const res = await fetch("/api/battle/pick-chatter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: name }),
      });
      if (res.ok) {
        const data = await res.json();
        setBattle(data.battle);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Admin: Multiplier changes
  async function handleMultiplierChange(side: "house" | "chat", val: number | null) {
    if (!isAdmin) return;
    const body =
      side === "house"
        ? { houseMultiplier: val }
        : { chatMultiplier: val };

    try {
      const res = await fetch("/api/battle/set-multipliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const data = await res.json();
        setBattle(data.battle);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Admin: Declare winner
  async function handleDeclareWinner(preferredWinner?: "house" | "chat") {
    if (!isAdmin) return;

    let winner = preferredWinner;
    if (!winner) {
      const houseM = battle.houseMultiplier || 0;
      const chatM = battle.chatMultiplier || 0;
      winner = houseM >= chatM ? "house" : "chat";
    }

    try {
      const res = await fetch("/api/battle/declare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          winner,
          houseMultiplier: battle.houseMultiplier || undefined,
          chatMultiplier: battle.chatMultiplier || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setBattle(data.battle);
        setScore(data.score);
        triggerConfetti(winner);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Admin: Next battle
  async function handleNextBattle() {
    if (!isAdmin) return;
    try {
      const res = await fetch("/api/battle/next", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setBattle(data.battle);
        setScore(data.score);
        setCurrentRoll(null);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Admin: Undo battle action
  async function handleUndoBattle() {
    if (!isAdmin) return;
    try {
      const res = await fetch("/api/battle/undo", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setBattle(data.battle);
        setScore(data.score);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Admin: Reset score
  async function handleResetScore() {
    if (!isAdmin) return;
    try {
      const res = await fetch("/api/battle/reset-score", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setScore(data.score);
      }
    } catch (err) {
      console.error(err);
    }
  }

  const isReady =
    Boolean(battle.houseSlot) &&
    Boolean(battle.chatSlot) &&
    Boolean(battle.chatterName);

  const isFinished = battle.status === "finished";

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-10 sm:space-y-12">
      {/* 1. Header & Scoreboard Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div className="max-w-2xl">
          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-crimson/15 border border-brand-crimson/30 text-brand-crimson text-xs font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-brand-crimson animate-ping" />
              LIVE SLOT DUEL
            </span>
            <ViewerLockChip isAdmin={isAdmin} onAdminChange={setIsAdmin} />
          </div>

          {/* Huge condensed italic title */}
          <h1 className="font-display font-black italic text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-none text-white">
            SLOT{" "}
            <span className="bg-gradient-to-r from-brand-neon via-brand-lime to-white bg-clip-text text-transparent">
              BATTLES
            </span>
          </h1>

          <p className="text-sm sm:text-base text-text-muted mt-3 max-w-xl leading-relaxed">
            A viewer takes on the house. Both spin a slot - highest multiplier wins. Beat The Bearded Gamer, take the prize.
          </p>
        </div>

        {/* Scoreboard Right Side */}
        <div className="shrink-0 flex flex-col items-start lg:items-end gap-2">
          <BattleScoreboard
            score={score}
            isAdmin={isAdmin}
            onResetScore={handleResetScore}
          />
        </div>
      </div>

      {/* 2. Random Slot Picker Panel (Server-Authoritative Case Roller) */}
      <section aria-label="Random Slot Picker">
        <SlotRoller
          isAdmin={isAdmin}
          currentRoll={currentRoll}
          lastAssignedSlot={battle.lastAssignedSlot}
          isRolling={battle.status === "rolling"}
          onAssignSlot={handleAssignSlot}
          onUndoRoll={handleUndoBattle}
        />
      </section>

      {/* 3. Battle Arena: House vs Chat Challenger */}
      <section aria-label="Slot Duel Arena" className="space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-display font-black italic text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-2">
              <Swords className="w-6 h-6 text-brand-neon" />
              <span>THE DUEL ARENA</span>
            </h2>
            <p className="text-xs sm:text-sm text-text-muted mt-0.5">
              Assigned slots and live multiplier results.
            </p>
          </div>

          {/* Admin Battle Status & Action Buttons */}
          {isAdmin && (
            <div className="flex flex-wrap items-center gap-3">
              {/* Declare Winner Button */}
              {isReady && !isFinished && (
                <button
                  type="button"
                  onClick={() => handleDeclareWinner()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-neon via-brand-lime to-brand-neon text-black font-heading font-black text-xs uppercase tracking-widest hover:opacity-95 shadow-[0_0_25px_rgba(0,231,0,0.5)] transition-all active:scale-95 flex items-center gap-2 clip-chamfer-sm"
                >
                  <Crown className="w-4 h-4 fill-current" />
                  <span>DECLARE WINNER</span>
                </button>
              )}

              {/* Next Battle Button */}
              {isFinished && (
                <button
                  type="button"
                  onClick={handleNextBattle}
                  className="px-5 py-2.5 rounded-xl bg-brand-lime hover:bg-brand-lime/90 text-black font-heading font-black text-xs uppercase tracking-widest shadow-glow transition-all flex items-center gap-2 clip-chamfer-sm"
                >
                  <span>NEXT BATTLE</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {/* Undo Button */}
              <button
                type="button"
                onClick={handleUndoBattle}
                className="px-3.5 py-2.5 rounded-xl bg-surface-card hover:bg-white/10 border border-white/10 text-xs font-mono text-text-muted hover:text-white transition-all flex items-center gap-1.5"
                title="Undo last battle step"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>
            </div>
          )}
        </div>

        {/* Side-by-Side Battle Cards with Center VS Badge */}
        <div className="relative flex flex-col md:flex-row items-stretch gap-6 lg:gap-8">
          {/* Left Card: THE HOUSE */}
          <BattleCard
            side="house"
            slot={battle.houseSlot}
            multiplier={battle.houseMultiplier}
            isWinner={battle.winner === "house"}
            isLoser={battle.winner === "chat"}
            isAdmin={isAdmin}
            onMultiplierChange={(val) => handleMultiplierChange("house", val)}
            onQuickReRoll={() => {
              if (battle.lastAssignedSlot) {
                handleAssignSlot("house", battle.lastAssignedSlot);
              }
            }}
          />

          {/* Center VS Badge */}
          <div className="self-center md:my-auto shrink-0 z-20">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-brand-neon to-brand-lime opacity-30 blur-lg"
              />
              <div className="relative w-full h-full rounded-2xl bg-[#0E150F] border-2 border-brand-neon/60 flex items-center justify-center shadow-[0_0_20px_rgba(0,231,0,0.6)] clip-chamfer">
                <span className="font-display font-black italic text-2xl sm:text-3xl text-brand-lime">
                  VS
                </span>
              </div>
            </div>
          </div>

          {/* Right Card: CHALLENGER · FROM CHAT */}
          <BattleCard
            side="chat"
            slot={battle.chatSlot}
            chatterName={shufflingChatterName || battle.chatterName}
            chatterAvatar={battle.chatterAvatar}
            multiplier={battle.chatMultiplier}
            isWinner={battle.winner === "chat"}
            isLoser={battle.winner === "house"}
            isAdmin={isAdmin}
            onMultiplierChange={(val) => handleMultiplierChange("chat", val)}
            onPickChatter={handlePickChatter}
            onManualChatter={handleManualChatter}
          />
        </div>
      </section>

      {/* 4. Responsible Gaming Strip & Affiliate Disclaimer */}
      <footer className="pt-10 border-t border-white/[0.08] text-xs text-text-muted space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-surface-card/60 border border-white/[0.06]">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-brand-crimson/20 text-brand-crimson font-mono font-bold text-[11px] border border-brand-crimson/30">
              18+
            </span>
            <span>
              Gamble responsibly. For help, visit{" "}
              <a
                href={siteConfig.responsibleGambling.therapyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-neon hover:underline font-medium inline-flex items-center gap-0.5"
              >
                GamblingTherapy.org <ExternalLink className="w-3 h-3 inline" />
              </a>
            </span>
          </div>
          <span className="text-[11px] text-text-muted/70">
            {siteConfig.disclaimer}
          </span>
        </div>
      </footer>
    </div>
  );
}
