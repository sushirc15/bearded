"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Trophy,
  Crown,
  RotateCcw,
  Plus,
  ArrowRight,
  Shuffle,
  Check,
  Sparkles,
  ExternalLink,
  Flame,
  Radio,
  Sliders,
  AlertTriangle,
} from "lucide-react";
import { ViewerLockChip } from "@/components/ui/viewer-lock-chip";
import { useRealtime } from "@/lib/realtime/use-realtime";
import { BracketState, BracketEntry } from "@/lib/db/store";
import { SLOTS_CATALOG } from "@/lib/games/provider";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const DEFAULT_BRACKET: BracketState = {
  id: "bracket_init",
  size: 8,
  status: "active",
  entries: [
    { slot: "Gates of Olympus 1000", player: "KickViper" },
    { slot: "Wanted Dead or a Wild", player: "SlotKing99" },
    { slot: "Sweet Bonanza 1000", player: "LuckyWhale" },
    { slot: "Chaos Crew 2", player: "BeardBro" },
    { slot: "San Quentin xWays", player: "CyberApe" },
    { slot: "Mental", player: "ZenithSpin" },
    { slot: "Razor Returns", player: "NeonNinja" },
    { slot: "Le Bandit", player: "AlphaRoll" },
  ],
  winners: {
    0: [null, null, null, null],
    1: [null, null],
    2: [null],
  },
  champion: null,
  createdAt: new Date().toISOString(),
};

export default function TournamentsPage() {
  const [bracket, setBracket] = useState<BracketState>(DEFAULT_BRACKET);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [newBracketModalOpen, setNewBracketModalOpen] = useState(false);
  const [newBracketSize, setNewBracketSize] = useState<4 | 8 | 16>(8);
  const [activeSlotPickerRow, setActiveSlotPickerRow] = useState<number | null>(null);

  // Debounced input change tracking
  const debounceTimersRef = useRef<Record<string, NodeJS.Timeout>>({});

  const loadInitialState = useCallback(async () => {
    try {
      const res = await fetch("/api/bracket/state");
      if (res.ok) {
        const data = await res.json();
        if (data.bracket) setBracket(data.bracket);
        setIsAdmin(Boolean(data.isAdmin));
      }
    } catch (err) {
      console.error("Failed to load bracket state", err);
    }
  }, []);

  useEffect(() => {
    loadInitialState();
  }, [loadInitialState]);

  // Realtime SSE sync
  useRealtime({
    channel: "bracket",
    onMessage: (event: any) => {
      if (event.bracket) {
        setBracket(event.bracket);
        if (event.type === "bracket_advanced" && event.bracket.champion) {
          triggerChampionConfetti();
        }
      }
    },
    onReconnect: loadInitialState,
  });

  function triggerChampionConfetti() {
    try {
      confetti({
        particleCount: 160,
        spread: 100,
        origin: { y: 0.55 },
        colors: ["#00E700", "#BDF76B", "#FFC83D", "#FFFFFF", "#B6FF3B"],
      });
    } catch {
      // safe fallback
    }
  }

  // Admin: Debounced autosave for entry slot/player changes
  function handleEntryChange(index: number, field: "slot" | "player", value: string) {
    if (!isAdmin) return;

    // Optimistic UI update
    setBracket((prev) => {
      const updated = { ...prev };
      const entries = [...updated.entries];
      if (entries[index]) {
        entries[index] = { ...entries[index], [field]: value };
      }
      return { ...updated, entries };
    });

    // Clear existing timer for this key
    const timerKey = `${index}-${field}`;
    if (debounceTimersRef.current[timerKey]) {
      clearTimeout(debounceTimersRef.current[timerKey]);
    }

    // Schedule autosave after 300ms debounce
    debounceTimersRef.current[timerKey] = setTimeout(async () => {
      try {
        await fetch("/api/bracket/entry", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ index, [field]: value }),
        });
      } catch (err) {
        console.error("Failed to autosave entry", err);
      }
    }, 300);
  }

  // Admin: Advance a winner to the next round
  async function handleAdvanceWinner(roundIndex: number, matchIndex: number, winnerText: string) {
    if (!isAdmin || !winnerText) return;
    try {
      const res = await fetch("/api/bracket/advance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roundIndex, matchIndex, winner: winnerText }),
      });
      if (res.ok) {
        const data = await res.json();
        setBracket(data.bracket);
        if (data.bracket.champion) {
          triggerChampionConfetti();
        }
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Admin: Undo bracket step
  async function handleUndo() {
    if (!isAdmin) return;
    try {
      const res = await fetch("/api/bracket/undo", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setBracket(data.bracket);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Admin: Create new bracket
  async function handleCreateNewBracket() {
    if (!isAdmin) return;
    try {
      const res = await fetch("/api/bracket/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ size: newBracketSize }),
      });
      if (res.ok) {
        const data = await res.json();
        setBracket(data.bracket);
        setNewBracketModalOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Admin: Random slot roll for single row
  function handleRollSlotForRow(index: number) {
    if (!isAdmin) return;
    const randomSlot = SLOTS_CATALOG[Math.floor(Math.random() * SLOTS_CATALOG.length)];
    handleEntryChange(index, "slot", randomSlot.title);
  }

  const size = bracket.size || 8;
  const totalRounds = Math.log2(size); // e.g. 3 for size 8

  // Helper to format match participants
  const getRoundParticipants = (roundIndex: number, matchIndex: number): [string | null, string | null] => {
    if (roundIndex === 0) {
      // Quarterfinals / Round 0 entries
      const topEntry = bracket.entries[matchIndex * 2];
      const botEntry = bracket.entries[matchIndex * 2 + 1];
      const topLabel = topEntry ? `${topEntry.player} (${topEntry.slot})` : null;
      const botLabel = botEntry ? `${botEntry.player} (${botEntry.slot})` : null;
      return [topLabel, botLabel];
    } else {
      // Fed by winners from previous round
      const prevRoundWinners = bracket.winners[roundIndex - 1] || [];
      const topWinner = prevRoundWinners[matchIndex * 2] || null;
      const botWinner = prevRoundWinners[matchIndex * 2 + 1] || null;
      return [topWinner, botWinner];
    }
  };

  return (
    <div className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto space-y-8 sm:space-y-10">
      {/* 1. Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-neon/15 border border-brand-neon/30 text-brand-neon text-xs font-mono font-bold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse" />
              LIVE STREAM BRACKET
            </span>
            <ViewerLockChip isAdmin={isAdmin} onAdminChange={setIsAdmin} />
          </div>

          <h1 className="font-display font-black italic text-5xl sm:text-7xl lg:text-8xl tracking-tight leading-none text-white">
            SLOT TOURNAMENT{" "}
            <span className="bg-gradient-to-r from-brand-neon via-brand-lime to-brand-amber bg-clip-text text-transparent">
              BRACKET
            </span>
          </h1>

          <p className="text-sm sm:text-base text-text-muted mt-3 max-w-2xl leading-relaxed">
            Single elimination. Two slots enter, higher multiplier advances. The last slot standing takes the crown.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex items-center gap-3">
          {isAdmin ? (
            <>
              <button
                type="button"
                onClick={handleUndo}
                className="px-3.5 py-2 rounded-xl bg-surface-card hover:bg-white/10 border border-white/10 text-xs font-mono text-text-muted hover:text-white transition-all flex items-center gap-1.5"
                title="Undo last bracket modification"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>

              <button
                type="button"
                onClick={() => setNewBracketModalOpen(true)}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-neon via-brand-lime to-brand-neon text-black font-heading font-black text-xs uppercase tracking-wider hover:opacity-95 shadow-[0_0_20px_rgba(0,231,0,0.5)] transition-all flex items-center gap-2 clip-chamfer-sm"
              >
                <Plus className="w-4 h-4" />
                <span>+ New Bracket</span>
              </button>
            </>
          ) : (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface-card border border-white/10 text-xs font-mono text-text-muted">
              <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
              <span>Live · Synced with stream</span>
            </div>
          )}
        </div>
      </div>

      {/* 2. Responsive 5-Column Tournament Bracket Tree */}
      <div className="relative rounded-2xl bg-surface-card/80 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-4 sm:p-7 overflow-x-auto snap-x mandatory">
        {/* Top 5 Column Headers */}
        <div className="grid grid-cols-5 min-w-[1100px] gap-6 pb-4 mb-6 border-b border-white/[0.08] sticky top-0 bg-[#0E150F]/95 backdrop-blur-md z-30 pt-2">
          <div className="text-xs font-mono font-black uppercase tracking-[0.25em] text-text-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-neon" />
            <span>1. SLOT</span>
          </div>
          <div className="text-xs font-mono font-black uppercase tracking-[0.25em] text-text-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-lime" />
            <span>2. QUARTERFINALS</span>
          </div>
          <div className="text-xs font-mono font-black uppercase tracking-[0.25em] text-text-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-neon" />
            <span>3. SEMIFINALS</span>
          </div>
          <div className="text-xs font-mono font-black uppercase tracking-[0.25em] text-text-muted flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-crimson" />
            <span>4. FINAL</span>
          </div>
          <div className="text-xs font-mono font-black uppercase tracking-[0.25em] text-brand-gold flex items-center gap-2">
            <Crown className="w-3.5 h-3.5 text-brand-gold fill-current" />
            <span>5. CHAMPION</span>
          </div>
        </div>

        {/* Tree Container */}
        <div className="grid grid-cols-5 min-w-[1100px] gap-6 relative items-stretch">
          {/* COLUMN 1: SLOT (8 Editable Chamfered Boxes) */}
          <div className="space-y-4 flex flex-col justify-between">
            {bracket.entries.map((entry, idx) => (
              <div
                key={`slot-${idx}`}
                className="relative rounded-xl p-3 bg-surface-elevated/90 border border-white/[0.08] hover:border-brand-neon/40 transition-all clip-chamfer-sm group"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[10px] font-mono text-text-muted font-bold">
                    SEED #{idx + 1}
                  </span>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => handleRollSlotForRow(idx)}
                      className="text-text-muted hover:text-brand-lime p-1 rounded transition-colors"
                      title="Roll random slot from catalog"
                    >
                      <Shuffle className="w-3 h-3" />
                    </button>
                  )}
                </div>

                {isAdmin ? (
                  <input
                    type="text"
                    value={entry.slot}
                    onChange={(e) => handleEntryChange(idx, "slot", e.target.value)}
                    placeholder="Enter slot name..."
                    className="w-full bg-transparent font-display font-black text-sm text-white focus:outline-none focus:text-brand-neon"
                  />
                ) : (
                  <span className="font-display font-black text-sm text-white block truncate">
                    {entry.slot}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* COLUMN 2: QUARTERFINALS (4 Matches = 8 Player entries) */}
          <div className="space-y-6 flex flex-col justify-around relative">
            {[0, 1, 2, 3].map((matchIdx) => {
              const [topParticipant, botParticipant] = getRoundParticipants(0, matchIdx);
              const winner = bracket.winners[0]?.[matchIdx];

              return (
                <div
                  key={`qf-match-${matchIdx}`}
                  className="rounded-xl p-3.5 bg-surface-elevated/95 border border-white/[0.08] shadow-card relative clip-chamfer flex flex-col gap-2"
                >
                  <div className="text-[9px] font-mono uppercase tracking-widest text-text-muted pb-1 border-b border-white/[0.06] flex items-center justify-between">
                    <span>MATCH {matchIdx + 1}</span>
                    {winner && (
                      <span className="text-brand-lime font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Advanced
                      </span>
                    )}
                  </div>

                  {/* Top Participant */}
                  <div
                    className={cn(
                      "flex items-center justify-between gap-2 p-2 rounded-lg transition-all",
                      winner === topParticipant
                        ? "bg-brand-neon/20 text-white font-bold border border-brand-neon/40 shadow-[0_0_12px_rgba(0,231,0,0.3)]"
                        : "text-text-muted hover:text-white"
                    )}
                  >
                    <span className="font-sans text-xs truncate max-w-[140px]">
                      {topParticipant || `Seed #${matchIdx * 2 + 1}`}
                    </span>
                    {isAdmin && topParticipant && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceWinner(0, matchIdx, topParticipant)}
                        className="px-2 py-1 rounded bg-surface hover:bg-brand-neon text-text-muted hover:text-black text-[10px] font-mono font-bold transition-all"
                        title="Advance to Semifinals"
                      >
                        -&gt;
                      </button>
                    )}
                  </div>

                  {/* Bottom Participant */}
                  <div
                    className={cn(
                      "flex items-center justify-between gap-2 p-2 rounded-lg transition-all",
                      winner === botParticipant
                        ? "bg-brand-neon/20 text-white font-bold border border-brand-neon/40 shadow-[0_0_12px_rgba(0,231,0,0.3)]"
                        : "text-text-muted hover:text-white"
                    )}
                  >
                    <span className="font-sans text-xs truncate max-w-[140px]">
                      {botParticipant || `Seed #${matchIdx * 2 + 2}`}
                    </span>
                    {isAdmin && botParticipant && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceWinner(0, matchIdx, botParticipant)}
                        className="px-2 py-1 rounded bg-surface hover:bg-brand-neon text-text-muted hover:text-black text-[10px] font-mono font-bold transition-all"
                        title="Advance to Semifinals"
                      >
                        -&gt;
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* COLUMN 3: SEMIFINALS (2 Matches = 4 entries) */}
          <div className="space-y-12 flex flex-col justify-around relative">
            {[0, 1].map((matchIdx) => {
              const [topParticipant, botParticipant] = getRoundParticipants(1, matchIdx);
              const winner = bracket.winners[1]?.[matchIdx];

              return (
                <div
                  key={`sf-match-${matchIdx}`}
                  className="rounded-xl p-3.5 bg-surface-elevated/95 border border-white/[0.08] shadow-card relative clip-chamfer flex flex-col gap-2"
                >
                  <div className="text-[9px] font-mono uppercase tracking-widest text-text-muted pb-1 border-b border-white/[0.06] flex items-center justify-between">
                    <span>SEMIFINAL {matchIdx + 1}</span>
                    {winner && (
                      <span className="text-brand-lime font-bold flex items-center gap-1">
                        <Check className="w-3 h-3" /> Advanced
                      </span>
                    )}
                  </div>

                  {/* Top Participant */}
                  <div
                    className={cn(
                      "flex items-center justify-between gap-2 p-2 rounded-lg transition-all",
                      winner === topParticipant
                        ? "bg-brand-lime/20 text-white font-bold border border-brand-lime/40 shadow-[0_0_12px_rgba(182,255,59,0.3)]"
                        : "text-text-muted hover:text-white"
                    )}
                  >
                    <span className="font-sans text-xs truncate max-w-[140px]">
                      {topParticipant || "Awaiting QF Winner"}
                    </span>
                    {isAdmin && topParticipant && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceWinner(1, matchIdx, topParticipant)}
                        className="px-2 py-1 rounded bg-surface hover:bg-brand-lime text-text-muted hover:text-black text-[10px] font-mono font-bold transition-all"
                        title="Advance to Final"
                      >
                        -&gt;
                      </button>
                    )}
                  </div>

                  {/* Bottom Participant */}
                  <div
                    className={cn(
                      "flex items-center justify-between gap-2 p-2 rounded-lg transition-all",
                      winner === botParticipant
                        ? "bg-brand-lime/20 text-white font-bold border border-brand-lime/40 shadow-[0_0_12px_rgba(182,255,59,0.3)]"
                        : "text-text-muted hover:text-white"
                    )}
                  >
                    <span className="font-sans text-xs truncate max-w-[140px]">
                      {botParticipant || "Awaiting QF Winner"}
                    </span>
                    {isAdmin && botParticipant && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceWinner(1, matchIdx, botParticipant)}
                        className="px-2 py-1 rounded bg-surface hover:bg-brand-lime text-text-muted hover:text-black text-[10px] font-mono font-bold transition-all"
                        title="Advance to Final"
                      >
                        -&gt;
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* COLUMN 4: FINAL (1 Match = 2 entries) */}
          <div className="flex flex-col justify-center relative">
            {(() => {
              const [topParticipant, botParticipant] = getRoundParticipants(2, 0);
              const winner = bracket.winners[2]?.[0];

              return (
                <div className="rounded-xl p-4 bg-surface-elevated/95 border border-brand-crimson/30 shadow-card relative clip-chamfer flex flex-col gap-2.5">
                  <div className="text-[10px] font-mono uppercase tracking-widest text-brand-crimson pb-1 border-b border-white/[0.08] flex items-center justify-between font-black">
                    <span>CHAMPIONSHIP FINAL</span>
                    {winner && (
                      <span className="text-brand-gold font-bold flex items-center gap-1">
                        <Crown className="w-3.5 h-3.5 fill-current" /> Crowned
                      </span>
                    )}
                  </div>

                  {/* Top Finalist */}
                  <div
                    className={cn(
                      "flex items-center justify-between gap-2 p-2.5 rounded-lg transition-all",
                      winner === topParticipant
                        ? "bg-brand-gold/20 text-white font-bold border border-brand-gold/60 shadow-glow"
                        : "text-text-muted hover:text-white"
                    )}
                  >
                    <span className="font-sans text-xs truncate max-w-[140px]">
                      {topParticipant || "Awaiting SF 1"}
                    </span>
                    {isAdmin && topParticipant && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceWinner(2, 0, topParticipant)}
                        className="px-2 py-1 rounded bg-brand-gold text-black text-[10px] font-mono font-bold hover:scale-105 transition-all"
                        title="Crown as Champion"
                      >
                        Crown &rarr;
                      </button>
                    )}
                  </div>

                  {/* Bottom Finalist */}
                  <div
                    className={cn(
                      "flex items-center justify-between gap-2 p-2.5 rounded-lg transition-all",
                      winner === botParticipant
                        ? "bg-brand-gold/20 text-white font-bold border border-brand-gold/60 shadow-glow"
                        : "text-text-muted hover:text-white"
                    )}
                  >
                    <span className="font-sans text-xs truncate max-w-[140px]">
                      {botParticipant || "Awaiting SF 2"}
                    </span>
                    {isAdmin && botParticipant && (
                      <button
                        type="button"
                        onClick={() => handleAdvanceWinner(2, 0, botParticipant)}
                        className="px-2 py-1 rounded bg-brand-gold text-black text-[10px] font-mono font-bold hover:scale-105 transition-all"
                        title="Crown as Champion"
                      >
                        Crown &rarr;
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* COLUMN 5: CHAMPION (Elevated Chamfered Card with Gold Foil Border) */}
          <div className="flex flex-col justify-center">
            <div
              className={cn(
                "relative rounded-2xl p-6 text-center transition-all duration-300 clip-chamfer-lg",
                bracket.champion
                  ? "bg-gradient-to-b from-[#2A200B] to-[#15110E] border-2 border-brand-gold shadow-[0_0_40px_rgba(255,200,61,0.55)] scale-105"
                  : "bg-surface-elevated/50 border border-white/[0.08]"
              )}
            >
              {/* Floating animated gold glow */}
              {bracket.champion && (
                <motion.div
                  animate={{
                    scale: [1, 1.15, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-2xl bg-brand-gold/10 blur-xl pointer-events-none"
                />
              )}

              <div className="relative z-10 flex flex-col items-center">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-glow transition-all",
                    bracket.champion
                      ? "bg-brand-gold text-black"
                      : "bg-white/5 text-text-muted"
                  )}
                >
                  <Crown className="w-6 h-6 fill-current" />
                </div>

                <span className="text-[10px] font-mono uppercase tracking-[0.3em] font-black text-brand-gold mb-1">
                  CHAMPION
                </span>

                <h3 className="font-display font-black text-xl sm:text-2xl text-white tracking-tight leading-tight">
                  {bracket.champion || "TBD"}
                </h3>

                <p className="text-[11px] text-text-muted mt-2">
                  {bracket.champion
                    ? "Takes the Streamer Bounty!"
                    : "Complete final round to crown champion."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Modal: New Bracket Dialog */}
      <AnimatePresence>
        {newBracketModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setNewBracketModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl bg-[#0E150F] border border-brand-neon/30 p-6 shadow-2xl z-10 clip-chamfer"
            >
              <div className="flex items-center gap-2 mb-3 text-brand-neon">
                <Trophy className="w-5 h-5 text-brand-neon" />
                <h3 className="font-display font-black text-2xl text-white">
                  CREATE NEW BRACKET
                </h3>
              </div>

              <p className="text-xs text-text-muted mb-5 leading-relaxed">
                Starting a new bracket will archive the current tournament. Select bracket size:
              </p>

              {/* Size Selector */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                {[4, 8, 16].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setNewBracketSize(num as 4 | 8 | 16)}
                    className={cn(
                      "p-3 rounded-xl border text-center font-display font-black text-xl transition-all",
                      newBracketSize === num
                        ? "bg-brand-neon/20 border-brand-neon text-brand-neon shadow-[0_0_15px_rgba(0,231,0,0.3)]"
                        : "bg-surface-card border-white/10 text-text-muted hover:text-white"
                    )}
                  >
                    <span>{num}</span>
                    <span className="block text-[10px] font-sans font-normal text-text-muted uppercase tracking-wider">
                      Slots
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setNewBracketModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-text-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewBracket}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-neon to-brand-lime text-black font-heading font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(0,231,0,0.5)] hover:opacity-95"
                >
                  Generate Bracket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
