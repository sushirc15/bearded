import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ShieldAlert, HeartHandshake } from "lucide-react";
import { siteConfig } from "@/config/site";
import { CodeChip } from "@/components/ui/code-chip";

export function Footer() {
  return (
    <footer className="relative bg-surface-card/70 backdrop-blur-2xl border-t border-brand-neon/20 mt-24 pt-16 pb-12 overflow-hidden z-20">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-radial-gradient from-brand-neon/15 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/[0.08]">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-brand-neon shadow-glow">
                <Image src="/bearded-logo.png" alt="The Bearded Gamer" fill className="object-cover" />
              </div>
              <div className="flex items-center gap-1.5 font-heading font-black text-lg text-text-primary">
                <span>TheBeardedGamer</span>
                <span className="text-brand-neon">×</span>
                <span className="text-brand-neon font-mono text-sm uppercase px-2 py-0.5 rounded bg-brand-neon/15 border border-brand-neon/40">
                  {siteConfig.partnerCasino}
                </span>
              </div>
            </div>
            <p className="text-sm text-text-muted leading-relaxed max-w-md">
              {siteConfig.description} Compete in the monthly $250 Gamba wager race, claim instant
              rakeback, and snag exclusive stream bonus drops with code <strong>{siteConfig.code}</strong>.
            </p>

            <div className="pt-2">
              <CodeChip variant="compact" />
            </div>
          </div>

          {/* Page Links */}
          <div>
            <h4 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-text-muted">
              {siteConfig.footerLinks.pages.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-brand-neon transition-colors flex items-center gap-1.5"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials & Streams */}
          <div>
            <h4 className="font-heading font-bold text-sm text-text-primary uppercase tracking-wider mb-4">
              Community & Stream
            </h4>
            <ul className="space-y-2.5 text-sm text-text-muted">
              {siteConfig.footerLinks.social.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-brand-neon transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span>{item.label}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-brand-neon opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Responsible Gambling Block */}
        <div className="py-8 border-b border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-6 bg-surface-elevated/40 p-6 rounded-2xl my-8 border border-white/[0.06]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-brand-crimson/15 border border-brand-crimson/30 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-6 h-6 text-brand-crimson" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-bold text-sm text-white">
                  18+ Gamble Responsibly
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-crimson/20 text-brand-crimson border border-brand-crimson/30">
                  Strictly 18+
                </span>
              </div>
              <p className="text-xs text-text-muted mt-1 leading-relaxed">
                Gambling involves risk and can be addictive. Please gamble only with money you can
                afford to lose. Set limits and never chase losses.
              </p>
            </div>
          </div>

          <a
            href={siteConfig.responsibleGambling.therapyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-hover hover:bg-white/10 text-xs font-semibold text-text-primary border border-white/10 transition-colors shrink-0"
          >
            <HeartHandshake className="w-4 h-4 text-brand-lime" />
            <span>Visit GamblingTherapy.org</span>
            <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
          </a>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-text-faint">
          <p>
            &copy; {new Date().getFullYear()} The Bearded Gamer. All rights reserved.
          </p>
          <p className="text-center sm:text-right max-w-xl">
            {siteConfig.disclaimer.replace("[CASINO_NAME]", siteConfig.partnerCasino)}
          </p>
        </div>
      </div>
    </footer>
  );
}
