# The Bearded Gamer – Streamer Rewards, Race & Games Arena

A high-performance, mobile-first streamer rewards and gaming platform built for **The Bearded Gamer** on Kick ([kick.com/TThebeardedGamer](https://kick.com/TThebeardedGamer)).

Features a **$250 monthly wager race**, interactive podium and leaderboard table, VIP perks, and the dedicated **Games & Slot Battles Section** with real-time stream sync.

---

## 🎮 The "Games" Section Architecture

The Games section includes:
1. **Navbar Games Dropdown:**
   - **Slot Battles** (`/games/slot-battles`): "Streamer vs chat slot duels"
   - **Tournaments** (`/games/tournaments`): "Live slot bracket"
   - 150ms hover intent delay, full keyboard accessibility (ArrowDown, ArrowUp, Esc, Enter, Space), route highlighting, mobile accordion.
2. **Slot Battles Page (`/games/slot-battles`):**
   - Header with rolling scoreboard (`BEARDED GAMER : CHAT`) and admin reset.
   - **Server-Authoritative Random Slot Picker:**
     - 60-card horizontal case-opening roller generated deterministically using a seeded PRNG (`mulberry32`) from server `rollId`.
     - Decelerating easing curve `cubic-bezier(0.12, 0.8, 0.18, 1)` over 5.5s with sub-pixel jitter.
     - Web Audio synthesized tick clicks with mute/unmute toggle.
     - Reduced motion fallback (instant reveal with 300ms fade).
     - Reveal bar with `[-> The Bearded Gamer]`, `[-> Chat challenger]`, `[Random corner]`.
   - **Side-by-Side Battle Cards:**
     - Chamfered clipped corners (`clip-chamfer-lg`), -1deg tilt (`card-tilt`), diagonal stripe pattern.
     - "THE HOUSE": Streamer avatar, assigned slot, admin multiplier input, quick re-roll.
     - Center glowing "VS" badge with pulse animation.
     - "CHALLENGER · FROM CHAT": Kick chat random picker (1.5s slot-machine shuffle animation through active chatters), manual username fallback.
     - Multiplier comparison and `[DECLARE WINNER]` trigger.
     - Winner card gets gold foil pulse, floating crown icon, and `canvas-confetti` cannon. Loser desaturates.
3. **Tournament Bracket Page (`/games/tournaments`):**
   - 5 Column headers: `SLOT | QUARTERFINALS | SEMIFINALS | FINAL | CHAMPION`.
   - Column 1 (SLOT): 8 chamfered editable panels with 300ms debounced autosave + random roll icon.
   - Column 2 (QUARTERFINALS): 8 player entries in 4 match pairs with `[->]` advance buttons.
   - Downstream auto-clearing if an earlier winner is modified.
   - Champion crowned with gold foil card, crown icon, and confetti burst.
   - Responsive horizontal scroll with scroll-snap and sticky headers on screens < 900px.

---

## 🔒 Permissions & Security Model

- **Viewers (Public):**
  - Read-only viewing experience.
  - No edit controls rendered on screen.
  - Small lock chip displayed: `View only · updates live`.
  - All mutating endpoints reject unauthenticated requests with `403 Forbidden`.
  - Live state updates are pushed automatically in realtime via Server-Sent Events (SSE).
- **Admin (The Bearded Gamer only):**
  - Access to all mutation buttons, randomizers, multiplier inputs, winner declaration, and bracket controls.
  - Authenticated via secure HTTP-only signed session cookie (`bearded_admin_session`).
  - Rate-limited login portal at `/admin/login`.
  - Default Admin Password: `bearded2026` (configurable via `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH`).

---

## 📡 Real-Time SSE Architecture

- **Endpoint:** `GET /api/realtime?channel=battle` and `GET /api/realtime?channel=bracket`
- When an admin rolls a slot, assigns a corner, picks a chatter, updates multipliers, declares a winner, or advances a bracket match, the server:
  1. Persists state to `dbStore` (`.data-cache.json`).
  2. Broadcasts the event to all active SSE subscriber clients.
  3. Every viewer's screen updates seamlessly with zero manual polling or page reloads.
- Client hook `useRealtime` manages automatic reconnection with exponential backoff and on-reconnect resynchronization.

---

## 🎨 Design Tokens & Typography

| Token | Value | Description |
|---|---|---|
| Background | `#0B0908` | Near-black warm base |
| Surface Card | `#15110E` | Glassy dark card |
| Surface Elevated | `#1E1813` | Raised panels |
| Streamer Accent | `#FF7A1A` &rarr; `#FFB020` | Ember orange to amber gold |
| Chat Accent | `#B6FF3B` | Electric lime |
| Champion / Winner | `#FFC83D` | Gold medal foil |
| Text Primary | `#F5EFE8` | Soft off-white |
| Text Muted | `#A89C90` | Warm stone |
| Danger Accent | `#E5383B` | Crimson |

- **Display Font:** `Big Shoulders Display` (condensed bold italic) for titles, scores, and names.
- **Body Font:** `Inter` for clean readability.
- **Labels:** Small ALL-CAPS with 0.3em letter spacing (`tracking-ultra-wide`).
- **Shapes:** Chamfered clipped polygons (`clip-chamfer`, `clip-chamfer-lg`).

---

## 🛠️ Environment Variables

Create `.env.local` using `.env.example`:

```bash
# Admin Auth
ADMIN_PASSWORD=bearded2026
SESSION_SECRET=bearded_gamer_secret_key_2026_super_secure

# Kick Integration
KICK_CHANNEL=TThebeardedGamer
USE_MOCK_KICK=true

# Games Provider
USE_MOCK_GAMES=true

# Database (Prisma Schema available in prisma/schema.prisma)
DATABASE_URL=postgresql://user:password@localhost:5432/bearded_gamer?schema=public

# Affiliate & Leaderboard
SITE_CODE=BeardedGamer
NEXT_PUBLIC_CASINO_NAME=GAMBA
USE_MOCK_DATA=true
```

---

## 💻 Running the App

```bash
# Install dependencies
npm install

# Start Next.js development server
npm run dev

# Or build and run production server
npm run build
npm start
```

Access the application at `http://localhost:3000`:
- Slot Battles: `http://localhost:3000/games/slot-battles`
- Tournaments: `http://localhost:3000/games/tournaments`
- Admin Login: `http://localhost:3000/admin/login` (Password: `bearded2026`)
