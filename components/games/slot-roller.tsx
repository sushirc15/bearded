"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shuffle,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  ExternalLink,
  Flame,
  ArrowRight,
  Shield,
  Dices,
  Check,
} from "lucide-react";
import { GameItem, SLOTS_CATALOG, PROVIDERS } from "@/lib/games/provider";
import { RollState, SlotInfo } from "@/lib/db/store";
import { cn } from "@/lib/utils";

interface SlotRollerProps {
  isAdmin: boolean;
  currentRoll: RollState | null;
  lastAssignedSlot: SlotInfo | null;
  isRolling: boolean;
  onRollComplete?: (slot: SlotInfo) => void;
  onAssignSlot?: (target: "house" | "chat", slot: SlotInfo) => void;
  onUndoRoll?: () => void;
}

// Deterministic Mulberry32 PRNG for synchronized strips across viewers
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function stringToSeed(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (Math.imul(31, hash) + str.charCodeAt(i)) | 0;
  }
  return hash;
}

// Synthesized Web Audio tick
function playTick() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.035);

    gain.gain.setValueAtTime(0.06, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  } catch {
    // blocked or unavailable
  }
}

const CARD_WIDTH = 240; // px
const CARD_GAP = 16; // px
const STEP = CARD_WIDTH + CARD_GAP; // 256px
const WINNING_INDEX = 46; // index where the winning card sits in the 60-card strip
const TOTAL_CARDS = 60;

export function SlotRoller({
  isAdmin,
  currentRoll,
  lastAssignedSlot,
  isRolling: propIsRolling,
  onRollComplete,
  onAssignSlot,
  onUndoRoll,
}: SlotRollerProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>("All providers");
  const [isLocallyRolling, setIsLocallyRolling] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [activeWinner, setActiveWinner] = useState<SlotInfo | null>(
    currentRoll ? currentRoll.slot : lastAssignedSlot
  );
  const [translateX, setTranslateX] = useState<number>(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [lastProcessedRollId, setLastProcessedRollId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);
  const audioIntervalRef = useRef<NodeJS.Timeout[]>([]);

  // Check reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);
    }
  }, []);

  // Filter pool
  const filteredCatalog = useMemo(() => {
    if (selectedProvider === "All providers") return SLOTS_CATALOG;
    return SLOTS_CATALOG.filter((s) => s.provider === selectedProvider);
  }, [selectedProvider]);

  // Construct deterministic 60-card strip based on current roll or fallback
  const cardsStrip: SlotInfo[] = useMemo(() => {
    const seedString = currentRoll?.rollId || "bearded_gamer_default_seed_2026";
    const rng = mulberry32(stringToSeed(seedString));
    const pool = filteredCatalog.length > 0 ? filteredCatalog : SLOTS_CATALOG;

    const strip: SlotInfo[] = [];
    for (let i = 0; i < TOTAL_CARDS; i++) {
      if (currentRoll && i === WINNING_INDEX) {
        strip.push(currentRoll.slot);
      } else {
        const idx = Math.floor(rng() * pool.length);
        const item = pool[idx];
        strip.push({
          id: `${item.id}-${i}`,
          name: item.title,
          provider: item.provider,
          thumbnail: item.imageUrl,
          rtp: item.rtp,
          volatility: item.volatility,
          accent: item.accent,
        });
      }
    }
    return strip;
  }, [currentRoll, filteredCatalog]);

  // Execute roll animation whenever currentRoll updates
  useEffect(() => {
    if (!currentRoll || currentRoll.rollId === lastProcessedRollId) return;

    setLastProcessedRollId(currentRoll.rollId);
    setIsLocallyRolling(true);

    const containerWidth = containerRef.current?.offsetWidth || 1000;
    const centerOffset = containerWidth / 2 - CARD_WIDTH / 2;
    // Calculate final translateX so WINNING_INDEX card lands at center + jitter
    const finalTarget = -(WINNING_INDEX * STEP - centerOffset + (currentRoll.jitter || 0));

    // Clear previous audio intervals
    audioIntervalRef.current.forEach((t) => clearTimeout(t));
    audioIntervalRef.current = [];

    if (prefersReducedMotion) {
      setTranslateX(finalTarget);
      setIsLocallyRolling(false);
      setActiveWinner(currentRoll.slot);
      onRollComplete?.(currentRoll.slot);
      return;
    }

    // Schedule ticking audio that decelerates over 5.5s
    if (soundEnabled) {
      const duration = currentRoll.durationMs || 5500;
      let elapsed = 0;
      let tickInterval = 50; // ms

      const scheduleNextTick = () => {
        if (elapsed >= duration) return;
        playTick();
        // Easing curve decelerates
        const progress = elapsed / duration;
        tickInterval = 40 + Math.pow(progress, 3) * 450;
        elapsed += tickInterval;
        const timer = setTimeout(scheduleNextTick, tickInterval);
        audioIntervalRef.current.push(timer);
      };
      scheduleNextTick();
    }

    // Animate strip position
    setTranslateX(finalTarget);

    const completeTimer = setTimeout(() => {
      setIsLocallyRolling(false);
      setActiveWinner(currentRoll.slot);
      onRollComplete?.(currentRoll.slot);
    }, currentRoll.durationMs || 5500);

    return () => {
      clearTimeout(completeTimer);
      audioIntervalRef.current.forEach((t) => clearTimeout(t));
    };
  }, [currentRoll, lastProcessedRollId, prefersReducedMotion, soundEnabled, onRollComplete]);

  // Admin triggers server-authoritative roll
  async function handleRandomizeClick() {
    if (!isAdmin || isLocallyRolling || propIsRolling) return;

    try {
      setIsLocallyRolling(true);
      const res = await fetch("/api/battle/roll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider: selectedProvider === "All providers" ? undefined : selectedProvider,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to trigger roll");
      }
    } catch (err) {
      console.error(err);
      setIsLocallyRolling(false);
    }
  }

  // Admin assigns to corner
  function handleAssign(target: "house" | "chat") {
    if (!activeWinner || !isAdmin) return;
    onAssignSlot?.(target, activeWinner);
  }

  // Admin random corner
  function handleRandomCorner() {
    if (!activeWinner || !isAdmin) return;
    const target = Math.random() > 0.5 ? "house" : "chat";
    onAssignSlot?.(target, activeWinner);
  }

  const isRolling = isLocallyRolling || propIsRolling;

  return (
    <div className="relative rounded-2xl bg-surface-card/75 backdrop-blur-2xl border border-brand-neon/20 shadow-[0_20px_50px_rgba(0,0,0,0.7)] p-5 sm:p-7 overflow-hidden clip-chamfer">
      {/* Background neon swirl glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-neon/10 via-transparent to-transparent pointer-events-none" />

      {/* Top Header & Controls */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse" />
            <h3 className="font-display font-black italic text-2xl sm:text-3xl text-text-primary tracking-tight">
              RANDOM SLOT PICKER
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-text-muted">
            Roll a slot from the verified pool, then hand it to a corner.
          </p>
        </div>

        {/* Controls: Audio Toggle + Provider Filter + Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={cn(
              "px-3 py-2 rounded-xl text-xs font-mono flex items-center gap-1.5 border transition-all",
              soundEnabled
                ? "bg-brand-neon/20 text-brand-neon border-brand-neon/40 shadow-[0_0_12px_rgba(0,231,0,0.3)]"
                : "bg-surface-elevated/70 text-text-muted border-white/[0.08] hover:text-white"
            )}
            title={soundEnabled ? "Mute roll sound" : "Enable tick sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-brand-neon" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? "Sound ON" : "Sound OFF"}</span>
          </button>

          {/* Provider Select */}
          <div className="relative">
            <select
              value={selectedProvider}
              onChange={(e) => setSelectedProvider(e.target.value)}
              disabled={isRolling || !isAdmin}
              className="appearance-none px-3.5 py-2 pr-8 rounded-xl bg-surface-elevated/80 border border-brand-neon/25 text-xs font-sans text-text-primary focus:outline-none focus:border-brand-neon cursor-pointer disabled:opacity-60"
            >
              {PROVIDERS.map((p) => (
                <option key={p} value={p} className="bg-[#15110E] text-white">
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Admin Buttons: Randomize & Undo */}
          {isAdmin && (
            <>
              <button
                type="button"
                onClick={onUndoRoll}
                disabled={isRolling}
                className="px-3.5 py-2 rounded-xl bg-surface-elevated hover:bg-white/[0.08] border border-white/[0.1] text-xs font-semibold text-text-muted hover:text-text-primary transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>

              <button
                type="button"
                onClick={handleRandomizeClick}
                disabled={isRolling}
                className={cn(
                  "px-5 py-2 rounded-xl text-xs font-heading font-black tracking-wider uppercase transition-all flex items-center gap-2 text-black clip-chamfer-sm",
                  isRolling
                    ? "bg-white/10 text-white opacity-70 cursor-not-allowed"
                    : "bg-gradient-to-r from-brand-neon via-brand-lime to-brand-neon hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_25px_rgba(0,231,0,0.5)]"
                )}
              >
                <Shuffle className={cn("w-4 h-4", isRolling && "animate-spin")} />
                <span>{isRolling ? "ROLLING..." : "RANDOMIZE"}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Roller Reel Section */}
      <div className="relative my-6 select-none" ref={containerRef}>
        {/* Center Glowing Indicator Line with Top and Bottom Triangles */}
        <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[3px] bg-gradient-to-b from-brand-neon via-brand-lime to-brand-neon z-30 pointer-events-none shadow-[0_0_16px_rgba(0,231,0,0.95)]">
          {/* Top Triangle */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-t-[9px] border-t-brand-lime drop-shadow-[0_0_8px_rgba(0,231,0,0.9)]" />
          {/* Bottom Triangle */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[7px] border-l-transparent border-r-[7px] border-r-transparent border-b-[9px] border-b-brand-lime drop-shadow-[0_0_8px_rgba(0,231,0,0.9)]" />
        </div>

        {/* Edge Fade Masks (Left & Right) */}
        <div className="absolute inset-y-0 left-0 w-24 sm:w-36 bg-gradient-to-r from-[#15110E] via-[#15110E]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 sm:w-36 bg-gradient-to-l from-[#15110E] via-[#15110E]/80 to-transparent z-20 pointer-events-none" />

        {/* Roller Cards Strip */}
        <div className="overflow-hidden py-3">
          <div
            ref={stripRef}
            className="flex items-center"
            style={{
              transform: `translate3d(${translateX}px, 0, 0)`,
              transition: isRolling
                ? `transform ${currentRoll?.durationMs || 5500}ms cubic-bezier(0.12, 0.8, 0.18, 1)`
                : "none",
              willChange: "transform",
            }}
          >
            {cardsStrip.map((slot, index) => {
              const isWinner = index === WINNING_INDEX && !isRolling && activeWinner;
              return (
                <div
                  key={`${slot.id}-${index}`}
                  style={{ width: `${CARD_WIDTH}px`, marginRight: `${CARD_GAP}px` }}
                  className={cn(
                    "shrink-0 h-[220px] rounded-2xl bg-surface-elevated/90 border transition-all duration-300 relative overflow-hidden flex flex-col justify-between p-3.5",
                    isWinner
                      ? "border-brand-neon shadow-[0_0_25px_rgba(0,231,0,0.55)] ring-2 ring-brand-neon/60 scale-[1.03]"
                      : "border-white/[0.08] hover:border-white/20"
                  )}
                >
                  {/* Slot Thumbnail Background */}
                  <div className="absolute inset-0 z-0">
                    {slot.thumbnail ? (
                      <Image
                        src={slot.thumbnail}
                        alt={slot.name}
                        fill
                        sizes="240px"
                        className="object-cover opacity-50 transition-opacity"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-brand-ember/20 via-surface to-surface-elevated" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#15110E] via-[#15110E]/70 to-transparent" />
                  </div>

                  {/* Top info badge */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-black/60 border border-white/10 text-brand-amber uppercase tracking-wider">
                      {slot.provider}
                    </span>
                    {slot.volatility && (
                      <span className="text-[9px] font-mono text-text-muted uppercase">
                        {slot.volatility}
                      </span>
                    )}
                  </div>

                  {/* Bottom title & RTP */}
                  <div className="relative z-10">
                    <h4 className="font-display font-black text-lg text-white leading-tight line-clamp-2">
                      {slot.name}
                    </h4>
                    {slot.rtp && (
                      <div className="text-[10px] text-text-muted font-mono mt-1 flex items-center gap-1.5">
                        <span className="text-brand-lime">RTP {slot.rtp}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reveal Bar: Hand to Corner (Admin Action After Roll) */}
      <AnimatePresence>
        {activeWinner && !isRolling && isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="p-4 rounded-xl bg-surface-elevated/90 border border-brand-neon/30 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-[0_0_20px_rgba(0,231,0,0.2)]"
          >
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-neon animate-ping" />
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-text-muted">
                  Rolled Winner:
                </span>
                <span className="ml-2 font-display font-black text-white text-base">
                  {activeWinner.name}
                </span>
                <span className="ml-2 text-xs text-brand-lime font-mono">
                  ({activeWinner.provider})
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => handleAssign("house")}
                className="px-3.5 py-1.5 rounded-lg bg-brand-neon/20 hover:bg-brand-neon/30 border border-brand-neon/50 text-xs font-mono font-bold text-white transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(0,231,0,0.25)]"
              >
                <span>&rarr; The Bearded Gamer</span>
              </button>

              <button
                type="button"
                onClick={() => handleAssign("chat")}
                className="px-3.5 py-1.5 rounded-lg bg-brand-lime/15 hover:bg-brand-lime/25 border border-brand-lime/40 text-xs font-mono font-bold text-brand-lime transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(182,255,59,0.25)]"
              >
                <span>&rarr; Chat challenger</span>
              </button>

              <button
                type="button"
                onClick={handleRandomCorner}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-text-muted hover:text-white transition-all flex items-center gap-1"
              >
                <Dices className="w-3.5 h-3.5" />
                <span>Random corner</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info line */}
      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-text-muted font-mono">
        <span>8,782 slots in the pool · all providers</span>
        <span className="hidden sm:inline">
          Server-synced with stream · Seed-verified PRNG
        </span>
      </div>
    </div>
  );
}
