"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Lock, ShieldAlert, LogOut, Radio } from "lucide-react";

interface ViewerLockChipProps {
  isAdmin?: boolean;
  onAdminChange?: (isAdmin: boolean) => void;
  className?: string;
}

export function ViewerLockChip({ isAdmin: propIsAdmin, onAdminChange, className = "" }: ViewerLockChipProps) {
  const [isAdmin, setIsAdmin] = useState<boolean>(propIsAdmin ?? false);
  const [loading, setLoading] = useState<boolean>(propIsAdmin === undefined);

  useEffect(() => {
    if (propIsAdmin !== undefined) {
      setIsAdmin(propIsAdmin);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/session");
        if (res.ok) {
          const data = await res.json();
          setIsAdmin(Boolean(data.isAdmin));
          onAdminChange?.(Boolean(data.isAdmin));
        }
      } catch {
        // Fallback viewer
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [propIsAdmin, onAdminChange]);

  async function handleLogout() {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAdmin(false);
      onAdminChange?.(false);
      window.location.reload();
    } catch {
      // safe fallback
    }
  }

  if (loading) return null;

  if (isAdmin) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-neon/20 border border-brand-neon/50 text-xs font-mono text-brand-lime shadow-[0_0_15px_rgba(0,231,0,0.3)] ${className}`}>
        <span className="w-2 h-2 rounded-full bg-brand-neon animate-pulse" />
        <span className="font-bold">ADMIN MODE (STREAMER)</span>
        <button
          onClick={handleLogout}
          className="ml-1 pl-1.5 border-l border-white/20 hover:text-white transition-colors flex items-center gap-1"
          title="Sign out as admin"
        >
          <LogOut className="w-3 h-3 text-brand-crimson" />
          <span>Exit</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-text-muted ${className}`}>
      <Lock className="w-3.5 h-3.5 text-text-muted" />
      <span>View only · updates live</span>
      <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-lime animate-pulse" />
      <Link
        href="/admin/login"
        className="ml-1 text-[11px] text-brand-neon hover:text-white underline font-medium"
      >
        Admin login
      </Link>
    </div>
  );
}
