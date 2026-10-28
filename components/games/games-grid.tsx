"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Flame, Sparkles, Play, ShieldAlert, ArrowUpRight, Gamepad2 } from "lucide-react";
import { GameItem, CATEGORIES } from "@/lib/games/provider";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

function SlotCover({ game }: { game: GameItem }) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-[#0c180e] via-surface-card to-[#151c14] flex flex-col items-center justify-center p-4 text-center">
        <Gamepad2 className="w-8 h-8 text-brand-neon mb-2 opacity-80" />
        <span className="font-heading font-black text-xs text-white line-clamp-2">
          {game.title}
        </span>
        <span className="text-[10px] font-mono text-brand-neon mt-1">
          {game.provider}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={game.imageUrl}
      alt={game.title}
      fill
      unoptimized
      onError={() => setHasError(true)}
      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      className="object-cover group-hover:scale-110 transition-transform duration-500"
    />
  );
}

interface GamesGridProps {
  initialGames: GameItem[];
}

export function GamesGrid({ initialGames }: GamesGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredGames = initialGames.filter((game) => {
    const matchesCategory =
      selectedCategory === "all" || game.category === selectedCategory;
    const matchesSearch =
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.provider.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Category Chips & Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Category Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={cn(
                  "px-4 py-2 rounded-xl text-xs font-heading font-bold whitespace-nowrap transition-all duration-200 select-none border",
                  isActive
                    ? "bg-brand-neon/20 text-brand-neon border-brand-neon/50 shadow-glow"
                    : "bg-surface-card hover:bg-surface-elevated text-text-muted hover:text-text-primary border-white/[0.06]"
                )}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search slots, providers..."
            className="w-full bg-surface-card border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-text-primary placeholder:text-text-faint focus:outline-none focus:border-brand-ember transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-muted hover:text-text-primary"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Games Cards Grid */}
      {filteredGames.length === 0 ? (
        <div className="text-center py-16 bg-surface-card rounded-2xl border border-white/5">
          <p className="text-sm text-text-muted">
            No games found matching &quot;{searchQuery}&quot; in this category.
          </p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          <AnimatePresence>
            {filteredGames.map((game) => (
              <motion.div
                layout
                key={game.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="group relative rounded-2xl overflow-hidden bg-surface-card/60 backdrop-blur-xl border border-brand-neon/20 hover:border-brand-neon/60 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                {/* Thumbnail Container */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-surface-elevated">
                  <SlotCover game={game} />

                  {/* Gradient Dimmer */}
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-card via-transparent to-transparent opacity-80" />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {game.isFeatured && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-heading font-black bg-brand-ember text-white shadow-glow flex items-center gap-1">
                        <Flame className="w-2.5 h-2.5" />
                        Featured
                      </span>
                    )}
                    {game.isPopular && !game.isFeatured && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-heading font-black bg-brand-amber/20 text-brand-amber border border-brand-amber/30">
                        Hot
                      </span>
                    )}
                  </div>

                  {/* Hover Overlay Preview */}
                  <div className="absolute inset-0 bg-black/85 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 text-center z-10">
                    <span className="text-[10px] font-mono text-brand-amber uppercase tracking-wider mb-1">
                      {game.provider}
                    </span>
                    <h4 className="font-heading font-bold text-sm text-white mb-2 leading-tight">
                      {game.title}
                    </h4>

                    <div className="grid grid-cols-2 gap-2 w-full text-[10px] font-mono text-text-muted mb-4 py-2 border-y border-white/10">
                      <div>
                        <span>RTP</span>
                        <p className="font-bold text-brand-lime">{game.rtp}</p>
                      </div>
                      <div>
                        <span>Max Win</span>
                        <p className="font-bold text-brand-amber">{game.maxWin}</p>
                      </div>
                    </div>

                    <a
                      href={siteConfig.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-gradient-brand text-black font-heading font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-glow hover:opacity-95 transition-all"
                    >
                      <Play className="w-3 h-3 fill-black" />
                      <span>Play on Gamba</span>
                    </a>
                  </div>
                </div>

                {/* Footer Info */}
                <div className="p-3.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-text-muted block truncate">
                      {game.provider}
                    </span>
                    <h4 className="font-heading font-bold text-xs sm:text-sm text-text-primary truncate mt-0.5 group-hover:text-brand-amber transition-colors">
                      {game.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-text-faint pt-2 mt-2 border-t border-white/[0.04]">
                    <span>Vol: {game.volatility}</span>
                    <span className="text-brand-lime">{game.rtp}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
