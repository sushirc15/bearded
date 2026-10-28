"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface GamerAvatarProps {
  username: string;
  rank?: number;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const AVATAR_PALETTES = [
  { bg: "#102914", stroke: "#00E700", visor: "#BDF76B", text: "#00E700" }, // Neon 1st
  { bg: "#1B2228", stroke: "#C9D1D9", visor: "#E6EDF3", text: "#C9D1D9" }, // Silver 2nd
  { bg: "#281D14", stroke: "#CD7F32", visor: "#FFA654", text: "#CD7F32" }, // Bronze 3rd
  { bg: "#2A1418", stroke: "#E5383B", visor: "#FF6B6B", text: "#E5383B" }, // Crimson
  { bg: "#1F1A2C", stroke: "#A371F7", visor: "#D2A8FF", text: "#A371F7" }, // Purple
  { bg: "#112224", stroke: "#2DD4BF", visor: "#5EEAD4", text: "#2DD4BF" }, // Teal
];

export function GamerAvatar({ username, rank, size = "md", className }: GamerAvatarProps) {
  // Deterministic color selection from username or rank
  const paletteIndex = rank ? (rank - 1) % AVATAR_PALETTES.length : (username.charCodeAt(0) || 0) % AVATAR_PALETTES.length;
  const palette = AVATAR_PALETTES[paletteIndex];

  const sizeClasses = {
    sm: "w-8 h-8 text-[11px]",
    md: "w-11 h-11 text-xs",
    lg: "w-16 h-16 text-base",
    xl: "w-24 h-24 sm:w-28 sm:h-28 text-2xl",
  };

  const initial = username ? username.replace(/\*/g, "")[0]?.toUpperCase() || "B" : "B";

  return (
    <div
      className={cn(
        "relative rounded-full flex items-center justify-center font-heading font-black select-none shrink-0 overflow-hidden border-2 shadow-inner",
        sizeClasses[size],
        className
      )}
      style={{
        background: `radial-gradient(circle at 35% 30%, ${palette.bg} 0%, #060806 85%)`,
        borderColor: palette.stroke,
        boxShadow: `0 0 16px ${palette.stroke}40, inset 0 0 12px ${palette.stroke}30`,
      }}
    >
      {/* Cyber Grid Mask Overlay */}
      <div
        className="absolute inset-0 opacity-25 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, ${palette.stroke} 1px, transparent 1px), linear-gradient(to bottom, ${palette.stroke} 1px, transparent 1px)`,
          backgroundSize: "6px 6px",
        }}
      />

      {/* Cyber Visor Glow Accent */}
      <div
        className="absolute top-2 inset-x-2 h-1/3 rounded-full opacity-60 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at center, ${palette.visor} 0%, transparent 80%)`,
        }}
      />

      {/* Center Initials with Neon Glow */}
      <span
        className="relative z-10 font-mono tracking-wider drop-shadow-[0_0_8px_rgba(0,231,0,0.8)]"
        style={{ color: palette.text }}
      >
        {initial}
      </span>
    </div>
  );
}
