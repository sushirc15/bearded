"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Trophy,
  Crown,
  RotateCcw,
  Plus,
  ArrowRight,
  Shuffle,
  ExternalLink,
  Flame,
  Check,
} from "lucide-react";
import { GAMBA_SLOTS, GambaSlot } from "@/config/gamba-slots";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface BracketState {
  seeds: string[];
  quarterfinals: (string | null)[]; // 8 slots (4 pairs)
  semifinals: (string | null)[]; // 4 slots (2 pairs)
  finalists: (string | null)[]; // 2 slots (1 pair)
  champion: string | null;
}

const DEFAULT_SEEDS = [
  "Gates of Olympus 1000",
  "Wanted Dead or a Wild",
  "Sweet Bonanza 1000",
  "Chaos Crew 2",
  "San Quentin xWays",
  "Mental",
  "Banana Town",
  "Razor Returns",
];

export function TournamentBracket() {
  const [seeds, setSeeds] = useState<string[]>(DEFAULT_SEEDS);
  const [semifinals, setSemifinals] = useState<(string | null)[]>([null, null, null, null]);
  const [finalists, setFinalists] = useState<(string | null)[]>([null, null]);
  const [champion, setChampion] = useState<string | null>(null);

  // History for Undo
  const [history, setHistory] = useState<BracketState[]>([]);

  function saveHistory() {
    setHistory((prev) => [
      ...prev,
      {
        seeds: [...seeds],
        quarterfinals: [...seeds],
        semifinals: [...semifinals],
        finalists: [...finalists],
        champion,
      },
    ]);
  }

  // Handle typing a slot name in the SLOT column
  function handleSeedChange(index: number, value: string) {
    saveHistory();
    const newSeeds = [...seeds];
    newSeeds[index] = value;
    setSeeds(newSeeds);
  }

  // Handle rolling a random Gamba slot into a specific seed
  function handleRollSlot(index: number) {
    saveHistory();
    const randomSlot = GAMBA_SLOTS[Math.floor(Math.random() * GAMBA_SLOTS.length)];
    const newSeeds = [...seeds];
    newSeeds[index] = randomSlot.name;
    setSeeds(newSeeds);
  }

  // Randomize all 8 slots from Gamba
  function handleRandomizeAll() {
    saveHistory();
    const shuffled = [...GAMBA_SLOTS].sort(() => Math.random() - 0.5);
    const newSeeds = shuffled.slice(0, 8).map((s) => s.name);
    setSeeds(newSeeds);
    setSemifinals([null, null, null, null]);
    setFinalists([null, null]);
    setChampion(null);
  }

  // Reset entire bracket
  function handleNewBracket() {
    saveHistory();
    setSeeds(DEFAULT_SEEDS);
    setSemifinals([null, null, null, null]);
    setFinalists([null, null]);
    setChampion(null);
  }

  // Undo last action
  function handleUndo() {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setSeeds(last.seeds);
    setSemifinals(last.semifinals);
    setFinalists(last.finalists);
    setChampion(last.champion);
  }

  // Advance from Quarterfinals to Semifinals
  function handleAdvanceToSemi(matchIndex: number, slotName: string) {
    if (!slotName || slotName.trim() === "") return;
    saveHistory();
    const newSemis = [...semifinals];
    newSemis[matchIndex] = slotName;
    setSemifinals(newSemis);
  }

  // Advance from Semifinals to Final
  function handleAdvanceToFinal(finalIndex: number, slotName: string) {
    if (!slotName || slotName.trim() === "") return;
    saveHistory();
    const newFinals = [...finalists];
    newFinals[finalIndex] = slotName;
    setFinalists(newFinals);
  }

  // Crown Champion
  function handleCrownChampion(slotName: string) {
    if (!slotName || slotName.trim() === "") return;
    saveHistory();
    setChampion(slotName);

    try {
      confetti({
        particleCount: 140,
        spread: 85,
        origin: { y: 0.6 },
        colors: ["#00E700", "#BDF76B", "#FFC83D", "#FFFFFF"],
      });
    } catch {
      // safe fallback
    }
  }

  return (
    <div className="space-y-6">
      {/* 1. Top Controls Bar (Screenshot 2: media_1793198847611_bfda9c62.png) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-neon/20">
        <div>
          <h3 className="font-heading font-black text-2xl text-white tracking-tight flex items-center gap-2">
            <span>TOURNAMENT BRACKET</span>
          </h3>
          <p className="text-xs text-text-muted mt-0.5">
            Type slot names in the left column, then click the green arrow buttons to advance winners round-by-round.
          </p>
        </div>

        {/* Action Buttons: Undo / New Bracket / Randomize */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="px-4 py-2 rounded-xl bg-[#5B21B6]/60 hover:bg-[#5B21B6] border border-[#7C3AED]/40 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-30 disabled:pointer-events-none select-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>

          <button
            onClick={handleRandomizeAll}
            className="px-4 py-2 rounded-xl bg-surface-card hover:bg-surface-elevated border border-white/10 hover:border-brand-neon/40 text-xs font-heading font-bold text-text-primary flex items-center gap-1.5 transition-colors select-none"
          >
            <Shuffle className="w-3.5 h-3.5 text-brand-amber" />
            <span>Randomize All</span>
          </button>

          <button
            onClick={handleNewBracket}
            className="px-5 py-2 rounded-xl bg-brand-neon hover:bg-brand-lime text-black font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-glow hover:scale-105 transition-all select-none"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>New bracket</span>
          </button>
        </div>
      </div>

      {/* 2. Champion Celebration Card */}
      <AnimatePresence>
        {champion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="p-6 rounded-3xl bg-gradient-to-r from-brand-neon/20 via-surface-card to-brand-amber/20 border-2 border-brand-neon shadow-glow-lg flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-14 h-14 rounded-2xl bg-brand-neon text-black flex items-center justify-center shrink-0 shadow-glow">
                <Crown className="w-8 h-8 fill-current animate-bounce" />
              </div>
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-brand-neon font-bold block">
                  TOURNAMENT CHAMPION CROWNED
                </span>
                <h4 className="text-2xl font-heading font-black text-white">{champion}</h4>
                <p className="text-xs text-text-muted mt-0.5">
                  Winner of the 8-Slot Showdown on Gamba
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={siteConfig.affiliateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-xl bg-brand-neon text-black font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow hover:scale-105 transition-transform"
              >
                <span>Play {champion} on Gamba</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={handleNewBracket}
                className="px-4 py-2.5 rounded-xl bg-surface-elevated hover:bg-white/10 border border-white/10 text-xs font-heading font-bold text-text-primary uppercase tracking-wider transition-colors"
              >
                Reset Bracket
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. The 5-Column Single-Elimination Bracket Tree (Screenshot 2) */}
      <div className="overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-brand-neon/30">
        <div className="min-w-[1020px] grid grid-cols-5 gap-4 items-center">
          {/* COLUMN 1: SLOT (Editable slot name inputs) */}
          <div className="space-y-4">
            <div className="text-center pb-2">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-brand-neon">
                SLOT
              </span>
            </div>

            <div className="space-y-3">
              {seeds.map((slotName, i) => (
                <div
                  key={`slot-input-${i}`}
                  className="relative group rounded-xl bg-[#131d2a]/90 border border-white/10 focus-within:border-brand-neon focus-within:shadow-glow transition-all"
                >
                  <input
                    type="text"
                    value={slotName}
                    onChange={(e) => handleSeedChange(i, e.target.value)}
                    placeholder={`Slot ${i + 1}`}
                    className="w-full py-2.5 pl-3 pr-8 rounded-xl bg-transparent text-xs font-heading font-bold text-white placeholder:text-text-faint focus:outline-none"
                  />
                  <button
                    onClick={() => handleRollSlot(i)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-brand-neon transition-colors"
                    title="Roll random Gamba slot"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* COLUMN 2: QUARTERFINALS (8 pills with arrows, in 4 pairs) */}
          <div className="space-y-4">
            <div className="text-center pb-2">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-brand-neon">
                QUARTERFINALS
              </span>
            </div>

            <div className="space-y-3">
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                const slotName = seeds[i];
                const semiMatchIndex = Math.floor(i / 2);
                const isAdvanced = semifinals[semiMatchIndex] === slotName && slotName !== "";

                return (
                  <div
                    key={`qf-${i}`}
                    className={cn(
                      "group p-2.5 rounded-xl border transition-all duration-200 flex items-center justify-between select-none",
                      isAdvanced
                        ? "bg-brand-neon/20 border-brand-neon shadow-glow text-white"
                        : "bg-[#162030]/85 border-white/10 hover:border-brand-neon/50 text-text-primary"
                    )}
                  >
                    <span className="font-heading font-bold text-xs truncate pr-2">
                      {slotName || `Slot ${i + 1}`}
                    </span>

                    <button
                      onClick={() => handleAdvanceToSemi(semiMatchIndex, slotName)}
                      className="p-1 rounded-lg bg-surface-card hover:bg-brand-neon text-text-muted hover:text-black transition-colors shrink-0"
                      title="Advance winner to Semifinals"
                    >
                      <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 3: SEMIFINALS (4 pills with arrows, in 2 pairs) */}
          <div className="space-y-4">
            <div className="text-center pb-2">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-brand-neon">
                SEMIFINALS
              </span>
            </div>

            <div className="flex flex-col justify-around h-[390px]">
              {[0, 1, 2, 3].map((i) => {
                const slotName = semifinals[i];
                const finalMatchIndex = Math.floor(i / 2);
                const isAdvanced = finalists[finalMatchIndex] === slotName && slotName !== null;

                return (
                  <div
                    key={`semi-${i}`}
                    className={cn(
                      "p-3 rounded-xl border transition-all duration-200 flex items-center justify-between select-none",
                      isAdvanced
                        ? "bg-brand-neon/20 border-brand-neon shadow-glow text-white"
                        : slotName
                        ? "bg-[#182333]/90 border-brand-neon/40 text-white"
                        : "bg-[#111924]/60 border-dashed border-white/10 text-text-faint"
                    )}
                  >
                    <span className="font-heading font-bold text-xs truncate pr-2">
                      {slotName || "—"}
                    </span>

                    {slotName && (
                      <button
                        onClick={() => handleAdvanceToFinal(finalMatchIndex, slotName)}
                        className="p-1 rounded-lg bg-surface-card hover:bg-brand-neon text-text-muted hover:text-black transition-colors shrink-0"
                        title="Advance winner to Finals"
                      >
                        <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 4: FINAL (2 pills with arrows) */}
          <div className="space-y-4">
            <div className="text-center pb-2">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-brand-neon">
                FINAL
              </span>
            </div>

            <div className="flex flex-col justify-around h-[390px]">
              {[0, 1].map((i) => {
                const slotName = finalists[i];
                const isChampion = champion === slotName && slotName !== null;

                return (
                  <div
                    key={`final-${i}`}
                    className={cn(
                      "p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between select-none",
                      isChampion
                        ? "bg-brand-amber/25 border-brand-amber shadow-glow-lg text-white"
                        : slotName
                        ? "bg-[#1c293d]/90 border-brand-neon/50 text-white"
                        : "bg-[#111924]/60 border-dashed border-white/10 text-text-faint"
                    )}
                  >
                    <span className="font-heading font-bold text-xs truncate pr-2">
                      {slotName || "—"}
                    </span>

                    {slotName && (
                      <button
                        onClick={() => handleCrownChampion(slotName)}
                        className="p-1 rounded-lg bg-surface-card hover:bg-brand-amber text-text-muted hover:text-black transition-colors shrink-0"
                        title="Crown as Champion"
                      >
                        <Crown className="w-3.5 h-3.5 fill-current" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* COLUMN 5: CHAMPION (Golden Trophy Card) */}
          <div className="space-y-4">
            <div className="text-center pb-2">
              <span className="font-mono text-xs font-black uppercase tracking-wider text-[#FFC83D]">
                CHAMPION
              </span>
            </div>

            <div className="flex flex-col items-center justify-center h-[390px]">
              <div
                className={cn(
                  "w-full p-5 rounded-2xl border-2 text-center transition-all duration-300 flex flex-col items-center justify-center select-none",
                  champion
                    ? "bg-gradient-to-b from-[#241D0E] to-[#120F08] border-[#FFC83D] shadow-[0_0_35px_rgba(255,200,61,0.4)]"
                    : "bg-[#111924]/50 border-dashed border-[#FFC83D]/30"
                )}
              >
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl mb-3 flex items-center justify-center",
                    champion
                      ? "bg-gradient-to-br from-[#FFC83D] to-[#D97706] text-black shadow-glow"
                      : "bg-white/5 text-text-faint"
                  )}
                >
                  <Trophy className="w-6 h-6 fill-current" />
                </div>

                <span className="text-[10px] font-mono uppercase tracking-widest text-text-muted block mb-1">
                  CROWNED WINNER
                </span>

                <h4 className="font-heading font-black text-sm text-white mb-3 max-w-full truncate">
                  {champion || "—"}
                </h4>

                {champion ? (
                  <a
                    href={siteConfig.affiliateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-1.5 px-3 rounded-lg bg-[#FFC83D] text-black font-heading font-black text-[11px] uppercase tracking-wider flex items-center justify-center gap-1 shadow-glow"
                  >
                    <span>Play on Gamba</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-[10px] font-mono text-text-faint">
                    Advance finalists to crown
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
