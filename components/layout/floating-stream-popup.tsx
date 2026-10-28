"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Radio, Users, X, Minimize2, Maximize2, ExternalLink, Flame, Volume2, VolumeX } from "lucide-react";
import { KickStatusResponse } from "@/app/api/kick-status/route";
import { siteConfig } from "@/config/site";

export function FloatingStreamPopup() {
  const [status, setStatus] = useState<KickStatusResponse | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true); // Default to minimized pill to eliminate video iframe lag
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/kick-status");
        if (res.ok) {
          const json = await res.json();
          setStatus(json);
        }
      } catch (err) {
        // Fallback
      }
    }
    checkStatus();
    const interval = setInterval(checkStatus, 45000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  const isLive = status?.isLive ?? true;
  if (!isLive) return null;

  return (
    <div className="fixed bottom-5 left-5 z-50 select-none">
      <AnimatePresence mode="wait">
        {isMinimized ? (
          /* Minimized Floating Pill */
          <motion.button
            key="minimized-pill"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-surface-card border-2 border-brand-neon shadow-glow-lime backdrop-blur-xl group cursor-pointer"
          >
            <div className="relative w-6 h-6 rounded-full overflow-hidden border border-brand-neon shrink-0">
              <Image src="/bearded-logo.png" alt="Bearded" fill className="object-cover" />
            </div>

            <span className="flex items-center gap-1.5 text-xs font-heading font-black text-white">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-neon opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-neon" />
              </span>
              <span>LIVE</span>
            </span>

            {status?.viewers && (
              <span className="text-[11px] font-mono text-brand-lime font-bold">
                {status.viewers}
              </span>
            )}
          </motion.button>
        ) : (
          /* Full Floating Player Card */
          <motion.div
            key="full-popup"
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 320, damping: 25 }}
            className="w-72 sm:w-84 rounded-2xl bg-surface-card/85 border-2 border-brand-neon shadow-glow-lg overflow-hidden backdrop-blur-2xl flex flex-col"
          >
            {/* Header bar */}
            <div className="px-3.5 py-2 bg-surface-elevated border-b border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-neon opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-neon" />
                </span>
                <span className="font-heading font-black text-xs text-brand-neon uppercase tracking-wider">
                  TheBeardedGamer Live
                </span>
              </div>

              <div className="flex items-center gap-1">
                {status?.viewers && (
                  <span className="flex items-center gap-1 text-[10px] font-mono text-text-muted mr-1.5">
                    <Users className="w-3 h-3 text-brand-lime" />
                    {status.viewers}
                  </span>
                )}
                <button
                  onClick={() => setIsMinimized(true)}
                  className="p-1 rounded-md text-text-muted hover:text-white hover:bg-white/10 transition-colors"
                  title="Minimize Stream"
                  aria-label="Minimize"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDismissed(true)}
                  className="p-1 rounded-md text-text-muted hover:text-brand-crimson hover:bg-white/10 transition-colors"
                  title="Close Preview"
                  aria-label="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Embedded Kick Stream Player */}
            <div className="relative aspect-video w-full bg-black overflow-hidden">
              <iframe
                src="https://player.kick.com/TThebeardedGamer?autoplay=true&muted=true"
                title="The Bearded Gamer Kick Stream"
                className="w-full h-full border-0"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            </div>

            {/* Stream info footer */}
            <div className="p-3 bg-surface-card flex items-center justify-between gap-2 border-t border-white/[0.06]">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-heading font-bold text-white truncate">
                  {status?.title || "⚡ $250 Wager Race Live Stream on Gamba"}
                </p>
                <p className="text-[10px] text-brand-lime font-mono">
                  Code: {siteConfig.code}
                </p>
              </div>

              <a
                href={siteConfig.kickUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1.5 rounded-lg bg-brand-neon text-black font-heading font-black text-[11px] uppercase tracking-wide flex items-center gap-1 hover:bg-brand-lime transition-colors shrink-0 shadow-glow"
              >
                <span>Watch</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
