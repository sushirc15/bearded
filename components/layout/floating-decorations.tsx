"use client";

import React from "react";
import { motion } from "framer-motion";

export function FloatingDecorations() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-1 select-none"
    >
      {/* 1. Neon Energy Slash 1 - Top Right */}
      <div className="absolute top-[8%] right-[-5%] w-[420px] h-[6px] bg-gradient-to-r from-transparent via-brand-neon to-transparent rotate-[-25deg] blur-[2px] opacity-70 pointer-events-none" />
      <div className="absolute top-[9%] right-[2%] w-[260px] h-[3px] bg-brand-lime rotate-[-25deg] blur-[1px] opacity-80 pointer-events-none" />

      {/* 2. Neon Energy Slash 2 - Mid Left */}
      <div className="absolute top-[42%] left-[-8%] w-[460px] h-[8px] bg-gradient-to-r from-transparent via-brand-neon to-transparent rotate-[32deg] blur-[3px] opacity-60 pointer-events-none" />
      <div className="absolute top-[43%] left-[1%] w-[280px] h-[3px] bg-brand-neon rotate-[32deg] blur-[1px] opacity-75 pointer-events-none" />

      {/* 3. Gold Coin - Top Left */}
      <motion.div
        className="absolute top-[14%] left-[4%] opacity-60"
        animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      >
        <svg width="46" height="46" viewBox="0 0 44 44" fill="none">
          <circle cx="22" cy="22" r="20" fill="url(#coin_gold)" stroke="#FFC83D" strokeWidth="2" />
          <circle cx="22" cy="22" r="15" stroke="#FFE873" strokeWidth="1" strokeDasharray="3 2" />
          <path d="M22 13V31M17 18H24.5C26 18 27 19 27 20.5C27 22 26 23 24.5 23H19.5C18 23 17 24 17 25.5C17 27 18 28 19.5 28H27" stroke="#060806" strokeWidth="2.5" strokeLinecap="round" />
          <defs>
            <linearGradient id="coin_gold" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFE873" />
              <stop offset="0.6" stopColor="#FFC83D" />
              <stop offset="1" stopColor="#B8860B" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* 4. Glowing Neon Energy Diamond - Mid Right */}
      <motion.div
        className="absolute top-[36%] right-[6%] opacity-70"
        animate={{ y: [0, -18, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <svg width="44" height="44" viewBox="0 0 36 36" fill="none" className="drop-shadow-[0_0_12px_#00E700]">
          <path d="M18 3L32 14L18 33L4 14L18 3Z" fill="#00E700" fillOpacity="0.25" stroke="#00E700" strokeWidth="2" />
          <path d="M4 14H32M18 3L11 14L18 33L25 14L18 3Z" stroke="#BDF76B" strokeWidth="1.5" strokeOpacity="0.9" />
        </svg>
      </motion.div>

      {/* 5. Controller Icon - Lower Left */}
      <motion.div
        className="absolute top-[68%] left-[5%] opacity-65"
        animate={{ y: [0, 16, 0], rotate: [0, -8, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <svg width="46" height="46" viewBox="0 0 40 40" fill="none" className="drop-shadow-[0_0_10px_#00E700]">
          <rect x="4" y="10" width="32" height="20" rx="10" fill="#0E1810" stroke="#00E700" strokeWidth="2" />
          <path d="M11 20H17M14 17V23" stroke="#BDF76B" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="26" cy="18" r="1.5" fill="#00E700" />
          <circle cx="29" cy="21" r="1.5" fill="#BDF76B" />
        </svg>
      </motion.div>
    </div>
  );
}
