"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shuffle,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Flame,
  Check,
  Play,
  SlidersHorizontal,
  ExternalLink,
} from "lucide-react";
import { GAMBA_SLOTS, GambaSlot } from "@/config/gamba-slots";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface SlotPickerProps {
  onAssignToHouse?: (slot: GambaSlot) => void;
  onAssignToChat?: (slot: GambaSlot) => void;
  onAssignToBracket?: (slot: GambaSlot) => void;
}

export function SlotPicker({
  onAssignToHouse,
  onAssignToChat,
  onAssignToBracket,
}: SlotPickerProps) {
  const [selectedProvider, setSelectedProvider] = useState<string>("all");
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [history, setHistory] = useState<number[]>([]);
  const reelRef = useRef<HTMLDivElement>(null);

  // Filter slots
  const filteredSlots = React.useMemo(() => {
    if (selectedProvider === "all") return GAMBA_SLOTS;
    if (selectedProvider === "only-gamba")
      return GAMBA_SLOTS.filter((s) => s.isOnlyGamba);
    return GAMBA_SLOTS.filter((s) => s.category === selectedProvider);
  }, [selectedProvider]);

  // Repeated slots list for infinite carousel illusion (3x copies)
  const displaySlots = React.useMemo(() => {
    return [...filteredSlots, ...filteredSlots, ...filteredSlots];
  }, [filteredSlots]);

  const activeSlot = filteredSlots[selectedIndex % filteredSlots.length];

  // Randomize roll animation
  function handleRandomize() {
    if (isSpinning || filteredSlots.length === 0) return;
    setIsSpinning(true);

    // Save previous to history
    setHistory((prev) => [...prev, selectedIndex]);

    // Pick new random target index
    const randomIndex = Math.floor(Math.random() * filteredSlots.length);
    const cardWidth = 196; // 180px + 16px gap
    const extraSpins = filteredSlots.length * 2;
    const targetOffsetIndex = extraSpins + randomIndex;

    // Scroll reel
    if (reelRef.current) {
      const containerWidth = reelRef.current.offsetWidth;
      const targetScroll =
        targetOffsetIndex * cardWidth - containerWidth / 2 + cardWidth / 2;

      reelRef.current.scrollTo({
        left: targetScroll,
        behavior: "smooth",
      });
    }

    setTimeout(() => {
      setSelectedIndex(randomIndex);
      setIsSpinning(false);
    }, 1800);
  }

  // Undo to previous roll
  function handleUndo() {
    if (history.length === 0) return;
    const prevIndex = history[history.length - 1];
    setHistory((prev) => prev.slice(0, -1));
    setSelectedIndex(prevIndex);
  }

  return (
    <div className="rounded-3xl p-6 sm:p-8 bg-[#0d141c]/80 backdrop-blur-2xl border border-brand-neon/25 shadow-card relative overflow-hidden">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <h3 className="font-heading font-black text-xl sm:text-2xl text-white tracking-tight flex items-center gap-2">
            <span>RANDOM SLOT PICKER</span>
          </h3>
          <p className="text-xs sm:text-sm text-text-muted mt-0.5">
            Roll a slot, then hand it to a corner.
          </p>
        </div>

        {/* Action Controls (Screenshot 3: Randomize / Undo) */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleRandomize}
            disabled={isSpinning}
            className="px-5 py-2.5 rounded-xl bg-brand-neon hover:bg-brand-lime text-black font-heading font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-glow hover:scale-105 transition-all disabled:opacity-50 select-none"
          >
            <Shuffle className="w-4 h-4" />
            <span>{isSpinning ? "Rolling..." : "Randomize"}</span>
          </button>

          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            className="px-4 py-2.5 rounded-xl bg-[#5B21B6]/60 hover:bg-[#5B21B6] border border-[#7C3AED]/50 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors disabled:opacity-30 disabled:pointer-events-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
        </div>
      </div>

      {/* 2. Horizontal Reel Carousel with Center Laser Indicator (Screenshot 3) */}
      <div className="relative my-8">
        {/* Center Vertical Laser Line with Top/Bottom Pointers */}
        <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center justify-between">
          {/* Top Pointer */}
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-brand-neon filter drop-shadow-[0_0_6px_#00E700]" />
          {/* Glowing Center Line */}
          <div className="w-[2px] h-full bg-gradient-to-b from-brand-neon via-brand-lime to-brand-neon shadow-[0_0_12px_#00E700]" />
          {/* Bottom Pointer */}
          <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[8px] border-b-brand-neon filter drop-shadow-[0_0_6px_#00E700]" />
        </div>

        {/* Carousel Reel Track */}
        <div
          ref={reelRef}
          className="overflow-x-auto scrollbar-none py-4 px-[35%] flex gap-4 scroll-smooth"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {displaySlots.map((slot, idx) => {
            const isCenter = slot.id === activeSlot?.id;
            return (
              <motion.div
                key={`${slot.id}-${idx}`}
                whileHover={{ scale: 1.03 }}
                onClick={() => setSelectedIndex(idx % filteredSlots.length)}
                className={cn(
                  "relative w-44 h-56 rounded-2xl overflow-hidden shrink-0 border cursor-pointer select-none transition-all duration-300 flex flex-col justify-end p-4",
                  isCenter
                    ? "border-brand-neon shadow-glow-lg scale-105 z-20 ring-2 ring-brand-neon/60"
                    : "border-white/10 opacity-70 hover:opacity-100 hover:border-brand-neon/40"
                )}
                style={{ background: slot.bgGradient }}
              >
                {/* Visual Icon / Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                  <Flame className="w-24 h-24 text-white" />
                </div>

                {/* Top Badge */}
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1">
                  <span
                    className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider text-black shadow-sm"
                    style={{ backgroundColor: slot.accentColor }}
                  >
                    {slot.provider}
                  </span>
                </div>

                {/* Slot Details Overlay */}
                <div className="relative z-10 text-center">
                  <h4 className="font-heading font-black text-sm text-white uppercase leading-tight line-clamp-2 drop-shadow-md">
                    {slot.name}
                  </h4>
                  <div className="flex items-center justify-center gap-2 text-[10px] font-mono text-brand-lime mt-1.5">
                    <span>RTP: {slot.rtp}</span>
                    <span>•</span>
                    <span>{slot.maxWin}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. Hand-To-Corner Selection Box */}
      {activeSlot && (
        <div className="p-4 rounded-2xl bg-surface-elevated/60 border border-brand-neon/30 flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 text-center md:text-left">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-heading font-black text-black shadow-glow"
              style={{ backgroundColor: activeSlot.accentColor }}
            >
              <Check className="w-5 h-5 text-black stroke-[3]" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-brand-neon font-bold block">
                SELECTED GAMBA SLOT
              </span>
              <p className="font-heading font-black text-base text-white">
                {activeSlot.name}{" "}
                <span className="text-xs text-text-muted font-normal font-mono">
                  ({activeSlot.provider})
                </span>
              </p>
            </div>
          </div>

          {/* Assignment Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {onAssignToHouse && (
              <button
                onClick={() => onAssignToHouse(activeSlot)}
                className="px-3.5 py-1.5 rounded-xl bg-brand-neon/15 hover:bg-brand-neon text-brand-neon hover:text-black border border-brand-neon/40 text-xs font-heading font-bold uppercase tracking-wider transition-all"
              >
                Send to House
              </button>
            )}

            {onAssignToChat && (
              <button
                onClick={() => onAssignToChat(activeSlot)}
                className="px-3.5 py-1.5 rounded-xl bg-[#7C3AED]/20 hover:bg-[#7C3AED] text-[#C084FC] hover:text-white border border-[#7C3AED]/40 text-xs font-heading font-bold uppercase tracking-wider transition-all"
              >
                Send to Chat
              </button>
            )}

            {onAssignToBracket && (
              <button
                onClick={() => onAssignToBracket(activeSlot)}
                className="px-3.5 py-1.5 rounded-xl bg-surface-card hover:bg-white/10 text-white border border-white/15 text-xs font-heading font-bold uppercase tracking-wider transition-all"
              >
                Add to Tournament
              </button>
            )}

            <a
              href={siteConfig.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-brand text-black font-heading font-black text-xs uppercase tracking-wider flex items-center gap-1 shadow-glow hover:scale-105 transition-all"
            >
              <span>Play on Gamba</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* 4. Subtext & Provider Filter Chips (Screenshot 3) */}
      <div className="space-y-4 pt-4 border-t border-white/[0.08]">
        <div className="text-center text-xs text-text-muted font-mono">
          <span className="text-brand-neon font-bold">7,450 slots in the pool</span> · all providers
        </div>

        {/* Filter by Provider */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs font-mono uppercase text-text-muted tracking-wider flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-brand-neon" />
            FILTER BY PROVIDER
          </span>

          <div className="flex flex-wrap items-center gap-1.5 justify-center">
            {[
              { id: "all", label: "All slots 7,450" },
              { id: "only-gamba", label: "Only on Gamba 3,500" },
              { id: "pragmatic", label: "Pragmatic Play" },
              { id: "hacksaw", label: "Hacksaw Gaming" },
              { id: "nolimit", label: "Nolimit City" },
              { id: "relax", label: "Relax Gaming" },
              { id: "push", label: "Push Gaming" },
            ].map((p) => {
              const isActive = selectedProvider === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedProvider(p.id)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-[11px] font-heading font-bold transition-all select-none border",
                    isActive
                      ? "bg-brand-neon text-black border-brand-neon shadow-glow"
                      : "bg-surface-card hover:bg-white/5 text-text-muted hover:text-white border-white/5"
                  )}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <p className="text-[11px] text-text-faint text-center">
          7,450 slots from Gamba&apos;s catalogue · updated 2026-10-28. Some games may be unavailable in your region.
        </p>
      </div>
    </div>
  );
}
