import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { AccountLayout } from "./profile";
import { Link } from "wouter";
import { Bell, CheckCircle, Gift, Trophy, TrendingUp, TrendingDown, AlertCircle, Info, Check } from "lucide-react";

const NOTIFS = [
  { id: 1, type: "bet_win",     title: "Bet Won! 🎉",         body: "Your bet on India vs Australia (Match Winner — India @1.85) won! ৳3,700 has been credited.", date: "2024-04-13 18:35", read: false },
  { id: 2, type: "deposit",     title: "Deposit Successful",  body: "৳5,000 via Nagad has been added to your account. Reference: NG202404140100", date: "2024-04-14 14:02", read: false },
  { id: 3, type: "bonus",       title: "Welcome Bonus Active!",body: "Your ৳25,000 welcome bonus has been credited! Wager ৳500,000 to unlock it.", date: "2024-04-10 09:16", read: false },
  { id: 4, type: "bet_loss",    title: "Bet Settled",         body: "Your bet on Man City vs Arsenal (Over 2.5 @2.10) has been settled. Result: Lost.", date: "2024-04-12 22:00", read: true },
  { id: 5, type: "promo",       title: "Weekly Cashback!",    body: "You have ৳450 cashback available from last week's sports losses. Claim before Monday!", date: "2024-04-15 08:00", read: true },
  { id: 6, type: "info",        title: "Account Verified",    body: "Your identity has been successfully verified. You can now withdraw up to ৳500,000 per day.", date: "2024-04-09 12:00", read: true },
  { id: 7, type: "withdrawal",  title: "Withdrawal Processed",body: "Your withdrawal of ৳7,000 via bKash has been processed. Expected: 1-12 hours.", date: "2024-04-14 11:35", read: true },
  { id: 8, type: "bet_win",     title: "Bet Won! 🎉",         body: "Your bet on Team Liquid vs FaZe (FaZe Clan @1.95) won! ৳5,850 credited.", date: "2024-04-15 20:42", read: true },
  { id: 9, type: "info",        title: "New Feature: Live Cash Out", body: "You can now cash out your live bets before the event ends! Try it on your next bet.", date: "2024-04-16 06:00", read: true },
  { id: 10, type: "promo",      title: "eSports Bonus Waiting!", body: "Place your first eSports bet and get a 200% bonus up to ৳10,000!", date: "2024-04-16 07:00", read: false },
];

const TYPE_CONFIG: Record<string, { icon: any; color: string }> = {
  bet_win:    { icon: Trophy,       color: "#22c55e" },
  bet_loss:   { icon: TrendingDown, color: "#ef4444" },
  deposit:    { icon: TrendingUp,   color: "#3b82f6" },
  withdrawal: { icon: TrendingDown, color: "#f97316" },
  bonus:      { icon: Gift,         color: "#a855f7" },
  promo:      { icon: Gift,         color: "#ffba00" },
  info:       { icon: Info,         color: "#06b6d4" },
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const [notifs, setNotifs] = useState(NOTIFS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  if (!user) return (
    <AccountLayout active="/notifications">
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-white text-[17px] font-bold mb-4">Please log in</p>
        <Link href="/login"><span className="px-5 py-2.5 rounded-lg font-black text-[hsl(214_42%_9%)] text-[15px] cursor-pointer" style={{ background: "#ffba00" }}>Log In</span></Link>
      </div>
    </AccountLayout>
  );

  const unreadCount = notifs.filter(n => !n.read).length;
  const displayed = filter === "unread" ? notifs.filter(n => !n.read) : notifs;

  function markAllRead() { setNotifs(n => n.map(x => ({ ...x, read: true }))); }
  function markRead(id: number) { setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x)); }

  return (
    <AccountLayout active="/notifications">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <h1 className="text-[19px] font-black text-white">Notifications</h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[12px] font-black text-white" style={{ background: "#ef4444" }}>{unreadCount}</span>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllRead} className="flex items-center gap-1.5 text-[13px] font-semibold text-[hsl(210_100%_65%)] hover:text-white transition-colors">
              <Check size={13} /> Mark all read
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(["all", "unread"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-[13px] font-bold capitalize transition-colors ${filter === f ? "text-[hsl(214_42%_9%)]" : "text-[hsl(214_15%_50%)] hover:text-white"}`}
              style={{ background: filter === f ? "#ffba00" : "hsl(214 44% 12%)" }}>
              {f} {f === "unread" && unreadCount > 0 ? `(${unreadCount})` : ""}
            </button>
          ))}
        </div>

        {/* Notifications list */}
        <div className="space-y-2">
          {displayed.map(n => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.info;
            const Icon = cfg.icon;
            return (
              <div key={n.id} onClick={() => markRead(n.id)}
                className={`rounded-xl p-4 border cursor-pointer transition-all hover:border-white/20 ${!n.read ? "border-l-2" : ""}`}
                style={{
                  background: n.read ? "hsl(214 44% 10%)" : "hsl(214 44% 11%)",
                  borderColor: n.read ? "hsl(214 28% 18%)" : undefined,
                  ...((!n.read) ? { borderLeftColor: cfg.color, borderTopColor: "hsl(214 28% 18%)", borderRightColor: "hsl(214 28% 18%)", borderBottomColor: "hsl(214 28% 18%)" } : {}),
                }}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: `${cfg.color}18` }}>
                    <Icon size={16} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-[14px] font-bold ${n.read ? "text-[hsl(214_15%_65%)]" : "text-white"}`}>{n.title}</p>
                      {!n.read && <div className="w-2 h-2 rounded-full shrink-0 mt-1.5" style={{ background: cfg.color }} />}
                    </div>
                    <p className="text-[13px] text-[hsl(214_15%_45%)] mt-0.5 leading-relaxed">{n.body}</p>
                    <p className="text-[11px] text-[hsl(214_15%_35%)] mt-1.5">{n.date}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {displayed.length === 0 && (
          <div className="rounded-xl p-10 border text-center" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
            <Bell size={32} className="mx-auto mb-3 text-[hsl(214_15%_35%)]" />
            <p className="text-[hsl(214_15%_45%)]">No {filter === "unread" ? "unread " : ""}notifications</p>
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
