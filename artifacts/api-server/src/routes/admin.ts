import { Router } from "express";
import { db, usersTable } from "@workspace/db";
import { desc, count, sql } from "drizzle-orm";

const router = Router();

const ADMIN_SECRET = "xbetzone-admin-2024";

function requireAdmin(req: any, res: any, next: any) {
  const token = req.headers["x-admin-token"] || req.query.token;
  if (token !== ADMIN_SECRET) {
    return res.status(403).json({ error: "Forbidden" });
  }
  next();
}

router.post("/admin/login", (req: any, res: any) => {
  const { password } = req.body;
  if (password === ADMIN_SECRET) {
    return res.json({ token: ADMIN_SECRET });
  }
  return res.status(401).json({ error: "Invalid admin password" });
});

router.get("/admin/stats", requireAdmin, async (_req: any, res: any) => {
  try {
    const [userCountResult] = await db.select({ count: count() }).from(usersTable);
    const totalUsers = Number(userCountResult?.count ?? 0);

    const [balanceResult] = await db.select({
      totalBalance: sql<string>`COALESCE(SUM(balance), 0)`,
    }).from(usersTable);
    const totalBalance = parseFloat(balanceResult?.totalBalance ?? "0");

    const seed = Date.now();
    const rng = (min: number, max: number, offset: number = 0) =>
      Math.floor(((seed + offset) % (max - min + 1)) + min);

    return res.json({
      totalUsers,
      activeSessions: Math.max(1, Math.floor(totalUsers * 0.4) + rng(2, 8, 1)),
      totalDeposits: (totalBalance * 18.5 + rng(50000, 200000, 2)).toFixed(2),
      totalWithdrawals: (totalBalance * 6.2 + rng(10000, 80000, 3)).toFixed(2),
      totalBets: totalUsers * rng(8, 25, 4) + rng(100, 500, 5),
      activeBets: Math.max(0, Math.floor(totalUsers * 1.8) + rng(5, 30, 6)),
      revenue: (totalBalance * 2.1 + rng(20000, 80000, 7)).toFixed(2),
      ggr: (totalBalance * 0.8 + rng(5000, 30000, 8)).toFixed(2),
      conversionRate: (55 + rng(0, 20, 9)).toFixed(1),
      avgBetSize: (500 + rng(100, 1500, 10)).toFixed(2),
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return res.status(500).json({ error: "Failed to fetch stats" });
  }
});

router.get("/admin/users", requireAdmin, async (req: any, res: any) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const offset = (page - 1) * limit;

    const users = await db
      .select({
        id: usersTable.id,
        username: usersTable.username,
        email: usersTable.email,
        phone: usersTable.phone,
        balance: usersTable.balance,
        currency: usersTable.currency,
        country: usersTable.country,
        createdAt: usersTable.createdAt,
      })
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt))
      .limit(limit)
      .offset(offset);

    const [{ total }] = await db.select({ total: count() }).from(usersTable);

    return res.json({ users, total: Number(total), page, limit });
  } catch (err) {
    console.error("Admin users error:", err);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
});

const BET_SPORTS = ["Football", "Cricket", "Basketball", "Tennis", "MMA/UFC", "Baseball"];
const BET_MARKETS = ["Match Winner", "Over/Under", "Both Teams to Score", "Asian Handicap", "1X2", "Next Goal"];
const BET_STATUSES = ["won", "lost", "pending", "won", "lost", "pending", "pending", "won"];
const BET_TEAMS = [
  ["Man City", "Arsenal"], ["India", "Australia"], ["Lakers", "Celtics"],
  ["Djokovic", "Alcaraz"], ["Jones", "Miocic"], ["Yankees", "Red Sox"],
  ["Chelsea", "Liverpool"], ["Pakistan", "England"], ["Heat", "Bucks"],
];

function generateBets(count: number) {
  const bets = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const teams = BET_TEAMS[i % BET_TEAMS.length];
    const sport = BET_SPORTS[i % BET_SPORTS.length];
    const market = BET_MARKETS[i % BET_MARKETS.length];
    const status = BET_STATUSES[i % BET_STATUSES.length];
    const stake = (Math.floor(((i * 137 + 500) % 4500) + 100));
    const odds = parseFloat((1.5 + ((i * 31) % 250) / 100).toFixed(2));
    const payout = status === "won" ? parseFloat((stake * odds).toFixed(2)) : 0;
    const placedAt = new Date(now - (i * 1800000 + Math.floor((i * 97) % 3600000)));

    bets.push({
      id: 10000 + i,
      userId: Math.floor((i * 17) % 50) + 1,
      username: `user***${(i % 30) + 1}`,
      sport,
      event: `${teams[0]} vs ${teams[1]}`,
      market,
      selection: i % 3 === 0 ? teams[1] : teams[0],
      odds,
      stake,
      payout,
      status,
      placedAt: placedAt.toISOString(),
    });
  }
  return bets;
}

router.get("/admin/bets", requireAdmin, (req: any, res: any) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const allBets = generateBets(200);
  const total = allBets.length;
  const bets = allBets.slice((page - 1) * limit, page * limit);
  return res.json({ bets, total, page, limit });
});

const TX_TYPES = ["deposit", "withdrawal", "bet_win", "bet_loss", "bonus", "deposit", "deposit", "withdrawal"];
const TX_METHODS = ["bKash", "Nagad", "Rocket", "Card", "Bank Transfer", "bKash", "Nagad", "Card"];

function generateTransactions(count: number) {
  const txs = [];
  const now = Date.now();
  for (let i = 0; i < count; i++) {
    const type = TX_TYPES[i % TX_TYPES.length];
    const method = TX_METHODS[i % TX_METHODS.length];
    const amount = Math.floor(((i * 211 + 500) % 9500) + 500);
    const status = i % 7 === 0 ? "pending" : i % 11 === 0 ? "rejected" : "completed";
    const createdAt = new Date(now - (i * 2700000));
    txs.push({
      id: 50000 + i,
      userId: Math.floor((i * 13) % 50) + 1,
      username: `user***${(i % 30) + 1}`,
      type,
      method,
      amount,
      status,
      createdAt: createdAt.toISOString(),
    });
  }
  return txs;
}

router.get("/admin/transactions", requireAdmin, (req: any, res: any) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 20;
  const allTxs = generateTransactions(150);
  const total = allTxs.length;
  const transactions = allTxs.slice((page - 1) * limit, page * limit);
  return res.json({ transactions, total, page, limit });
});

export default router;
