"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Gamepad2, Sparkles, Flame, Trophy, Swords, Dices } from "lucide-react";
import { GameItem, TournamentItem, gamesProvider } from "@/lib/games/provider";
import { TournamentBracket } from "./tournament-bracket";
import { SlotBattles } from "./slot-battles";
import { SlotPicker } from "./slot-picker";
import { TournamentsGrid } from "./tournaments-grid";
import { GamesGrid } from "./games-grid";
import { CodeChip } from "@/components/ui/code-chip";
import { sectionRevealVariants, childRevealVariants } from "@/lib/motion";
import { GambaSlot } from "@/config/gamba-slots";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function GamesView() {
  const [activeTab, setActiveTab] = useState<"tournaments" | "battles" | "library">("tournaments");
  const [games, setGames] = useState<GameItem[]>([]);
  const [tournaments, setTournaments] = useState<TournamentItem[]>([]);
  const [houseSlot, setHouseSlot] = useState<GambaSlot | null>(null);
  const [chatSlot, setChatSlot] = useState<GambaSlot | null>(null);

  // Sync tab with URL search params on mount & popstate
  useEffect(() => {
    function readTabFromUrl() {
      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const tab = params.get("tab");
        if (tab === "battles") {
          setActiveTab("battles");
        } else if (tab === "tournaments") {
          setActiveTab("tournaments");
        } else if (tab === "library") {
          setActiveTab("library");
        }
      }
    }

    readTabFromUrl();
    window.addEventListener("popstate", readTabFromUrl);
    return () => window.removeEventListener("popstate", readTabFromUrl);
  }, []);

  // Set tab and update URL without full page reload
  function handleTabChange(tab: "tournaments" | "battles" | "library") {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      window.history.pushState({}, "", url.toString());
    }
  }

  useEffect(() => {
    async function loadData() {
      try {
        const [g, t] = await Promise.all([
          gamesProvider.getGames(),
          gamesProvider.getTournaments(),
        ]);
        setGames(g);
        setTournaments(t);
      } catch (err) {
        console.error("Games provider error", err);
      }
    }
    loadData();
  }, []);

  return (
    <motion.div
      variants={sectionRevealVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12 sm:space-y-16"
    >
      {/* 1. Page Header */}
      <motion.div variants={childRevealVariants} className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-neon/15 border border-brand-neon/30 text-brand-neon text-xs font-heading font-black uppercase tracking-wider mb-4">
          <Gamepad2 className="w-4 h-4 text-brand-neon" />
          <span>Gamba Arena &amp; Tournaments</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-black tracking-tight text-text-primary mb-4">
          Slots &amp; Tournament Arena
        </h1>

        <p className="text-base sm:text-lg text-text-muted leading-relaxed mb-6">
          Build interactive single-elimination tournament brackets, roll slots with the live random picker, and battle head-to-head on Gamba with code <strong className="text-brand-neon font-mono">{siteConfig.code}</strong>.
        </p>

        <div className="flex justify-center mb-8">
          <CodeChip showPulsingGlow={true} />
        </div>

        {/* 2. Top View Switcher Tabs (Screenshot 1: Tournaments vs Slot Battles) */}
        <div className="inline-flex p-1.5 rounded-2xl bg-[#0f171f]/80 backdrop-blur-xl border border-brand-neon/20 shadow-card gap-1">
          <button
            onClick={() => handleTabChange("tournaments")}
            className={cn(
              "px-5 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all select-none",
              activeTab === "tournaments"
                ? "bg-brand-neon text-black shadow-glow"
                : "text-text-muted hover:text-white hover:bg-white/5"
            )}
          >
            <Trophy className="w-4 h-4 fill-current" />
            <span>Tournaments Bracket</span>
          </button>

          <button
            onClick={() => handleTabChange("battles")}
            className={cn(
              "px-5 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 transition-all select-none",
              activeTab === "battles"
                ? "bg-brand-neon text-black shadow-glow"
                : "text-text-muted hover:text-white hover:bg-white/5"
            )}
          >
            <Swords className="w-4 h-4" />
            <span>Slot Battles &amp; Picker</span>
          </button>

          <button
            onClick={() => handleTabChange("library")}
            className={cn(
              "hidden sm:flex px-5 py-2.5 rounded-xl font-heading font-black text-xs uppercase tracking-wider items-center gap-2 transition-all select-none",
              activeTab === "library"
                ? "bg-brand-neon text-black shadow-glow"
                : "text-text-muted hover:text-white hover:bg-white/5"
            )}
          >
            <Flame className="w-4 h-4" />
            <span>All Gamba Slots</span>
          </button>
        </div>
      </motion.div>

      {/* 3. TOURNAMENTS VIEW (Screenshot 2: media_1793198847611_bfda9c62.png) */}
      {activeTab === "tournaments" && (
        <motion.div
          key="tab-tournaments"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="space-y-12"
        >
          {/* Tournament Bracket Component */}
          <section className="rounded-3xl p-6 sm:p-10 bg-surface-card/60 backdrop-blur-2xl border border-brand-neon/25 shadow-card">
            <TournamentBracket />
          </section>

          {/* Active Gamba Races Grid */}
          <section>
            <TournamentsGrid tournaments={tournaments} />
          </section>
        </motion.div>
      )}

      {/* 4. SLOT BATTLES & RANDOM PICKER VIEW (Screenshot 3 & 4) */}
      {activeTab === "battles" && (
        <motion.div
          key="tab-battles"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="space-y-12"
        >
          {/* Head-to-Head Slot Battles (Screenshot 4: The House vs Chat) */}
          <section>
            <div className="mb-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-neon/15 text-brand-neon text-xs font-heading font-black uppercase tracking-wider mb-2 border border-brand-neon/30">
                <Swords className="w-3.5 h-3.5" />
                <span>Head-to-Head Showdown</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-heading font-black text-text-primary tracking-tight">
                The Bearded Gamer vs Chat
              </h2>
            </div>

            <SlotBattles
              initialHouseSlot={houseSlot}
              initialChatSlot={chatSlot}
            />
          </section>

          {/* Random Slot Picker Carousel (Screenshot 3: media_1793198890340_1c502d51.png) */}
          <section>
            <SlotPicker
              onAssignToHouse={(slot) => setHouseSlot(slot)}
              onAssignToChat={(slot) => setChatSlot(slot)}
            />
          </section>
        </motion.div>
      )}

      {/* 5. GAMBA SLOTS LIBRARY VIEW */}
      {activeTab === "library" && (
        <motion.div
          key="tab-library"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="space-y-8"
        >
          <div className="mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-neon/15 text-brand-neon text-xs font-heading font-black uppercase tracking-wider mb-2 border border-brand-neon/30">
              <Flame className="w-3.5 h-3.5" />
              <span>Gamba Library</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-text-primary tracking-tight">
              Popular Community Slots
            </h2>
          </div>

          <GamesGrid initialGames={games} />
        </motion.div>
      )}

      {/* API Notice */}
      <motion.div
        variants={childRevealVariants}
        className="p-6 rounded-2xl bg-surface-card/60 backdrop-blur-xl border border-white/[0.08] text-xs text-text-muted"
      >
        <span className="font-mono text-brand-neon font-bold">Gamba Arena Integration: </span>
        All tournaments, slot battles, and random picker draws are configured with code{" "}
        <strong className="text-brand-neon font-mono">{siteConfig.code}</strong>.
      </motion.div>
    </motion.div>
  );
}
