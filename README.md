# XBetZone — Full Betting Website

  A full-featured Mostbet-style betting platform built with **React + Vite** (frontend) and **Express** (backend API) in a **pnpm monorepo**.

  ## 🎯 Features

  ### Frontend (artifacts/mostbet-clone)
  - ⚽ **Sportsbook** — Live odds, bet slip, combo bets
  - 📡 **Live Betting** — Real-time in-play markets
  - 🎰 **Casino** — 5,000+ game grid with provider filters
  - 🎲 **Live Casino** — Table games with live dealers
  - 🚀 **Aviator** — Playable crash game
  - ⚡ **Fast Games** — Mines, Plinko, Dice, Crash and more
  - ♠️ **Poker** — Cash tables + tournaments
  - 🏆 **Tournaments** — Prize pool leaderboards
  - 🎮 **eSports** — CS2, DOTA2, LoL, Valorant
  - 🏅 **Fantasy Sport** — Contest browser
  - 🔮 **Virtual Sports** — Scheduled virtual events
  - 📋 **Toto** — Pick-12 outcome coupon
  - 🎁 **Promotions** — Bonus cards
  - 👤 **8 Account Pages** — Profile, Deposit, Withdraw, Bets, Bonuses, Notifications, Security, Verification
  - 🛡️ **Admin Panel** — Dashboard, Users, Bets, Transactions, Withdrawals (approve/reject), Promotions, Reports, Support tickets, Settings
  - 🌍 **8 Languages** — EN, BN, HI, UR, AR, FR, PT, RU
  - 💬 **Live Support Chat** — Floating chat widget

  ### Backend (artifacts/api-server)
  - Express 5 + TypeScript
  - PostgreSQL + Drizzle ORM
  - JWT auth (register, login, /me)
  - Admin API with token auth
  - Live odds from the-odds-api.com (fallback to mock data)

  ## 🚀 Quick Start

  ```bash
  # Install dependencies
  pnpm install

  # Start API server
  pnpm --filter @workspace/api-server run dev

  # Start frontend
  pnpm --filter @workspace/mostbet-clone run dev
  ```

  ## 🔑 Environment Variables

  | Variable | Description |
  |---|---|
  | `DATABASE_URL` | PostgreSQL connection string |
  | `ODDS_API_KEY` | API key from the-odds-api.com |
  | `JWT_SECRET` | Secret for JWT tokens |
  | `ADMIN_SECRET` | Admin panel password (default: xbetzone-admin-2024) |
  | `PORT` | Server port (default: 3000) |

  ## 🏗️ Stack

  - **Frontend**: React 18, Vite, TailwindCSS, Wouter, TanStack Query
  - **Backend**: Express 5, TypeScript, Drizzle ORM
  - **Database**: PostgreSQL (MySQL on VPS)
  - **Monorepo**: pnpm workspaces
  - **Icons**: Lucide React
  - **Font**: Roboto (matches Mostbet)

  ## 🎨 Color Scheme

  - Background: `hsl(214 36% 12%)`
  - Header: `hsl(214 44% 8%)`
  - Accent/Gold: `#ffba00`

  ## 👤 Demo Credentials

  - **User**: demo@xbetzone.com / Demo@1234
  - **Admin**: /admin → password: xbetzone-admin-2024

  ## 📦 Build

  ```bash
  cd artifacts/mostbet-clone
  pnpm run build
  ```
  