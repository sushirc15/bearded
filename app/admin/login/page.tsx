"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowRight, AlertCircle, KeyRound, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Authentication failed");
        setLoading(false);
        return;
      }

      router.push("/games/slot-battles");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  function handleQuickDemoFill() {
    setPassword("bearded2026");
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 flex flex-col items-center justify-center relative">
      <div className="w-full max-w-md p-8 rounded-3xl bg-[#0E150F]/90 border border-brand-neon/30 shadow-card backdrop-blur-2xl relative z-10 clip-chamfer">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-neon/15 border border-brand-neon/30 text-brand-neon text-xs font-mono font-bold uppercase tracking-wider mb-6">
          <Lock className="w-3.5 h-3.5" />
          <span>Streamer Admin Access</span>
        </div>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl border border-brand-neon overflow-hidden relative shrink-0 shadow-[0_0_20px_rgba(0,231,0,0.4)]">
            <Image src="/bearded-hero.png" alt="Bearded Gamer" fill className="object-cover" />
          </div>
          <div>
            <h1 className="font-display italic font-black text-2xl text-white uppercase tracking-tight">
              THE BEARDED GAMER
            </h1>
            <p className="text-xs text-text-muted font-mono">Streamer Control Portal</p>
          </div>
        </div>

        <p className="text-xs text-text-muted mb-6 leading-relaxed">
          Sign in to unlock live slot battles, server random rolls, chat challenger selection, and tournament bracket editing.
        </p>

        {error && (
          <div className="p-3 rounded-xl bg-brand-crimson/15 border border-brand-crimson/40 text-brand-crimson text-xs flex items-center gap-2 mb-6">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono uppercase tracking-widest text-text-muted mb-2 font-bold">
              Admin Password
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password..."
                required
                className="w-full bg-[#141F16] border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-text-primary placeholder:text-text-faint focus:outline-none focus:border-brand-neon transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-gradient-brand text-black font-display italic font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-glow hover:scale-[1.02] transition-all disabled:opacity-50"
          >
            <span>{loading ? "Authenticating..." : "Sign In As Admin"}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Quick Fill for development testing */}
        <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleQuickDemoFill}
            className="text-brand-amber hover:underline font-mono"
          >
            Use default: <code className="text-brand-lime">bearded2026</code>
          </button>
          <Link
            href="/games/slot-battles"
            className="text-text-muted hover:text-white flex items-center gap-1 font-mono"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to battles</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
