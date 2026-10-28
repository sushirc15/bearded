"use client";

import React from "react";
import { motion } from "framer-motion";
import { Calendar, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface PeriodTabsProps {
  period: "current" | "previous";
  onChange: (period: "current" | "previous") => void;
}

export function PeriodTabs({ period, onChange }: PeriodTabsProps) {
  const tabs = [
    { id: "current", label: "Active Race (This Month)", icon: Calendar },
    { id: "previous", label: "Previous Month Winners", icon: History },
  ] as const;

  return (
    <div className="flex items-center justify-center">
      <div className="relative flex items-center p-1 rounded-2xl bg-surface-card border border-white/[0.08] shadow-card">
        {tabs.map((tab) => {
          const isActive = period === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative z-10 flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-heading font-bold text-xs sm:text-sm tracking-wide transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-neon select-none",
                isActive ? "text-text-primary" : "text-text-muted hover:text-text-primary"
              )}
            >
              <Icon className={cn("w-4 h-4", isActive ? "text-brand-neon" : "text-text-muted")} />
              <span>{tab.label}</span>

              {isActive && (
                <motion.div
                  layoutId="activePeriodTab"
                  className="absolute inset-0 bg-surface-elevated border border-brand-neon/40 rounded-xl shadow-glow -z-10"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
