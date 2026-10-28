"use client";

import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import confetti from "canvas-confetti";
import { Sparkles, Trophy, RotateCw } from "lucide-react";
import { MagneticButton } from "@/components/ui/magnetic-button";

export interface WheelSegment {
  label: string;
  amount: string;
  color: string;
  textColor: string;
}

const DEFAULT_SEGMENTS: WheelSegment[] = [
  { label: "$25 Bonus Buy", amount: "$25", color: "#00E700", textColor: "#030403" },
  { label: "50 Free Spins", amount: "50 FS", color: "#0E150F", textColor: "#F5EFE8" },
  { label: "$100 Cash Drop", amount: "$100", color: "#BDF76B", textColor: "#030403" },
  { label: "VIP Role Boost", amount: "VIP", color: "#E5383B", textColor: "#FFFFFF" },
  { label: "$50 Bonus Buy", amount: "$50", color: "#10F060", textColor: "#030403" },
  { label: "25 Free Spins", amount: "25 FS", color: "#141F16", textColor: "#F5EFE8" },
  { label: "$250 Jackpot", amount: "$250", color: "#B6FF3B", textColor: "#030403" },
  { label: "Discord Drops", amount: "Drops", color: "#060806", textColor: "#F5EFE8" },
];

export function SpinWheel() {
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<WheelSegment | null>(null);
  const controls = useAnimation();
  const [currentRotation, setCurrentRotation] = useState(0);

  const numSegments = DEFAULT_SEGMENTS.length;
  const segmentAngle = 360 / numSegments;

  const handleSpin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setWinner(null);

    // Pick random winning index
    const winningIndex = Math.floor(Math.random() * numSegments);
    const winningSegment = DEFAULT_SEGMENTS[winningIndex];

    // Compute target angle: 5 full rotations (1800 deg) + offset to land under top pointer
    // Pointer is at top (270 deg or 0 deg depending on coordinate system)
    const extraRotations = 360 * 5;
    const targetSegmentCenter = winningIndex * segmentAngle + segmentAngle / 2;
    // Align with top pointer (270 degrees in SVG coordinates)
    const finalAngle = currentRotation + extraRotations + (360 - (targetSegmentCenter % 360)) + 270;

    await controls.start({
      rotate: finalAngle,
      transition: {
        duration: 4.5,
        ease: [0.15, 0.85, 0.2, 1], // realistic deceleration curve
      },
    });

    setCurrentRotation(finalAngle % 360);
    setWinner(winningSegment);
    setIsSpinning(false);

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00E700", "#BDF76B", "#B6FF3B", "#FFFFFF"],
      });
    } catch (e) {
      // safe fallback
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Outer Glow & Housing */}
      <div className="relative w-72 h-72 sm:w-96 sm:h-96 flex items-center justify-center p-3 rounded-full bg-gradient-to-b from-brand-amber/30 via-surface-card to-surface-card border-4 border-brand-amber/40 shadow-glow-lg">
        {/* Top Indicator Arrow / Needle */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center">
          <div className="w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[24px] border-t-brand-amber drop-shadow-[0_4px_10px_rgba(0,231,0,0.8)]" />
        </div>

        {/* The Animated Wheel */}
        <motion.div
          animate={controls}
          className="w-full h-full rounded-full overflow-hidden relative shadow-inner select-none"
        >
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {DEFAULT_SEGMENTS.map((seg, i) => {
              const startAngle = (i * 360) / numSegments;
              const endAngle = ((i + 1) * 360) / numSegments;
              const startRad = ((startAngle - 90) * Math.PI) / 180;
              const endRad = ((endAngle - 90) * Math.PI) / 180;

              const x1 = 200 + 200 * Math.cos(startRad);
              const y1 = 200 + 200 * Math.sin(startRad);
              const x2 = 200 + 200 * Math.cos(endRad);
              const y2 = 200 + 200 * Math.sin(endRad);

              const pathData = `M 200 200 L ${x1} ${y1} A 200 200 0 0 1 ${x2} ${y2} Z`;

              // Text position & rotation
              const midAngle = startAngle + segmentAngle / 2;
              const textRad = ((midAngle - 90) * Math.PI) / 180;
              const tx = 200 + 130 * Math.cos(textRad);
              const ty = 200 + 130 * Math.sin(textRad);

              return (
                <g key={i}>
                  <path d={pathData} fill={seg.color} stroke="#0B0908" strokeWidth="2.5" />
                  <text
                    x={tx}
                    y={ty}
                    fill={seg.textColor}
                    fontSize="13"
                    fontWeight="800"
                    fontFamily="var(--font-heading)"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${midAngle}, ${tx}, ${ty})`}
                  >
                    {seg.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* Center Hub */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-surface-card border-4 border-brand-amber flex items-center justify-center shadow-glow">
          <span className="text-xl sm:text-2xl">🧔</span>
        </div>
      </div>

      {/* Action Button & Winner Display */}
      <div className="mt-8 flex flex-col items-center">
        <MagneticButton
          variant="primary"
          size="lg"
          onClick={handleSpin}
          disabled={isSpinning}
          className={isSpinning ? "opacity-60 cursor-not-allowed" : ""}
        >
          <RotateCw className={`w-5 h-5 ${isSpinning ? "animate-spin" : ""}`} />
          <span>{isSpinning ? "Spinning..." : "Spin the Wheel"}</span>
        </MagneticButton>

        {/* Winner Announcement Card */}
        {winner && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="mt-6 px-6 py-3.5 rounded-2xl bg-surface-card border-2 border-brand-lime shadow-glow-lime flex items-center gap-3"
          >
            <Trophy className="w-5 h-5 text-brand-lime" />
            <div>
              <p className="text-[11px] text-text-muted uppercase font-bold">You Won</p>
              <p className="font-heading font-black text-lg text-brand-lime">{winner.label}</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
