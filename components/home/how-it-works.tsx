"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { UserPlus, Coins, Trophy, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";

const STEPS = [
  {
    step: "01",
    title: "Sign Up With Code BEARDED",
    description:
      "Create your new casino account using our partner link and enter promo code BEARDED during registration to permanently link your player ID.",
    icon: UserPlus,
    badge: "Instant Link",
  },
  {
    step: "02",
    title: "Wager on Any Slots & Live Games",
    description:
      "Every single spin, hand, and bet automatically earns instant rakeback and increments your score on the monthly wager leaderboard.",
    icon: Coins,
    badge: "Auto-Tracked",
  },
  {
    step: "03",
    title: "Collect Your Share of $250",
    description:
      "Finish in the top 5 at the end of the month to receive instant cash payouts, plus weekly reloads and live stream wheel spins.",
    icon: Trophy,
    badge: "Guaranteed Payouts",
  },
];

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end 70%"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="relative py-12">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-neon/15 border border-brand-neon/30 text-brand-neon text-xs font-heading font-black uppercase tracking-wider mb-4">
          <Sparkles className="w-3.5 h-3.5 text-brand-neon" />
          <span>Simple 3-Step Process</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-black tracking-tight text-text-primary">
          How To Qualify &amp; Win
        </h2>
        <p className="text-sm sm:text-base text-text-muted mt-3 max-w-xl mx-auto">
          No complicated forms or manual verification. Everything is tracked seamlessly under the
          streamer partner system.
        </p>
      </div>

      <div className="relative max-w-4xl mx-auto">
        {/* Scroll-Linked Progress Line for Desktop */}
        <div className="hidden md:block absolute left-1/2 top-10 bottom-10 -translate-x-1/2 w-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            style={{ height: lineHeight }}
            className="w-full bg-gradient-brand shadow-[0_0_12px_rgba(0,231,0,0.8)] origin-top"
          />
        </div>

        {/* Steps Stack */}
        <div className="space-y-12 sm:space-y-16">
          {STEPS.map((item, index) => {
            const Icon = item.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.6, delay: index * 0.15 }}
                className={`relative flex flex-col md:flex-row items-center gap-8 ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content Card */}
                <div className={`w-full md:w-1/2 ${isEven ? "md:text-right" : "md:text-left"}`}>
                  <div className="p-7 sm:p-8 rounded-3xl bg-surface-card/50 backdrop-blur-2xl border border-brand-neon/20 shadow-card hover:border-brand-neon/60 hover:shadow-glow transition-all">
                    <div
                      className={`flex items-center gap-2 mb-3 ${
                        isEven ? "md:justify-end" : "md:justify-start"
                      }`}
                    >
                      <span className="text-xs font-mono font-bold text-brand-lime px-2.5 py-0.5 rounded-full bg-brand-neon/15 border border-brand-neon/30">
                        {item.badge}
                      </span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-heading font-black text-text-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Center Node Icon */}
                <div className="relative z-10 w-16 h-16 rounded-2xl bg-surface-elevated/80 backdrop-blur-md border-2 border-brand-neon flex items-center justify-center shadow-glow shrink-0">
                  <Icon className="w-7 h-7 text-brand-lime" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-brand-neon text-black font-heading font-black text-xs flex items-center justify-center shadow-glow">
                    {item.step}
                  </span>
                </div>

                {/* Spacer on the opposite side */}
                <div className="hidden md:block w-full md:w-1/2" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
