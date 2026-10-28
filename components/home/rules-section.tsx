"use client";

import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, ShieldAlert, CheckCircle, Ban, HeartHandshake, ExternalLink } from "lucide-react";
import { siteConfig } from "@/config/site";

export function RulesSection() {
  return (
    <section id="rules" className="scroll-mt-28 py-12 relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-crimson/15 border border-brand-crimson/30 text-brand-crimson text-xs font-heading font-black uppercase tracking-wider mb-3">
            <AlertTriangle className="w-4 h-4 text-brand-crimson" />
            <span>Community Guidelines</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-text-primary flex items-center justify-center gap-2">
            <span>Rules</span>
            <span className="text-brand-crimson">‼️</span>
          </h2>

          <p className="text-xs sm:text-sm text-text-muted mt-2 max-w-xl mx-auto">
            To keep our community safe, fun, and welcoming for everyone across Kick and Discord,
            please strictly respect the following guidelines:
          </p>
        </div>

        {/* Rules Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {siteConfig.rules.map((item) => (
            <motion.div
              key={item.num}
              whileHover={{ y: -3, scale: 1.01 }}
              transition={{ duration: 0.2 }}
              className="p-5 sm:p-6 rounded-2xl bg-surface-card/60 backdrop-blur-xl border border-brand-neon/25 hover:border-brand-neon/70 shadow-card hover:shadow-glow flex items-start gap-4 group transition-all"
            >
              <div className="w-10 h-10 rounded-xl bg-brand-neon/15 border border-brand-neon/40 text-brand-neon font-heading font-black text-sm flex items-center justify-center shrink-0 group-hover:scale-110 shadow-glow transition-transform">
                #{item.num}
              </div>

              <div>
                <p className="text-sm font-heading font-bold text-text-primary group-hover:text-brand-lime transition-colors leading-relaxed">
                  {item.rule}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Warning / Enforcement Banner */}
        <motion.div
          whileHover={{ scale: 1.01 }}
          className="p-6 rounded-2xl bg-gradient-to-r from-brand-crimson/20 via-surface-card to-brand-crimson/20 border-2 border-brand-crimson/50 shadow-glow flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-brand-crimson/20 border border-brand-crimson/40 flex items-center justify-center shrink-0">
              <Ban className="w-5 h-5 text-brand-crimson" />
            </div>
            <div>
              <p className="font-heading font-black text-sm text-white uppercase tracking-wide">
                Strict Enforcement Notice
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                {siteConfig.rulesNotice}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-wrap items-center gap-3">
            <a
              href={siteConfig.discordUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-neon text-black font-heading font-black text-xs uppercase tracking-wider shadow-glow hover:scale-105 transition-transform"
            >
              <span>Join Discord</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/60 border border-white/10 text-xs font-mono font-bold text-brand-lime">
              <CheckCircle className="w-3.5 h-3.5 text-brand-lime" />
              <span>VERIFIED</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
