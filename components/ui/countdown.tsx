"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CountdownProps {
  targetDateIso?: string;
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isComplete: boolean;
}

function calculateTimeRemaining(targetIso?: string): TimeRemaining {
  const now = new Date().getTime();
  let target = targetIso ? new Date(targetIso).getTime() : NaN;

  if (isNaN(target) || target <= now) {
    // Default to 1st of next month 00:00:00 UTC
    const d = new Date();
    const nextMonth = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1, 0, 0, 0));
    target = nextMonth.getTime();
  }

  const distance = Math.max(0, target - now);

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isComplete: distance <= 0,
  };
}

function FlipUnit({ value, label }: { value: number; label: string }) {
  const formatted = String(value).padStart(2, "0");

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-14 h-16 sm:w-16 sm:h-20 bg-surface-card rounded-xl border border-white/10 flex items-center justify-center shadow-card overflow-hidden">
        {/* Top/bottom division highlight */}
        <div className="absolute top-0 inset-x-0 h-1/2 bg-white/[0.02] border-b border-white/[0.06] pointer-events-none" />
        
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-radial-gradient from-brand-ember/10 to-transparent pointer-events-none" />

        <AnimatePresence mode="popLayout">
          <motion.span
            key={formatted}
            initial={{ y: -18, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 18, opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="text-2xl sm:text-3xl font-heading font-black text-text-primary tracking-tight"
          >
            {formatted}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-text-muted mt-2">
        {label}
      </span>
    </div>
  );
}

export function Countdown({ targetDateIso, className = "" }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() => calculateTimeRemaining(targetDateIso));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(targetDateIso));
    }, 1000);
    return () => clearInterval(interval);
  }, [targetDateIso]);

  if (!mounted) {
    return (
      <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
        {["Days", "Hours", "Mins", "Secs"].map((l) => (
          <div key={l} className="flex flex-col items-center">
            <div className="w-14 h-16 sm:w-16 sm:h-20 bg-surface-card rounded-xl border border-white/10 flex items-center justify-center">
              <span className="text-2xl sm:text-3xl font-heading font-bold text-text-muted">--</span>
            </div>
            <span className="text-[10px] sm:text-xs text-text-muted mt-2 uppercase">{l}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 sm:gap-3 ${className}`}>
      <FlipUnit value={timeLeft.days} label="Days" />
      <span className="text-xl sm:text-2xl font-bold text-brand-ember/60 -mt-6">:</span>
      <FlipUnit value={timeLeft.hours} label="Hours" />
      <span className="text-xl sm:text-2xl font-bold text-brand-ember/60 -mt-6">:</span>
      <FlipUnit value={timeLeft.minutes} label="Mins" />
      <span className="text-xl sm:text-2xl font-bold text-brand-ember/60 -mt-6">:</span>
      <FlipUnit value={timeLeft.seconds} label="Secs" />
    </div>
  );
}
