"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShieldCheck } from "lucide-react";

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Check if session already loaded to avoid blocking every internal navigation
    const hasLoaded = sessionStorage.getItem("bearded_intro_loaded");
    if (hasLoaded) {
      setLoading(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setLoading(false);
            sessionStorage.setItem("bearded_intro_loaded", "true");
          }, 150);
          return 100;
        }
        const increment = Math.floor(Math.random() * 25) + 25;
        return Math.min(prev + increment, 100);
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          onClick={() => {
            setLoading(false);
            sessionStorage.setItem("bearded_intro_loaded", "true");
          }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="fixed inset-0 z-[9999] bg-[#070807] flex flex-col items-center justify-center p-6 select-none overflow-hidden cursor-pointer"
        >
          {/* Ambient radial electric green backdrop */}
          <div className="absolute w-[600px] h-[600px] bg-radial-gradient from-brand-neon/20 via-brand-neon/5 to-transparent blur-3xl pointer-events-none" />

          {/* Centered Graphic Card */}
          <div className="relative z-10 flex flex-col items-center text-center max-w-sm">
            {/* The Bearded Gamer Image with Glowing Electric Green Ring */}
            <div className="relative mb-8">
              {/* Outer Pulsing Green Aura */}
              <div className="absolute -inset-4 rounded-full bg-brand-neon/25 blur-xl animate-pulse" />
              
              <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full p-1 bg-gradient-to-tr from-brand-neon via-brand-lime to-black border-2 border-brand-neon shadow-glow-lg overflow-hidden">
                <Image
                  src="/bearded-hero.png"
                  alt="The Bearded Gamer"
                  fill
                  priority
                  className="object-cover object-top scale-105"
                />
              </div>

              {/* Glowing Corner Badge */}
              <div className="absolute bottom-1 right-1 px-2.5 py-0.5 rounded-full bg-black/90 border border-brand-neon text-[10px] font-mono font-bold text-brand-neon flex items-center gap-1 shadow-glow">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-neon animate-ping" />
                <span>GAMBA VIP</span>
              </div>
            </div>

            {/* Title */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-heading font-black tracking-widest text-brand-lime uppercase">
                Official Rewards Hub
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-heading font-black text-white tracking-tight mb-2">
              The Bearded Gamer
            </h2>

            <p className="text-xs text-text-muted mb-8 font-mono">
              Gamba Exclusive Race • $250 Prize Pool
            </p>

            {/* Glowing Progress Bar */}
            <div className="w-64 sm:w-72 h-2 rounded-full bg-white/10 overflow-hidden relative mb-3 border border-brand-neon/30">
              <motion.div
                className="h-full bg-gradient-brand shadow-[0_0_12px_#00E700]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Progress Percentage */}
            <div className="flex items-center justify-between w-64 sm:w-72 text-xs font-mono text-text-muted">
              <span>INITIALIZING...</span>
              <span className="text-brand-neon font-bold">{progress}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
