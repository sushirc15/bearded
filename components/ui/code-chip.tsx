"use client";

import React, { useState } from "react";
import { Check, Copy, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

interface CodeChipProps {
  code?: string;
  variant?: "pill" | "banner" | "compact";
  showPulsingGlow?: boolean;
  className?: string;
}

export function CodeChip({
  code = siteConfig.code,
  variant = "pill",
  showPulsingGlow = false,
  className,
}: CodeChipProps) {
  const [copied, setCopied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setShowToast(true);

      // Trigger celebratory confetti burst
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: {
            x: e.clientX / window.innerWidth,
            y: e.clientY / window.innerHeight,
          },
          colors: ["#00E700", "#BDF76B", "#10F060", "#A4FF2E", "#FFFFFF"],
          disableForReducedMotion: true,
        });
      } catch (err) {
        // Safe fallback if canvas is unavailable
      }

      setTimeout(() => setCopied(false), 2400);
      setTimeout(() => setShowToast(false), 2800);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  if (variant === "compact") {
    return (
      <div className="relative inline-flex items-center">
        <button
          onClick={handleCopy}
          aria-label={`Copy referral code ${code}`}
          className={cn(
            "group inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-surface-elevated hover:bg-surface-hover border border-white/10 hover:border-brand-neon/40 text-xs font-mono transition-all duration-200 select-none text-text-primary",
            className
          )}
        >
          <span className="text-text-muted">Code:</span>
          <span className="font-bold text-brand-neon group-hover:text-brand-lime transition-colors">
            {code}
          </span>
          {copied ? (
            <Check className="w-3.5 h-3.5 text-brand-lime" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-text-muted group-hover:text-text-primary" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={handleCopy}
        aria-label={`Copy referral code ${code}`}
        className={cn(
          "relative group inline-flex items-center gap-2.5 px-4 py-2 rounded-full font-heading font-semibold text-xs sm:text-sm tracking-wide select-none transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon",
          showPulsingGlow && "shadow-glow animate-pulse-slow",
          "bg-gradient-to-r from-surface-elevated via-[#152217] to-surface-elevated border border-brand-neon/40 hover:border-brand-neon text-text-primary hover:shadow-glow-lime",
          className
        )}
      >
        {/* Subtle neon glow behind */}
        <span className="absolute inset-0 rounded-full bg-brand-neon/15 blur-sm opacity-50 group-hover:opacity-100 transition-opacity" />

        <span className="relative z-10 flex items-center gap-1.5 text-text-muted text-xs uppercase font-medium">
          <Sparkles className="w-3.5 h-3.5 text-brand-neon animate-pulse" />
          Use code
        </span>

        <span className="relative z-10 font-mono font-black text-brand-neon group-hover:text-white transition-colors tracking-wider px-2 py-0.5 rounded bg-black/60 border border-brand-neon/40">
          {code}
        </span>

        <span className="relative z-10 flex items-center text-text-muted group-hover:text-text-primary transition-colors">
          {copied ? (
            <Check className="w-4 h-4 text-brand-neon transition-transform scale-110" />
          ) : (
            <Copy className="w-4 h-4 text-brand-neon group-hover:scale-110 transition-transform" />
          )}
        </span>
      </button>

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-2 left-1/2 -translate-x-1/2 z-50 whitespace-nowrap px-3 py-1.5 rounded-lg bg-surface-card border border-brand-neon/40 text-xs font-medium text-brand-lime shadow-glow flex items-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Code <strong>{code}</strong> copied to clipboard!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
