import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, Big_Shoulders_Display } from "next/font/google";
import "./globals.css";
import { SmoothScrollProvider } from "@/lib/smooth-scroll";
import { ScrollProgressBar } from "@/components/layout/scroll-progress";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { FloatingDecorations } from "@/components/layout/floating-decorations";
import { SpaceBackground } from "@/components/layout/space-background";
import { FloatingStreamPopup } from "@/components/layout/floating-stream-popup";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { siteConfig } from "@/config/site";

const headingFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const bodyFont = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const displayFont = Big_Shoulders_Display({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["700", "800", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://thebeardedgamer.rewards"),
  title: {
    default: "The Bearded Gamer | Official Streamer Rewards & Races",
    template: "%s | The Bearded Gamer",
  },
  description: siteConfig.description,
  keywords: [
    "The Bearded Gamer",
    "Kick Streamer",
    "Casino Rewards",
    "Leaderboard",
    "Rakeback",
    "Slot Tournaments",
    "Promo Code BeardedGamer",
  ],
  authors: [{ name: "The Bearded Gamer" }],
  creator: "The Bearded Gamer",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://thebeardedgamer.rewards",
    siteName: siteConfig.name,
    title: "The Bearded Gamer | Streamer Rewards & $250 Wager Race",
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "The Bearded Gamer | Streamer Rewards & Races",
    description: siteConfig.description,
    creator: "@thebeardedgamer",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0908",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} ${displayFont.variable}`}
    >
      <body className="antialiased selection:bg-brand-neon selection:text-black min-h-screen flex flex-col justify-between">
        {/* Cinematic Loading Screen with Uploaded Image */}
        <LoadingScreen />

        <SmoothScrollProvider>
          {/* Scroll Progress Bar at the top of the navbar */}
          <ScrollProgressBar />

          {/* Sticky Glass Navbar */}
          <Navbar />

          {/* Cosmic Space Theme with Shooting Stars & Starfield */}
          <SpaceBackground />

          {/* Global Floating Decorative Objects with GSAP Parallax & Framer Motion Idle Float */}
          <FloatingDecorations />

          {/* Live Floating Stream Pop-up on the bottom left */}
          <FloatingStreamPopup />

          {/* Main Page Route Content */}
          <main className="relative z-10 flex-grow">{children}</main>

          {/* Footer */}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
