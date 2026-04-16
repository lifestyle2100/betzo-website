import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AccountLayout } from "./profile";
import { Link } from "wouter";
import { Trophy, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";

const BETS = [
  { id: 10001, sport: "🏏", event: "India vs Australia", league: "ODI Series", market: "Match Winner", selection: "India", odds: 1.85, stake: 2000, payout: 3700, status: "won", date: "2024-04-13 18:30", type: "Single" },
  { id: 10002, sport: "⚽", event: "Man City vs Arsenal", league: "Premier League", market: "Over/Under 2.5", selection: "Over 2.5", odds: 2.10, stake: 1500, payout: 0, status: "lost", date: "2024-04-12 20:00", type: "Single" },
  { id: 10003, sport: "🏀", event: "Lakers vs Celtics", league: "NBA", market: "Asian Handicap", selection: "Lakers -5.5", odds: 1.92, stake: 5000, payout: 0, status: "pending", date: "2024-04-16 02:30", type: "Single" },
  { id: 10004, sport: "🎾", event: "Djokovic vs Alcaraz", league: "ATP Tour", market: "Match Winner", selection: "Alcaraz", odds: 2.40, stake: 2500, payout: 0, status: "pending", date: "2024-04-16 16:00", type: "Single" },
  { id: 10005, sport: "⚽", event: "Chelsea vs Liverpool", league: "Premier League", market: "Both Teams to Score", selection: "Yes", odds: 1.75, stake: 3000, payout: 0, status: "lost", date: "2024-04-11 20:00", type: "Single" },
  { id: 10006, sport: "🏏", event: "Pakistan vs England", league: "T20 Intl", market: "Match Winner", selection: "Pakistan", odds: 2.20, stake: 1000, payout: 2200, status: "won", date: "2024-04-10 14:00", type: "Single" },
  { id: 10007, sport: "🥊", event: "Jones vs Miocic", league: "UFC 295", market: "Method of Victory", selection: "KO/TKO", odds: 3.50, stake: 1000, payout: 0, status: "lost", date: "2024-04-08 04:00", type: "Single" },
  { id: 10008, sport: "🎮", event: "Team Liquid vs FaZe", league: "CS2 Major", market: "Match Winner", selection: "FaZe Clan", odds: 1.95, stake: 3000, payout: 5850, status: "won", date: "2024-04-07 15:00", type: "Single" },
  { id: 10009, sport: "⚽", event: "Barcelona vs Real Madrid", league: "La Liga", market: "1X2", selection: "Real Madrid", odds: 2.65, stake: 4000, payout: 0, status: "pending", date: "2024-04-16 21:00", type: "Single" },
  { id: 10010, sport: "🏏", event: "Bangladesh vs India", league: "Asia Cup", market: "Match Winner", selection: "Bangladesh", odds: 4.50, stake: 500, payout: 0, status: "lost", date: "2024-04-05 10:00", type: "Single" },
];

const STATUS_MAP: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  won:     { label: "Won",     color: "#22c55e", bg: "rgba(34,197,94,0.12)",   icon: CheckCircle },
  lost:    { label: "Lost",    color: "#ef4444", bg: "rgba(239,68,68,0.12)",   icon: XCircle },
  pending: { label: "Pending", color: "#f97316", bg: "rgba(249,115,22,0.12)", icon: Clock },
};

export default function MyBetsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState<"all" | "pending" | "won" | "lost">("all");

  if (!user) return (
    <AccountLayout active="/my-bets">
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-white text-[17px] font-bold mb-4">Please log in to view your bets</p>
        <Link href="/login"><span className="px-5 py-2.5 rounded-lg font-black text-[hsl(214_42%_9%)] text-[15px] cursor-pointer" style={{ background: "#ffba00" }}>Log In</span></Link>
      </div>
    </AccountLayout>
  );

  const filtered = filter === "all" ? BETS : BETS.filter(b => b.status === filter);
  const totalStake = BETS.reduce((s, b) => s + b.stake, 0);
  const totalPayout = BETS.reduce((s, b) => s + b.payout, 0);
  const wonCount = BETS.filter(b => b.status === "won").length;
  const pendingCount = BETS.filter(b => b.status === "pending").length;

  return (
    <AccountLayout active="/my-bets">
      <div className="space-y-4">
        <h1 className="text-[19px] font-black text-white">My Bets</h1>

        {/* Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Bets", value: BETS.length, color: "#3b82f6", icon: Trophy },
            { label: "Won", value: wonCount, color: "#22c55e", icon: CheckCircle },
            { label: "Pending", value: pendingCount, color: "#f97316", icon: Clock },
            { label: "Profit/Loss", value: `${totalPayout - totalStake >= 0 ? "+" : ""}৳${(totalPayout - totalStake).toLocaleString()}`, color: totalPayout >= totalStake ? "#22c55e" : "#ef4444", icon: TrendingUp },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="rounded-xl p-4 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
              <div className="flex items-center gap-2 mb-1">
                <Icon size={14} style={{ color }} />
                <p className="text-[12px] text-[hsl(214_15%_45%)]">{label}</p>
              </div>
              <p className="text-[17px] font-black" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(["all", "pending", "won", "lost"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-bold capitalize transition-colors ${filter === f ? "text-[hsl(214_42%_9%)]" : "text-[hsl(214_15%_50%)] hover:text-white"}`}
              style={{ background: filter === f ? "#ffba00" : "hsl(214 44% 12%)" }}>
              {f} {f !== "all" && `(${BETS.filter(b => b.status === f).length})`}
            </button>
          ))}
        </div>

        {/* Bet list */}
        <div className="space-y-2.5">
          {filtered.map(bet => {
            const s = STATUS_MAP[bet.status];
            const Icon = s.icon;
            return (
              <div key={bet.id} className="rounded-xl p-4 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="text-[17px]">{bet.sport}</span>
                      <span className="text-[14px] font-bold text-white truncate">{bet.event}</span>
                      <span className="text-[12px] text-[hsl(214_15%_40%)] shrink-0">{bet.league}</span>
                    </div>
                    <p className="text-[13px] text-[hsl(214_15%_50%)] mb-1">{bet.market}</p>
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="px-2 py-0.5 rounded text-[12px] font-bold text-white" style={{ background: "hsl(214 44% 15%)" }}>{bet.selection}</span>
                      <span className="text-[13px] font-black text-[#ffba00]">@{bet.odds}</span>
                      <span className="text-[12px] text-[hsl(214_15%_45%)]">{bet.date}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[12px] font-black mb-2`} style={{ background: s.bg, color: s.color }}>
                      <Icon size={11} /> {s.label}
                    </span>
                    <div>
                      <p className="text-[12px] text-[hsl(214_15%_45%)]">Stake: <span className="text-white font-bold">৳{bet.stake.toLocaleString()}</span></p>
                      {bet.status === "won" && <p className="text-[13px] font-black text-green-400">+৳{bet.payout.toLocaleString()}</p>}
                      {bet.status === "pending" && <p className="text-[13px] font-bold text-[#ffba00]">Potential: ৳{(bet.stake * bet.odds).toFixed(0)}</p>}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-xl p-10 border text-center" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
            <Trophy size={32} className="mx-auto mb-3 text-[hsl(214_15%_35%)]" />
            <p className="text-[hsl(214_15%_45%)]">No {filter} bets found</p>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
