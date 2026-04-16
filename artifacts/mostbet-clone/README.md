# XBetZone — Sports Betting & Casino Platform

A full-featured sports betting and casino web application built with React + Vite (frontend) and Express (backend API).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, TypeScript |
| Package Manager | pnpm (monorepo workspace) |
| Real-time Odds | The-Odds-API (v4) |
| UI Components | shadcn/ui, Radix UI |
| Icons | Lucide React |
| State / Data | TanStack Query (React Query) |

---

## Project Structure

```
xbetzone/
├── artifacts/
│   ├── mostbet-clone/          # React + Vite frontend
│   │   ├── src/
│   │   │   ├── components/     # Reusable UI components
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── BetslipPanel.tsx
│   │   │   │   ├── CasinoGameCard.tsx
│   │   │   │   ├── GameLaunchModal.tsx
│   │   │   │   └── RealMatchCard.tsx
│   │   │   ├── pages/          # Route pages
│   │   │   │   ├── home.tsx
│   │   │   │   ├── sportsbook.tsx
│   │   │   │   ├── all-sports.tsx
│   │   │   │   ├── casino.tsx
│   │   │   │   ├── live-casino.tsx
│   │   │   │   ├── live.tsx
│   │   │   │   ├── virtual-sports.tsx
│   │   │   │   ├── esports.tsx
│   │   │   │   └── promotions.tsx
│   │   │   ├── lib/
│   │   │   │   └── sportsData.ts   # Sport definitions & helpers
│   │   │   ├── assets/
│   │   │   │   └── xbetzone-logo.png
│   │   │   └── App.tsx
│   │   └── package.json
│   └── api-server/             # Express REST API
│       ├── src/
│       │   ├── routes/
│       │   │   ├── sports.ts   # Live odds + caching
│       │   │   └── casino.ts   # Casino game catalog
│       │   └── app.ts
│       └── package.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Features

### Sports Betting
- **Live Odds** from The-Odds-API across 24 sports
- **Cricket** prioritized (IPL, PSL, T20 International, ODI World Cup)
- **All Sports page** — 370+ matches across 9 sport groups in one view
- Collapsible sport groups, team search, live data refresh
- Match cards with real-time odds (home / away / draw)

### Casino
- **74 games** from 17 real providers (Pragmatic Play, NetEnt, Evolution Gaming, Play'n GO, Microgaming, BGaming, Hacksaw Gaming, NoLimit City, Spribe, and more)
- Categories: Slots, Live Casino, Roulette, Blackjack, Baccarat, Poker, Crash Games, Jackpots
- Search by game name or provider
- Filter by provider

### Live Casino
- 20 live dealer tables (Evolution Gaming, Playtech, Ezugi, Pragmatic Play Live)
- Real-time player count display
- Categories: Roulette, Blackjack, Baccarat, Game Shows, Poker

### Game Launch Modal
- Click any game card to open the launch modal
- **Slot demos** (Pragmatic Play, BGaming): game loads directly in an embedded iframe
- **Live tables**: table stats, player count, registration CTA
- Fallback "Open in new tab" if iframe is blocked

### Other Pages
- **Virtual Sports** — 8 sports with countdowns and odds
- **eSports** — CS2, Dota 2, League of Legends, Valorant
- **Promotions** — Welcome bonus, reload bonus, free bets
- **Live Betting** — In-play matches

### Betslip
- Add bets from any page
- Singles and Combo (accumulator) modes
- BDT (৳) currency throughout
- Quick-stake buttons: ৳200 / ৳500 / ৳1k / ৳2.5k / ৳5k

---

## API Endpoints

### Sports (The-Odds-API)

| Endpoint | Description |
|---|---|
| `GET /api/sports` | List all available sports (cached 10 min) |
| `GET /api/odds/:sport` | Odds for a specific sport (cached 3 min) |
| `GET /api/scores/:sport` | Live scores (cached 90 sec) |
| `GET /api/odds/all` | All sports odds aggregated (cached 3 min per sport) |

### Casino

| Endpoint | Description |
|---|---|
| `GET /api/casino/games` | Game catalog with filters |
| `GET /api/casino/games/:id` | Single game details |

**Casino query params:** `category`, `provider`, `search`, `isLive`, `isHot`, `isNew`, `page`, `limit`

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ODDS_API_KEY` | Yes | API key from [the-odds-api.com](https://the-odds-api.com) |
| `SESSION_SECRET` | Yes | Secret for session management |
| `PORT` | Auto | Port for each service (set by Replit automatically) |

---

## Local Development

### Prerequisites
- Node.js 18+
- pnpm 8+

```bash
# Install pnpm if not installed
npm install -g pnpm

# Install all dependencies
pnpm install

# Set environment variables
# Create a .env file in artifacts/api-server/:
# ODDS_API_KEY=your_key_here
# SESSION_SECRET=any_random_string

# Start both services in parallel
pnpm run dev
```

The frontend runs on `http://localhost:5173` and the API on `http://localhost:8080`.

### Running individually

```bash
# Frontend only
pnpm --filter @workspace/mostbet-clone run dev

# API server only
pnpm --filter @workspace/api-server run dev
```

---

## Build for Production

```bash
# Build both packages
pnpm run build

# Or build individually
pnpm --filter @workspace/mostbet-clone run build
pnpm --filter @workspace/api-server run build
```

---

## API Key Setup

1. Sign up at [https://the-odds-api.com](https://the-odds-api.com)
2. Free tier: 500 requests/month
3. The app uses aggressive server-side caching to conserve quota:
   - Odds data: cached 3 minutes per sport
   - Sports list: cached 10 minutes
   - Live scores: cached 90 seconds

---

## Design System

| Token | Value |
|---|---|
| Background | `hsl(210 70% 11%)` dark blue |
| Accent (orange) | `hsl(15 100% 55%)` |
| Primary (blue) | `hsl(210 100% 56%)` |
| Font | Inter |
| Currency | BDT (৳) |

---

## Branding

- **Brand name:** XBetZone
- **Logo:** `artifacts/mostbet-clone/src/assets/xbetzone-logo.png`
- **Welcome bonus:** ৳30,000

---

## License

Private — all rights reserved.
