"use client";

import React, { useEffect, useState } from "react";
import { Radio, Users, Flame, ArrowUpRight } from "lucide-react";
import { KickStatusResponse } from "@/app/api/kick-status/route";
import { siteConfig } from "@/config/site";

export function LiveStatusWidget() {
  const [status, setStatus] = useState<KickStatusResponse | null>(null);

  useEffect(() => {
    async function loadStatus() {
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
    loadStatus();

    // Poll every 60s
    const interval = setInterval(loadStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  const isLive = status?.isLive ?? true;

  return (
    <a
      href={siteConfig.kickUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex items-center gap-3 p-1.5 pr-4 rounded-full bg-surface-card/90 border border-white/10 hover:border-brand-lime/50 shadow-card hover:shadow-glow-lime transition-all duration-300 max-w-full overflow-hidden select-none"
    >
      {/* Live Badge */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-lime/15 border border-brand-lime/40 text-brand-lime text-xs font-heading font-black uppercase tracking-wider shrink-0">
        <span className="relative flex h-2 w-2">
          {isLive && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-lime opacity-75" />
          )}
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-lime" />
        </span>
        <span>{isLive ? "LIVE NOW" : "OFFLINE"}</span>
      </div>

      {/* Stream Info Snippet */}
      <div className="flex items-center gap-2 text-xs truncate">
        <span className="font-heading font-bold text-text-primary group-hover:text-brand-lime transition-colors">
          Kick.com/{siteConfig.kickChannel}
        </span>
        {status?.viewers && (
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-text-muted">
            <Users className="w-3 h-3 text-brand-amber" />
            {status.viewers.toLocaleString()} watching
          </span>
        )}
      </div>

      <ArrowUpRight className="w-3.5 h-3.5 text-text-muted group-hover:text-brand-lime group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ml-auto shrink-0" />
    </a>
  );
}
