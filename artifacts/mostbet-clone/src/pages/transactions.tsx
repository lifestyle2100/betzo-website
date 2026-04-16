import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AccountLayout } from "./profile";
import { Link } from "wouter";
import { ArrowDownLeft, ArrowUpRight, Gift, TrendingUp, TrendingDown, CheckCircle, Clock, XCircle, Filter } from "lucide-react";

const TX_DATA = [
  { id: 50001, type: "deposit",    method: "bKash",         amount: 20000, status: "completed", date: "2024-04-10 09:15", ref: "BK202404100915" },
  { id: 50002, type: "bonus",      method: "Welcome Bonus", amount: 25000, status: "completed", date: "2024-04-10 09:16", ref: "BON202404100916" },
  { id: 50003, type: "bet_loss",   method: null,            amount: 1500,  status: "completed", date: "2024-04-12 20:05", ref: "BET202404120005" },
  { id: 50004, type: "bet_win",    method: null,            amount: 3700,  status: "completed", date: "2024-04-13 18:35", ref: "BET202404130035" },
  { id: 50005, type: "withdrawal", method: "bKash",         amount: 7000,  status: "completed", date: "2024-04-14 11:30", ref: "WD202404140001" },
  { id: 50006, type: "deposit",    method: "Nagad",         amount: 5000,  status: "completed", date: "2024-04-14 14:00", ref: "NG202404140100" },
  { id: 50007, type: "bet_loss",   method: null,            amount: 3000,  status: "completed", date: "2024-04-15 08:10", ref: "BET202404150010" },
  { id: 50008, type: "bet_win",    method: null,            amount: 5850,  status: "completed", date: "2024-04-15 20:40", ref: "BET202404150040" },
  { id: 50009, type: "withdrawal", method: "Rocket",        amount: 3000,  status: "pending",   date: "2024-04-16 08:00", ref: "WD202404160001" },
  { id: 50010, type: "deposit",    method: "Card",          amount: 10000, status: "completed", date: "2024-04-15 12:00", ref: "CD202404150120" },
  { id: 50011, type: "bet_loss",   method: null,            amount: 2500,  status: "completed", date: "2024-04-15 16:00", ref: "BET202404150060" },
  { id: 50012, type: "withdrawal", method: "bKash",         amount: 5000,  status: "rejected",  date: "2024-04-15 10:00", ref: "WD202404150001" },
];

const TYPE_CONFIG: Record<string, { label: string; icon: any; positive: boolean; color: string }> = {
  deposit:    { label: "Deposit",    icon: ArrowDownLeft, positive: true,  color: "#22c55e" },
  withdrawal: { label: "Withdrawal", icon: ArrowUpRight,  positive: false, color: "#ef4444" },
  bet_win:    { label: "Bet Win",    icon: TrendingUp,    positive: true,  color: "#3b82f6" },
  bet_loss:   { label: "Bet Loss",   icon: TrendingDown,  positive: false, color: "#f97316" },
  bonus:      { label: "Bonus",      icon: Gift,          positive: true,  color: "#a855f7" },
};
const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  completed: { label: "Completed", color: "#22c55e", icon: CheckCircle },
  pending:   { label: "Pending",   color: "#f97316", icon: Clock },
  rejected:  { label: "Rejected",  color: "#ef4444", icon: XCircle },
};

export default function TransactionsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("all");

  if (!user) return (
    <AccountLayout active="/transactions">
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-white text-[17px] font-bold mb-4">Please log in</p>
        <Link href="/login"><span className="px-5 py-2.5 rounded-lg font-black text-[hsl(214_42%_9%)] text-[15px] cursor-pointer" style={{ background: "#ffba00" }}>Log In</span></Link>
      </div>
    </AccountLayout>
  );

  const filtered = filter === "all" ? TX_DATA : TX_DATA.filter(t => t.type === filter);
  const totalIn = TX_DATA.filter(t => TYPE_CONFIG[t.type]?.positive && t.status === "completed").reduce((s, t) => s + t.amount, 0);
  const totalOut = TX_DATA.filter(t => !TYPE_CONFIG[t.type]?.positive && t.status === "completed").reduce((s, t) => s + t.amount, 0);

  return (
    <AccountLayout active="/transactions">
      <div className="space-y-4">
        <h1 className="text-[19px] font-black text-white">Transaction History</h1>

        {/* Summary */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total In", value: `৳${totalIn.toLocaleString()}`, color: "#22c55e", icon: ArrowDownLeft },
            { label: "Total Out", value: `৳${totalOut.toLocaleString()}`, color: "#ef4444", icon: ArrowUpRight },
            { label: "Net", value: `${totalIn - totalOut >= 0 ? "+" : ""}৳${(totalIn - totalOut).toLocaleString()}`, color: totalIn >= totalOut ? "#22c55e" : "#ef4444", icon: TrendingUp },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="rounded-xl p-4 border text-center" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <Icon size={13} style={{ color }} />
                <p className="text-[12px] text-[hsl(214_15%_45%)]">{label}</p>
              </div>
              <p className="text-[15px] font-black" style={{ color }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Filter pills */}
        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilter("all")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-colors ${filter === "all" ? "text-[hsl(214_42%_9%)]" : "text-[hsl(214_15%_50%)] hover:text-white"}`}
            style={{ background: filter === "all" ? "#ffba00" : "hsl(214 44% 12%)" }}>
            <Filter size={12} /> All
          </button>
          {Object.entries(TYPE_CONFIG).map(([key, { label, icon: Icon, color }]) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-bold transition-colors ${filter === key ? "text-white" : "text-[hsl(214_15%_50%)] hover:text-white"}`}
              style={{ background: filter === key ? `${color}25` : "hsl(214 44% 12%)", border: filter === key ? `1px solid ${color}50` : "1px solid transparent" }}>
              <Icon size={12} style={{ color: filter === key ? color : undefined }} /> {label}
            </button>
          ))}
        </div>

        {/* Transactions */}
        <div className="rounded-xl border overflow-hidden" style={{ borderColor: "hsl(214 28% 18%)" }}>
          {filtered.map((tx, i) => {
            const t = TYPE_CONFIG[tx.type];
            const s = STATUS_CONFIG[tx.status];
            const TIcon = t?.icon;
            const SIcon = s?.icon;
            return (
              <div key={tx.id} className="flex items-center gap-3 px-4 py-3.5 border-b last:border-0 hover:bg-white/[0.02] transition-colors"
                style={{ background: i % 2 === 0 ? "hsl(214 44% 10%)" : "hsl(214 44% 9%)", borderColor: "hsl(214 28% 14%)" }}>
                <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `${t?.color}18` }}>
                  {TIcon && <TIcon size={16} style={{ color: t?.color }} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-bold text-white">{t?.label}{tx.method ? ` · ${tx.method}` : ""}</p>
                  <p className="text-[12px] text-[hsl(214_15%_40%)] font-mono">{tx.ref} · {tx.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-[15px] font-black ${t?.positive ? "text-green-400" : "text-red-400"}`}>
                    {t?.positive ? "+" : "-"}৳{tx.amount.toLocaleString()}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold" style={{ color: s?.color }}>
                    {SIcon && <SIcon size={10} />} {s?.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="rounded-xl p-10 border text-center" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
            <p className="text-[hsl(214_15%_45%)]">No transactions found</p>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
