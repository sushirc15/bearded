"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Home,
  Flame,
  ExternalLink,
  Trophy,
  Gift,
  Gamepad2,
  ChevronDown,
  Swords,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";
import { CodeChip } from "@/components/ui/code-chip";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileGamesAccordionOpen, setMobileGamesAccordionOpen] = useState(false);
  const [gamesDropdownOpen, setGamesDropdownOpen] = useState(false);

  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  // Track scroll position & progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsScrolled(scrollY > 40);

      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setGamesDropdownOpen(false);
  }, [pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setGamesDropdownOpen(false);
      }
    }

    if (gamesDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [gamesDropdownOpen]);

  // Hover with 150ms intent delay
  const handleMouseEnter = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setGamesDropdownOpen(true);
    }, 150);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      setGamesDropdownOpen(false);
    }, 150);
  };

  // Keyboard navigation for dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setGamesDropdownOpen(false);
      triggerRef.current?.focus();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!gamesDropdownOpen) {
        setGamesDropdownOpen(true);
      } else {
        menuItemsRef.current[0]?.focus();
      }
    }
  };

  const handleMenuItemKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIndex = (index + 1) % 2;
      menuItemsRef.current[nextIndex]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prevIndex = (index - 1 + 2) % 2;
      menuItemsRef.current[prevIndex]?.focus();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setGamesDropdownOpen(false);
      triggerRef.current?.focus();
    }
  };

  const isGamesActive = pathname.startsWith("/games");
  const isBattlesActive = pathname === "/games/slot-battles";
  const isTournamentsActive = pathname === "/games/tournaments";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300",
          isScrolled
            ? "py-2 bg-[#060806]/80 backdrop-blur-2xl border-b border-brand-neon/20 shadow-[0_4px_30px_rgba(0,231,0,0.15)]"
            : "py-3.5 bg-transparent border-b border-transparent"
        )}
      >
        {/* Gradient scroll-progress bar in neon lime */}
        <div
          className="absolute top-0 left-0 h-[2px] bg-gradient-to-r from-brand-neon via-brand-lime to-brand-neon transition-all duration-100 ease-out z-50 shadow-[0_0_8px_rgba(0,231,0,0.8)]"
          style={{ width: `${scrollProgress}%` }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon rounded-lg"
          >
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-surface-elevated border-2 border-brand-neon/60 flex items-center justify-center overflow-hidden shadow-glow group-hover:border-brand-neon group-hover:shadow-[0_0_20px_rgba(0,231,0,0.5)] transition-all">
              <Image
                src="/bearded-logo.png"
                alt="The Bearded Gamer"
                fill
                sizes="44px"
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-heading font-black text-sm sm:text-base tracking-tight text-text-primary">
                <span>TheBeardedGamer</span>
                <span className="text-brand-neon font-normal text-xs sm:text-sm">×</span>
                <span className="text-brand-neon font-mono text-xs sm:text-sm tracking-wider uppercase px-1.5 py-0.5 rounded bg-brand-neon/10 border border-brand-neon/30">
                  {siteConfig.partnerCasino}
                </span>
              </div>
              <span className="text-[10px] text-brand-lime font-medium tracking-wider uppercase -mt-0.5">
                Official Rewards &amp; Arena
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 bg-surface-card/50 backdrop-blur-2xl px-3 py-1.5 rounded-full border border-brand-neon/20 shadow-card">
            {siteConfig.navItems.map((item) => {
              // GAMES DROPDOWN
              if (item.label === "Games") {
                return (
                  <div
                    key={item.href}
                    ref={dropdownRef}
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      ref={triggerRef}
                      type="button"
                      aria-haspopup="menu"
                      aria-expanded={gamesDropdownOpen}
                      onClick={() => setGamesDropdownOpen((prev) => !prev)}
                      onKeyDown={handleKeyDown}
                      className={cn(
                        "relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 select-none flex items-center gap-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon",
                        isGamesActive
                          ? "text-brand-neon bg-surface-elevated border border-brand-neon/40 shadow-[0_0_20px_rgba(0,231,0,0.3)]"
                          : "text-text-muted hover:text-text-primary hover:bg-white/[0.04]"
                      )}
                    >
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Gamepad2 className="w-3.5 h-3.5 text-brand-neon" />
                        <span>GAMES</span>
                        <ChevronDown
                          className={cn(
                            "w-3.5 h-3.5 transition-transform duration-200",
                            gamesDropdownOpen && "rotate-180 text-brand-neon"
                          )}
                        />
                      </span>
                    </button>

                    {/* Framer Motion Dropdown menu */}
                    <AnimatePresence>
                      {gamesDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 6, scale: 0.98 }}
                          transition={{ duration: 0.16 }}
                          role="menu"
                          aria-label="Games sub-menu"
                          className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 min-w-[260px]"
                        >
                          <div className="p-2 rounded-2xl bg-[#0e161c]/95 backdrop-blur-2xl border border-brand-neon/30 shadow-[0_16px_50px_rgba(0,0,0,0.9)] flex flex-col gap-1.5">
                            {/* Slot Battles */}
                            <Link
                              ref={(el) => { menuItemsRef.current[0] = el; }}
                              href="/games/slot-battles"
                              role="menuitem"
                              tabIndex={0}
                              onKeyDown={(e) => handleMenuItemKeyDown(e, 0)}
                              onClick={() => setGamesDropdownOpen(false)}
                              className={cn(
                                "flex items-start gap-3 p-2.5 rounded-xl transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon",
                                isBattlesActive
                                  ? "bg-brand-neon/20 border border-brand-neon/40 text-white"
                                  : "text-text-primary hover:bg-white/[0.06] hover:text-brand-neon"
                              )}
                            >
                              <div className="w-8 h-8 rounded-lg bg-brand-neon/15 border border-brand-neon/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Swords className="w-4 h-4 text-brand-lime" />
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-heading font-black text-sm tracking-tight">
                                    Slot Battles
                                  </span>
                                  {isBattlesActive && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-neon animate-pulse" />
                                  )}
                                </div>
                                <span className="text-[11px] text-text-muted leading-tight mt-0.5">
                                  Streamer vs chat slot duels
                                </span>
                              </div>
                            </Link>

                            {/* Tournaments */}
                            <Link
                              ref={(el) => { menuItemsRef.current[1] = el; }}
                              href="/games/tournaments"
                              role="menuitem"
                              tabIndex={0}
                              onKeyDown={(e) => handleMenuItemKeyDown(e, 1)}
                              onClick={() => setGamesDropdownOpen(false)}
                              className={cn(
                                "flex items-start gap-3 p-2.5 rounded-xl transition-all group focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon",
                                isTournamentsActive
                                  ? "bg-brand-neon/20 border border-brand-neon/40 text-white"
                                  : "text-text-primary hover:bg-white/[0.06] hover:text-brand-neon"
                              )}
                            >
                              <div className="w-8 h-8 rounded-lg bg-brand-neon/15 border border-brand-neon/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                                <Trophy className="w-4 h-4 text-brand-neon" />
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-heading font-black text-sm tracking-tight">
                                    Tournaments
                                  </span>
                                  {isTournamentsActive && (
                                    <span className="w-1.5 h-1.5 rounded-full bg-brand-neon animate-pulse" />
                                  )}
                                </div>
                                <span className="text-[11px] text-text-muted leading-tight mt-0.5">
                                  Live slot bracket
                                </span>
                              </div>
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon",
                    isActive
                      ? "text-brand-neon bg-surface-elevated border border-brand-neon/40 shadow-[0_0_20px_rgba(0,231,0,0.25)]"
                      : "text-text-muted hover:text-text-primary hover:bg-white/[0.04]"
                  )}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {item.label}
                    {item.badge && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-brand-neon/20 text-brand-neon border border-brand-neon/30">
                        {item.badge}
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-neon/20 to-brand-lime/20 -z-0"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            <a
              href={siteConfig.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold text-text-muted hover:text-brand-neon hover:bg-brand-neon/10 border border-transparent hover:border-brand-neon/30 transition-all flex items-center gap-1.5"
            >
              <span>Community</span>
              <ExternalLink className="w-3 h-3 text-brand-neon" />
            </a>
          </nav>

          {/* Right Action: Code Chip + Mobile Hamburger */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <CodeChip showPulsingGlow={true} />
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              className="md:hidden w-10 h-10 rounded-xl bg-surface-card border border-white/10 flex items-center justify-center text-text-primary hover:border-brand-neon/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/85 backdrop-blur-md z-40 md:hidden"
            />

            {/* Slide-in menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-surface-card border-l border-brand-neon/20 p-6 z-50 flex flex-col justify-between shadow-2xl md:hidden overflow-y-auto"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="relative w-9 h-9 rounded-xl overflow-hidden border border-brand-neon">
                      <Image src="/bearded-logo.png" alt="Logo" fill className="object-cover" />
                    </div>
                    <span className="font-heading font-black text-text-primary text-base">
                      TheBeardedGamer
                    </span>
                  </div>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center text-text-muted hover:text-text-primary"
                    aria-label="Close menu"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Mobile Promo Code Chip */}
                <div className="py-6 border-b border-white/10">
                  <p className="text-xs uppercase tracking-wider text-text-muted mb-2 font-medium">
                    Your Streamer Promo Code
                  </p>
                  <CodeChip className="w-full justify-between" showPulsingGlow={true} />
                </div>

                {/* Mobile Nav Links */}
                <nav className="flex flex-col gap-2 py-6">
                  {siteConfig.navItems.map((item) => {
                    if (item.label === "Games") {
                      return (
                        <div key={item.href} className="space-y-1">
                          <button
                            type="button"
                            onClick={() => setMobileGamesAccordionOpen((prev) => !prev)}
                            className={cn(
                              "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-colors",
                              isGamesActive
                                ? "bg-brand-neon/15 text-brand-neon border border-brand-neon/30"
                                : "text-text-muted hover:text-text-primary hover:bg-white/5"
                            )}
                          >
                            <span className="flex items-center gap-3">
                              <Gamepad2 className="w-4 h-4 text-brand-neon" />
                              <span>GAMES</span>
                            </span>
                            <ChevronDown
                              className={cn(
                                "w-4 h-4 transition-transform duration-200",
                                mobileGamesAccordionOpen && "rotate-180 text-brand-neon"
                              )}
                            />
                          </button>

                          {/* Accordion content */}
                          <AnimatePresence>
                            {mobileGamesAccordionOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="pl-4 pr-1 py-1 space-y-1.5 overflow-hidden"
                              >
                                <Link
                                  href="/games/slot-battles"
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={cn(
                                    "flex items-start gap-2.5 p-2.5 rounded-lg text-xs font-heading font-bold transition-all",
                                    isBattlesActive
                                      ? "bg-brand-neon/20 text-white border border-brand-neon/40"
                                      : "text-text-muted hover:text-brand-neon hover:bg-white/5"
                                  )}
                                >
                                  <Swords className="w-4 h-4 text-brand-lime shrink-0 mt-0.5" />
                                  <div className="flex flex-col">
                                    <span>Slot Battles</span>
                                    <span className="text-[10px] text-text-muted font-normal font-sans">
                                      Streamer vs chat slot duels
                                    </span>
                                  </div>
                                </Link>

                                <Link
                                  href="/games/tournaments"
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={cn(
                                    "flex items-start gap-2.5 p-2.5 rounded-lg text-xs font-heading font-bold transition-all",
                                    isTournamentsActive
                                      ? "bg-brand-neon/20 text-white border border-brand-neon/40"
                                      : "text-text-muted hover:text-brand-neon hover:bg-white/5"
                                  )}
                                >
                                  <Trophy className="w-4 h-4 text-brand-neon shrink-0 mt-0.5" />
                                  <div className="flex flex-col">
                                    <span>Tournaments</span>
                                    <span className="text-[10px] text-text-muted font-normal font-sans">
                                      Live slot bracket
                                    </span>
                                  </div>
                                </Link>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }

                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-colors",
                          isActive
                            ? "bg-brand-neon/15 text-brand-neon border border-brand-neon/30"
                            : "text-text-muted hover:text-text-primary hover:bg-white/5"
                        )}
                      >
                        <span className="flex items-center gap-3">
                          {item.label === "Home" && <Home className="w-4 h-4 text-brand-neon" />}
                          {item.label === "Leaderboard" && <Trophy className="w-4 h-4 text-brand-neon" />}
                          {item.label === "Rewards" && <Gift className="w-4 h-4 text-brand-lime" />}
                          {item.label === "Rules" && <Shield className="w-4 h-4 text-brand-neon" />}
                          {item.label}
                        </span>
                        {item.badge && (
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-brand-neon/20 text-brand-neon border border-brand-neon/30">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}

                  <a
                    href={siteConfig.discordUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-text-primary hover:text-brand-neon hover:bg-brand-neon/10 border border-brand-neon/20 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse" />
                      Discord Community
                    </span>
                    <ExternalLink className="w-4 h-4 text-brand-neon" />
                  </a>

                  <a
                    href={siteConfig.kickUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-brand-lime bg-brand-lime/10 border border-brand-lime/30"
                  >
                    <span className="flex items-center gap-2">
                      <Flame className="w-4 h-4 text-brand-lime" />
                      Watch Live on Kick
                    </span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </nav>
              </div>

              {/* Mobile Drawer Footer */}
              <div className="pt-6 border-t border-white/10 text-xs text-text-muted">
                <p className="mb-2">18+ Gamble Responsibly</p>
                <p className="text-[11px] text-text-faint">
                  Official rewards for {siteConfig.shortName} community members.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
