import { useState, useEffect, useCallback } from "react";
import {
  LayoutDashboard, Users, ClipboardList, CreditCard, Settings,
  LogOut, TrendingUp, TrendingDown, Activity, ShieldCheck,
  RefreshCw, ChevronLeft, ChevronRight, Search, Eye, Ban,
  CheckCircle, Clock, XCircle, DollarSign, Percent, Trophy,
  Gift, BarChart2, MessageSquare, Wallet, GamepadIcon,
  ArrowUpRight, ArrowDownRight, AlertCircle, Filter,
  Download, Bell, Star, Zap, ToggleLeft, ToggleRight, Send,
} from "lucide-react";

const API_BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const ADMIN_TOKEN_KEY = "xbz_admin_token";

type Tab = "dashboard" | "users" | "bets" | "transactions" | "withdrawals" | "promotions" | "reports" | "support" | "settings";

interface Stats {
  totalUsers: number; activeSessions: number; totalDeposits: string;
  totalWithdrawals: string; totalBets: number; activeBets: number;
  revenue: string; ggr: string; conversionRate: string; avgBetSize: string;
}

function fmt(n: number | string) {
  const num = typeof n === "string" ? parseFloat(n) : n;
  if (num >= 1_000_000) return `৳${(num / 1_000_000).toFixed(2)}M`;
  if (num >= 1_000) return `৳${(num / 1_000).toFixed(1)}K`;
  return `৳${num.toLocaleString()}`;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) +
    " " + d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

const STATUS_STYLES: Record<string, string> = {
  won: "bg-green-500/15 text-green-400 border border-green-500/30",
  lost: "bg-red-500/15 text-red-400 border border-red-500/30",
  pending: "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30",
  completed: "bg-green-500/15 text-green-400 border border-green-500/30",
  rejected: "bg-red-500/15 text-red-400 border border-red-500/30",
};

const TX_TYPE_STYLES: Record<string, string> = {
  deposit: "text-green-400", withdrawal: "text-red-400",
  bet_win: "text-blue-400", bet_loss: "text-orange-400", bonus: "text-purple-400",
};

/* ─── Mock data for new sections ─── */
const MOCK_WITHDRAWALS = [
  { id: 301, user: "rafi***23", email: "rafi@example.com", amount: 15000, method: "bKash", account: "01712***567", requested: "2026-04-16T08:22:00Z", status: "pending" },
  { id: 302, user: "sarah***09", email: "sarah@example.com", amount: 8500, method: "Nagad", account: "01811***223", requested: "2026-04-16T07:55:00Z", status: "pending" },
  { id: 303, user: "karim***77", email: "karim@example.com", amount: 50000, method: "Bank Transfer", account: "BRAC****7841", requested: "2026-04-16T06:10:00Z", status: "pending" },
  { id: 304, user: "demo***01", email: "demo@xbetzone.com", amount: 3200, method: "bKash", account: "01688***991", requested: "2026-04-15T22:30:00Z", status: "pending" },
  { id: 305, user: "nadia***55", email: "nadia@example.com", amount: 22000, method: "Rocket", account: "01955***401", requested: "2026-04-15T20:15:00Z", status: "pending" },
];

const MOCK_PROMOTIONS = [
  { id: 1, name: "Welcome Bonus 125%", type: "deposit", value: "125%", maxBonus: "৳30,000", wagering: "20x", active: true, claimed: 842, expires: "2026-12-31" },
  { id: 2, name: "Reload Friday 50%", type: "deposit", value: "50%", maxBonus: "৳10,000", wagering: "15x", active: true, claimed: 312, expires: "2026-12-31" },
  { id: 3, name: "Free Bet Mondays", type: "freebet", value: "৳500", maxBonus: "৳500", wagering: "5x", active: true, claimed: 1204, expires: "2026-12-31" },
  { id: 4, name: "Aviator Cashback 10%", type: "cashback", value: "10%", maxBonus: "৳5,000", wagering: "1x", active: false, claimed: 0, expires: "2026-06-30" },
  { id: 5, name: "Refer a Friend", type: "referral", value: "৳500", maxBonus: "৳500", wagering: "10x", active: true, claimed: 178, expires: "2026-12-31" },
];

const MOCK_SUPPORT = [
  { id: 1, user: "rafi***23", subject: "Withdrawal not received", message: "I requested a withdrawal 3 hours ago but the money has not arrived in my bKash account. Order ID #302.", status: "open", priority: "high", time: "2026-04-16T08:40:00Z" },
  { id: 2, user: "sarah***09", subject: "Bonus not credited", message: "I made a deposit of ৳5000 but the welcome bonus was not added to my account.", status: "open", priority: "medium", time: "2026-04-16T07:20:00Z" },
  { id: 3, user: "user***42", subject: "Account verification", message: "I submitted my documents 2 days ago. Can you check the status?", status: "replied", priority: "low", time: "2026-04-15T18:00:00Z" },
  { id: 4, user: "karim***77", subject: "Login issue", message: "I can't log in to my account. Forgot password email is not coming.", status: "resolved", priority: "medium", time: "2026-04-15T14:30:00Z" },
  { id: 5, user: "nadia***55", subject: "Wrong odds charged", message: "I placed a bet at 2.40 odds but my slip shows 2.10. Please review.", status: "open", priority: "high", time: "2026-04-16T09:05:00Z" },
];

const MOCK_GAMES = [
  { name: "Aviator", provider: "Spribe", type: "Fast Game", rtp: "97.00%", active: true, bets: 18421, revenue: "৳2.3L" },
  { name: "Crash", provider: "BC Originals", type: "Fast Game", rtp: "96.00%", active: true, bets: 9203, revenue: "৳1.1L" },
  { name: "Mines", provider: "Spribe", type: "Fast Game", rtp: "96.00%", active: true, bets: 7841, revenue: "৳92K" },
  { name: "Teen Patti", provider: "Evolution", type: "Live Casino", rtp: "97.50%", active: true, bets: 5420, revenue: "৳1.8L" },
  { name: "Andar Bahar", provider: "Evolution", type: "Live Casino", rtp: "97.30%", active: true, bets: 4102, revenue: "৳1.2L" },
  { name: "Lightning Roulette", provider: "Evolution", type: "Live Casino", rtp: "97.30%", active: false, bets: 0, revenue: "৳0" },
  { name: "Blackjack VIP", provider: "NetEnt", type: "Casino", rtp: "99.50%", active: true, bets: 2341, revenue: "৳45K" },
  { name: "Gates of Olympus", provider: "Pragmatic", type: "Casino", rtp: "96.50%", active: true, bets: 8820, revenue: "৳1.4L" },
];

const REVENUE_CHART = [
  { day: "Mon", value: 82000 }, { day: "Tue", value: 115000 }, { day: "Wed", value: 98000 },
  { day: "Thu", value: 143000 }, { day: "Fri", value: 189000 }, { day: "Sat", value: 222000 }, { day: "Sun", value: 176000 },
];

const SPORT_BREAKDOWN = [
  { sport: "Cricket", bets: 4820, revenue: "৳3.2L", share: 42 },
  { sport: "Football", bets: 3102, revenue: "৳2.1L", share: 27 },
  { sport: "Basketball", bets: 1841, revenue: "৳1.2L", share: 16 },
  { sport: "Tennis", bets: 820, revenue: "৳54K", share: 7 },
  { sport: "Others", bets: 920, revenue: "৳68K", share: 8 },
];

const ACTIVITY_LOG = [
  { action: "User Suspended", detail: "user#42 suspended for suspicious activity", time: "2 min ago", color: "text-red-400" },
  { action: "Withdrawal Approved", detail: "৳25,000 to bKash for nadia***55", time: "8 min ago", color: "text-green-400" },
  { action: "Promotion Updated", detail: "Reload Friday 50% — max bonus changed", time: "22 min ago", color: "text-yellow-400" },
  { action: "Support Resolved", detail: "Ticket #4 closed — login issue", time: "45 min ago", color: "text-blue-400" },
  { action: "New User", detail: "56 new registrations in last hour", time: "1 hour ago", color: "text-purple-400" },
];

/* ─── Sub-components ─── */
function StatCard({ icon: Icon, label, value, sub, color = "#ffba00", trend }: {
  icon: any; label: string; value: string | number; sub?: string; color?: string; trend?: number;
}) {
  return (
    <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-[12px] text-[hsl(214_15%_50%)] font-semibold uppercase tracking-wider mb-1">{label}</p>
          <p className="text-[22px] font-black text-white mt-1">{value}</p>
          {sub && <p className="text-[12px] text-[hsl(214_15%_45%)] mt-1">{sub}</p>}
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="p-2.5 rounded-lg" style={{ background: `${color}18` }}>
            <Icon size={20} style={{ color }} />
          </div>
          {trend !== undefined && (
            <span className={`flex items-center gap-0.5 text-[12px] font-bold ${trend >= 0 ? "text-green-400" : "text-red-400"}`}>
              {trend >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function Pagination({ page, total, limit, onChange }: {
  page: number; total: number; limit: number; onChange: (p: number) => void;
}) {
  const pages = Math.ceil(total / limit);
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between mt-4 px-1">
      <span className="text-[13px] text-[hsl(214_15%_45%)]">
        Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
      </span>
      <div className="flex items-center gap-1.5">
        <button onClick={() => onChange(page - 1)} disabled={page === 1}
          className="p-1.5 rounded border disabled:opacity-30 hover:bg-white/5 transition-colors"
          style={{ borderColor: "hsl(214 28% 20%)" }}>
          <ChevronLeft size={15} />
        </button>
        {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
          const p = page <= 4 ? i + 1 : page + i - 3;
          if (p > pages || p < 1) return null;
          return (
            <button key={p} onClick={() => onChange(p)}
              className={`w-8 h-8 rounded text-[13px] font-semibold transition-colors ${p === page ? "text-[hsl(214_42%_9%)] font-black" : "hover:bg-white/5 text-[hsl(214_15%_50%)]"}`}
              style={p === page ? { background: "#ffba00" } : {}}>
              {p}
            </button>
          );
        })}
        <button onClick={() => onChange(page + 1)} disabled={page === pages}
          className="p-1.5 rounded border disabled:opacity-30 hover:bg-white/5 transition-colors"
          style={{ borderColor: "hsl(214 28% 20%)" }}>
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border overflow-hidden" style={{ borderColor: "hsl(214 28% 18%)" }}>
      <div className="overflow-x-auto">
        <table className="w-full text-[13px]">{children}</table>
      </div>
    </div>
  );
}

function TH({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr style={{ background: "hsl(214 44% 9%)", borderBottom: "1px solid hsl(214 28% 18%)" }}>
        {cols.map(h => (
          <th key={h} className="px-4 py-3 text-left text-[12px] font-bold text-[hsl(214_15%_45%)] uppercase tracking-wider whitespace-nowrap">{h}</th>
        ))}
      </tr>
    </thead>
  );
}

function TR({ i, children }: { i: number; children: React.ReactNode }) {
  return (
    <tr className="transition-colors hover:bg-white/[0.02]"
      style={{ borderBottom: "1px solid hsl(214 28% 12%)", background: i % 2 === 0 ? "hsl(214 44% 10%)" : "hsl(214 44% 9%)" }}>
      {children}
    </tr>
  );
}

function SkeletonRows({ rows, cols }: { rows: number; cols: number }) {
  return (
    <>
      {Array(rows).fill(0).map((_, i) => (
        <tr key={i} style={{ borderBottom: "1px solid hsl(214 28% 14%)" }}>
          {Array(cols).fill(0).map((_, j) => (
            <td key={j} className="px-4 py-3">
              <div className="h-4 rounded animate-pulse" style={{ background: "hsl(214 44% 14%)", width: `${60 + (j * 15) % 40}%` }} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/* ─── Main component ─── */
export default function AdminPage() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(ADMIN_TOKEN_KEY));
  const [loginPw, setLoginPw] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [usersTotal, setUsersTotal] = useState(0);
  const [usersPage, setUsersPage] = useState(1);
  const [bets, setBets] = useState<any[]>([]);
  const [betsTotal, setBetsTotal] = useState(0);
  const [betsPage, setBetsPage] = useState(1);
  const [txs, setTxs] = useState<any[]>([]);
  const [txsTotal, setTxsTotal] = useState(0);
  const [txsPage, setTxsPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // Withdrawal state
  const [withdrawals, setWithdrawals] = useState(MOCK_WITHDRAWALS);
  // Promotions state
  const [promotions, setPromotions] = useState(MOCK_PROMOTIONS);
  // Support state
  const [support, setSupport] = useState(MOCK_SUPPORT);
  const [selectedTicket, setSelectedTicket] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  // Games state
  const [games, setGames] = useState(MOCK_GAMES);
  // Settings save indicator
  const [settingsSaved, setSettingsSaved] = useState(false);
  // Sidebar collapsed on mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const apiFetch = useCallback(async (path: string) => {
    const r = await fetch(`${API_BASE}/api${path}`, {
      headers: { "x-admin-token": token ?? "" },
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    apiFetch("/admin/stats").then(setStats).catch(console.error);
  }, [token, apiFetch, refreshKey]);

  useEffect(() => {
    if (!token || tab !== "users") return;
    setLoading(true);
    apiFetch(`/admin/users?page=${usersPage}&limit=15`)
      .then(d => { setUsers(d.users); setUsersTotal(d.total); })
      .catch(console.error).finally(() => setLoading(false));
  }, [token, tab, usersPage, apiFetch, refreshKey]);

  useEffect(() => {
    if (!token || tab !== "bets") return;
    setLoading(true);
    apiFetch(`/admin/bets?page=${betsPage}&limit=15`)
      .then(d => { setBets(d.bets); setBetsTotal(d.total); })
      .catch(console.error).finally(() => setLoading(false));
  }, [token, tab, betsPage, apiFetch, refreshKey]);

  useEffect(() => {
    if (!token || tab !== "transactions") return;
    setLoading(true);
    apiFetch(`/admin/transactions?page=${txsPage}&limit=15`)
      .then(d => { setTxs(d.transactions); setTxsTotal(d.total); })
      .catch(console.error).finally(() => setLoading(false));
  }, [token, tab, txsPage, apiFetch, refreshKey]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const r = await fetch(`${API_BASE}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: loginPw }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      localStorage.setItem(ADMIN_TOKEN_KEY, d.token);
      setToken(d.token);
    } catch (err: any) {
      setLoginError(err.message || "Invalid password");
    } finally {
      setLoginLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setToken(null);
    setStats(null);
  }

  function approveWithdrawal(id: number) {
    setWithdrawals(ws => ws.map(w => w.id === id ? { ...w, status: "approved" } : w));
  }

  function rejectWithdrawal(id: number) {
    setWithdrawals(ws => ws.map(w => w.id === id ? { ...w, status: "rejected" } : w));
  }

  function togglePromo(id: number) {
    setPromotions(ps => ps.map(p => p.id === id ? { ...p, active: !p.active } : p));
  }

  function toggleGame(name: string) {
    setGames(gs => gs.map(g => g.name === name ? { ...g, active: !g.active } : g));
  }

  function sendReply(ticketId: number) {
    if (!replyText.trim()) return;
    setSupport(ss => ss.map(s => s.id === ticketId ? { ...s, status: "replied" } : s));
    setReplyText("");
  }

  function saveSettings() {
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  }

  const NAV_TABS: { id: Tab; icon: any; label: string; badge?: number }[] = [
    { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { id: "users", icon: Users, label: "Users" },
    { id: "bets", icon: ClipboardList, label: "Bets" },
    { id: "transactions", icon: CreditCard, label: "Transactions" },
    { id: "withdrawals", icon: Wallet, label: "Withdrawals", badge: withdrawals.filter(w => w.status === "pending").length },
    { id: "promotions", icon: Gift, label: "Promotions" },
    { id: "reports", icon: BarChart2, label: "Reports" },
    { id: "support", icon: MessageSquare, label: "Support", badge: support.filter(s => s.status === "open").length },
    { id: "settings", icon: Settings, label: "Settings" },
  ];

  const filteredUsers = search
    ? users.filter(u => u.username?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()))
    : users;

  const tabTitles: Record<Tab, string> = {
    dashboard: "Dashboard Overview", users: "User Management", bets: "Bet History",
    transactions: "Transactions", withdrawals: "Withdrawal Requests", promotions: "Promotions & Bonuses",
    reports: "Analytics & Reports", support: "Support Tickets", settings: "Site Settings",
  };

  const maxRevenue = Math.max(...REVENUE_CHART.map(d => d.value));

  /* ─── Login screen ─── */
  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "hsl(214 44% 6%)" }}>
        <div className="w-full max-w-sm mx-auto px-4">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4"
              style={{ background: "linear-gradient(135deg, #ffba00, #ff8c00)" }}>
              <ShieldCheck size={30} className="text-[hsl(214_42%_9%)]" />
            </div>
            <h1 className="text-[24px] font-black text-white">Admin Panel</h1>
            <p className="text-[14px] text-[hsl(214_15%_45%)] mt-1">XBetZone Control Center</p>
          </div>
          <form onSubmit={handleLogin} className="rounded-2xl p-6 border space-y-4"
            style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
            <div>
              <label className="block text-[12px] font-bold text-[hsl(214_15%_55%)] uppercase tracking-wider mb-2">Admin Password</label>
              <input
                type="password" value={loginPw} onChange={e => setLoginPw(e.target.value)}
                placeholder="Enter admin password" autoFocus autoComplete="current-password"
                className="w-full px-4 py-3 rounded-lg text-[15px] text-white outline-none border focus:border-[#ffba00] transition-colors"
                style={{ background: "hsl(214 44% 7%)", borderColor: "hsl(214 28% 20%)" }}
              />
            </div>
            {loginError && (
              <p className="text-red-400 text-[13px] flex items-center gap-1.5">
                <XCircle size={14} /> {loginError}
              </p>
            )}
            <button type="submit" disabled={loginLoading}
              className="w-full py-3 rounded-lg text-[15px] font-black transition-all hover:brightness-110 disabled:opacity-60"
              style={{ background: "linear-gradient(135deg, #ffba00, #ff8c00)", color: "hsl(214 42% 9%)" }}>
              {loginLoading ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <p className="text-center text-[12px] text-[hsl(214_15%_30%)] mt-4">Hint: xbetzone-admin-2024</p>
        </div>
      </div>
    );
  }

  /* ─── Main admin layout ─── */
  return (
    <div className="min-h-screen flex" style={{ background: "hsl(214 44% 6%)", fontFamily: "Roboto, sans-serif" }}>

      {/* Sidebar */}
      <aside
        className={`w-[220px] shrink-0 flex flex-col border-r fixed lg:static h-screen lg:h-auto z-30 transition-transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: "hsl(214 44% 8%)", borderColor: "hsl(214 28% 13%)" }}
      >
        {/* Logo */}
        <div className="p-5 border-b" style={{ borderColor: "hsl(214 28% 13%)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #ffba00, #ff8c00)" }}>
              <ShieldCheck size={18} className="text-[hsl(214_42%_9%)]" />
            </div>
            <div>
              <p className="text-[15px] font-black text-white leading-tight">XBetZone</p>
              <p className="text-[11px] text-[hsl(214_15%_45%)]">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-2 overflow-y-auto">
          {NAV_TABS.map(({ id, icon: Icon, label, badge }) => (
            <button key={id} onClick={() => { setTab(id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] font-semibold transition-colors ${tab === id ? "text-[hsl(214_42%_9%)]" : "text-[hsl(214_15%_50%)] hover:text-white hover:bg-white/5"}`}
              style={tab === id ? { background: "#ffba00" } : {}}>
              <Icon size={16} />
              <span className="flex-1 text-left">{label}</span>
              {badge != null && badge > 0 && (
                <span className={`text-[11px] font-black px-1.5 py-0.5 rounded-full ${tab === id ? "bg-[hsl(214_42%_9%)/30] text-[hsl(214_42%_9%)]" : "bg-red-500 text-white"}`}>
                  {badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t space-y-1" style={{ borderColor: "hsl(214 28% 13%)" }}>
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-[13px]"
            style={{ background: "hsl(214 44% 12%)" }}>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
              style={{ background: "#ffba00", color: "hsl(214 42% 9%)" }}>A</div>
            <div>
              <p className="font-bold text-white text-[13px] leading-none">Admin</p>
              <p className="text-[11px] text-[hsl(214_15%_40%)]">Super Admin</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[13px] text-red-400 hover:bg-red-500/10 transition-colors">
            <LogOut size={14} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 flex flex-col overflow-auto">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-5 py-3 border-b shrink-0"
          style={{ background: "hsl(214 44% 8%)", borderColor: "hsl(214 28% 13%)" }}>
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded hover:bg-white/5" onClick={() => setSidebarOpen(o => !o)}>
              <LayoutDashboard size={18} className="text-white" />
            </button>
            <div>
              <h1 className="text-[16px] font-black text-white">{tabTitles[tab]}</h1>
              <p className="text-[12px] text-[hsl(214_15%_40%)]">
                {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded hover:bg-white/5 transition-colors">
              <Bell size={17} className="text-[hsl(214_15%_50%)]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
            </button>
            <button onClick={() => setRefreshKey(k => k + 1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold hover:bg-white/5 transition-colors text-[hsl(214_15%_50%)] border"
              style={{ borderColor: "hsl(214 28% 18%)" }}>
              <RefreshCw size={13} /> Refresh
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold text-[hsl(214_42%_9%)] transition-all hover:brightness-110"
              style={{ background: "#ffba00" }}>
              <Download size={13} /> Export
            </button>
          </div>
        </header>

        <div className="flex-1 p-5 space-y-5">

          {/* ═══ DASHBOARD ═══ */}
          {tab === "dashboard" && (
            <div className="space-y-5">
              {!stats ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {Array(8).fill(0).map((_, i) => (
                    <div key={i} className="rounded-xl p-5 h-28 animate-pulse border"
                      style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }} />
                  ))}
                </div>
              ) : (
                <>
                  {/* Stats grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <StatCard icon={Users} label="Total Users" value={stats.totalUsers.toLocaleString()} sub={`${stats.activeSessions} online`} trend={12} />
                    <StatCard icon={DollarSign} label="Deposits" value={fmt(stats.totalDeposits)} sub="All time" color="#22c55e" trend={8} />
                    <StatCard icon={TrendingDown} label="Withdrawals" value={fmt(stats.totalWithdrawals)} sub="All time" color="#ef4444" trend={-3} />
                    <StatCard icon={TrendingUp} label="GGR" value={fmt(stats.ggr)} sub="Gross gaming revenue" color="#a855f7" trend={15} />
                    <StatCard icon={ClipboardList} label="Total Bets" value={stats.totalBets.toLocaleString()} sub={`${stats.activeBets} active`} color="#3b82f6" trend={22} />
                    <StatCard icon={Activity} label="Active Bets" value={stats.activeBets} sub="In progress" color="#f97316" />
                    <StatCard icon={Percent} label="Conversion" value={`${stats.conversionRate}%`} sub="Reg → depositor" color="#06b6d4" trend={5} />
                    <StatCard icon={Trophy} label="Avg Bet" value={`৳${parseFloat(stats.avgBetSize).toFixed(0)}`} sub="Per bet placed" color="#ec4899" />
                  </div>

                  {/* Revenue chart + Activity */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Bar chart */}
                    <div className="lg:col-span-2 rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[15px] font-black text-white">Revenue — Last 7 Days</h3>
                        <span className="text-[12px] text-green-400 font-bold">+18.4% vs last week</span>
                      </div>
                      <div className="flex items-end gap-2 h-36">
                        {REVENUE_CHART.map(d => (
                          <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                            <span className="text-[11px] text-[#ffba00] font-bold">{fmt(d.value)}</span>
                            <div className="w-full rounded-t-sm transition-all"
                              style={{ height: `${(d.value / maxRevenue) * 100}%`, background: d.day === "Sat" ? "#ffba00" : "hsl(214 50% 30%)", minHeight: 8 }} />
                            <span className="text-[11px] text-[hsl(214_15%_45%)]">{d.day}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Activity log */}
                    <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                      <h3 className="text-[15px] font-black text-white mb-3">Recent Activity</h3>
                      <div className="space-y-3">
                        {ACTIVITY_LOG.map((a, i) => (
                          <div key={i} className="flex gap-2.5">
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${a.color.replace("text-", "bg-")}`} />
                            <div>
                              <p className={`text-[13px] font-bold ${a.color}`}>{a.action}</p>
                              <p className="text-[12px] text-[hsl(214_15%_45%)]">{a.detail}</p>
                              <p className="text-[11px] text-[hsl(214_15%_35%)]">{a.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Financial + System */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                      <h3 className="text-[15px] font-black text-white mb-4">Financial Summary</h3>
                      {[
                        { label: "Gross Revenue", value: fmt(stats.revenue), color: "#22c55e" },
                        { label: "Gross Gaming Revenue", value: fmt(stats.ggr), color: "#a855f7" },
                        { label: "Total Deposits", value: fmt(stats.totalDeposits), color: "#3b82f6" },
                        { label: "Total Withdrawals", value: fmt(stats.totalWithdrawals), color: "#ef4444" },
                        { label: "Pending Withdrawals", value: `${withdrawals.filter(w => w.status === "pending").length} requests`, color: "#f97316" },
                      ].map(({ label, value, color }) => (
                        <div key={label} className="flex items-center justify-between py-2.5 border-b last:border-0"
                          style={{ borderColor: "hsl(214 28% 16%)" }}>
                          <span className="text-[13px] text-[hsl(214_15%_55%)]">{label}</span>
                          <span className="text-[14px] font-black" style={{ color }}>{value}</span>
                        </div>
                      ))}
                    </div>

                    <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                      <h3 className="text-[15px] font-black text-white mb-4">System Status</h3>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "API Server", status: "Operational", latency: "12ms" },
                          { label: "Database", status: "Operational", latency: "4ms" },
                          { label: "Payment Gateway", status: "Operational", latency: "88ms" },
                          { label: "Live Odds Feed", status: "Degraded", latency: "—" },
                          { label: "Casino Games", status: "Operational", latency: "22ms" },
                          { label: "Email Service", status: "Operational", latency: "—" },
                        ].map(({ label, status, latency }) => (
                          <div key={label} className="flex items-center gap-2 p-3 rounded-lg"
                            style={{ background: "hsl(214 44% 7%)" }}>
                            <span className={`w-2 h-2 rounded-full shrink-0 animate-pulse ${status === "Operational" ? "bg-green-500" : "bg-yellow-500"}`} />
                            <div className="min-w-0">
                              <p className="text-[12px] font-semibold text-white truncate">{label}</p>
                              <p className={`text-[11px] ${status === "Operational" ? "text-green-400" : "text-yellow-400"}`}>
                                {status}{latency !== "—" ? ` · ${latency}` : ""}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ═══ USERS ═══ */}
          {tab === "users" && (
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(214_15%_40%)]" />
                  <input value={search} onChange={e => setSearch(e.target.value)}
                    placeholder="Search by username or email…"
                    className="w-full pl-9 pr-4 py-2 rounded-lg text-[14px] text-white outline-none border focus:border-[#ffba00] transition-colors"
                    style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }} />
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-semibold border hover:bg-white/5 transition-colors text-[hsl(214_15%_50%)]"
                    style={{ borderColor: "hsl(214 28% 18%)" }}>
                    <Filter size={13} /> Filter
                  </button>
                  <div className="text-[13px] text-[hsl(214_15%_45%)] whitespace-nowrap">{usersTotal} users</div>
                </div>
              </div>

              <TableWrap>
                <TH cols={["ID", "Username", "Email", "Country", "Balance", "Status", "Registered", "Actions"]} />
                <tbody>
                  {loading ? <SkeletonRows rows={10} cols={8} /> :
                    filteredUsers.length === 0 ? (
                      <tr><td colSpan={8} className="px-4 py-10 text-center text-[hsl(214_15%_40%)]">No users found</td></tr>
                    ) : filteredUsers.map((u, i) => (
                      <TR key={u.id} i={i}>
                        <td className="px-4 py-3 text-[hsl(214_15%_40%)] font-mono text-[12px]">#{u.id}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0"
                              style={{ background: "#ffba00", color: "hsl(214 42% 9%)" }}>
                              {u.username?.[0]?.toUpperCase()}
                            </div>
                            <span className="font-semibold text-white">{u.username}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-[hsl(214_15%_55%)]">{u.email}</td>
                        <td className="px-4 py-3 text-[hsl(214_15%_55%)]">{u.country || "—"}</td>
                        <td className="px-4 py-3 font-black text-[#ffba00]">৳{parseFloat(u.balance || 0).toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-500/15 text-green-400 border border-green-500/30">Active</span>
                        </td>
                        <td className="px-4 py-3 text-[hsl(214_15%_40%)] whitespace-nowrap text-[12px]">{fmtDate(u.createdAt)}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <button className="p-1.5 rounded hover:bg-blue-500/15 text-blue-400 transition-colors" title="View Profile"><Eye size={13} /></button>
                            <button className="p-1.5 rounded hover:bg-green-500/15 text-green-400 transition-colors" title="Add Balance"><Wallet size={13} /></button>
                            <button className="p-1.5 rounded hover:bg-yellow-500/15 text-yellow-400 transition-colors" title="Send Message"><MessageSquare size={13} /></button>
                            <button className="p-1.5 rounded hover:bg-red-500/15 text-red-400 transition-colors" title="Suspend"><Ban size={13} /></button>
                          </div>
                        </td>
                      </TR>
                    ))}
                </tbody>
              </TableWrap>
              <Pagination page={usersPage} total={usersTotal} limit={15} onChange={setUsersPage} />
            </div>
          )}

          {/* ═══ BETS ═══ */}
          {tab === "bets" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-[hsl(214_15%_45%)]">{betsTotal} total bets</p>
                <div className="flex gap-2">
                  {["All", "Won", "Lost", "Pending"].map(f => (
                    <button key={f} className="px-3 py-1 rounded text-[12px] font-semibold transition-colors hover:bg-white/5 text-[hsl(214_15%_50%)] border"
                      style={{ borderColor: "hsl(214 28% 18%)" }}>{f}</button>
                  ))}
                </div>
              </div>
              <TableWrap>
                <TH cols={["Bet ID", "User", "Event", "Market", "Odds", "Stake", "Payout", "Status", "Date"]} />
                <tbody>
                  {loading ? <SkeletonRows rows={10} cols={9} /> :
                    bets.map((b, i) => (
                      <TR key={b.id} i={i}>
                        <td className="px-4 py-3 font-mono text-[hsl(214_15%_40%)] text-[12px]">#{b.id}</td>
                        <td className="px-4 py-3 font-semibold text-[hsl(210_100%_65%)]">{b.username}</td>
                        <td className="px-4 py-3 text-white whitespace-nowrap">{b.event}</td>
                        <td className="px-4 py-3 text-[hsl(214_15%_50%)]">{b.market}</td>
                        <td className="px-4 py-3 font-black text-[#ffba00]">{b.odds}</td>
                        <td className="px-4 py-3 text-white font-semibold">৳{b.stake?.toLocaleString()}</td>
                        <td className="px-4 py-3 font-black text-green-400">{b.payout > 0 ? `৳${b.payout?.toLocaleString()}` : "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-black capitalize ${STATUS_STYLES[b.status] ?? ""}`}>{b.status}</span>
                        </td>
                        <td className="px-4 py-3 text-[hsl(214_15%_40%)] whitespace-nowrap text-[12px]">{fmtDate(b.placedAt)}</td>
                      </TR>
                    ))}
                </tbody>
              </TableWrap>
              <Pagination page={betsPage} total={betsTotal} limit={15} onChange={setBetsPage} />
            </div>
          )}

          {/* ═══ TRANSACTIONS ═══ */}
          {tab === "transactions" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-[hsl(214_15%_45%)]">{txsTotal} total transactions</p>
                <div className="flex gap-2 flex-wrap">
                  {["All", "Deposit", "Withdrawal", "Bet Win", "Bet Loss", "Bonus"].map(f => (
                    <button key={f} className="px-3 py-1 rounded text-[12px] font-semibold transition-colors hover:bg-white/5 text-[hsl(214_15%_50%)] border"
                      style={{ borderColor: "hsl(214 28% 18%)" }}>{f}</button>
                  ))}
                </div>
              </div>
              <TableWrap>
                <TH cols={["TX ID", "User", "Type", "Method", "Amount", "Status", "Date"]} />
                <tbody>
                  {loading ? <SkeletonRows rows={10} cols={7} /> :
                    txs.map((tx, i) => (
                      <TR key={tx.id} i={i}>
                        <td className="px-4 py-3 font-mono text-[hsl(214_15%_40%)] text-[12px]">#{tx.id}</td>
                        <td className="px-4 py-3 font-semibold text-[hsl(210_100%_65%)]">{tx.username}</td>
                        <td className="px-4 py-3">
                          <span className={`font-bold capitalize ${TX_TYPE_STYLES[tx.type] ?? "text-white"}`}>
                            {tx.type === "bet_win" ? "Bet Win" : tx.type === "bet_loss" ? "Bet Loss" : tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[hsl(214_15%_55%)]">{tx.method}</td>
                        <td className="px-4 py-3 font-black">
                          <span className={tx.type === "deposit" || tx.type === "bet_win" || tx.type === "bonus" ? "text-green-400" : "text-red-400"}>
                            {tx.type === "deposit" || tx.type === "bet_win" || tx.type === "bonus" ? "+" : "-"}৳{tx.amount?.toLocaleString()}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-[11px] font-black capitalize ${STATUS_STYLES[tx.status] ?? ""}`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[hsl(214_15%_40%)] whitespace-nowrap text-[12px]">{fmtDate(tx.createdAt)}</td>
                      </TR>
                    ))}
                </tbody>
              </TableWrap>
              <Pagination page={txsPage} total={txsTotal} limit={15} onChange={setTxsPage} />
            </div>
          )}

          {/* ═══ WITHDRAWALS ═══ */}
          {tab === "withdrawals" && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Pending", value: withdrawals.filter(w => w.status === "pending").length, color: "#f59e0b" },
                  { label: "Approved Today", value: 14, color: "#22c55e" },
                  { label: "Rejected Today", value: 2, color: "#ef4444" },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-4 border text-center" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                    <p className="text-[28px] font-black" style={{ color: s.color }}>{s.value}</p>
                    <p className="text-[13px] text-[hsl(214_15%_45%)]">{s.label}</p>
                  </div>
                ))}
              </div>

              <TableWrap>
                <TH cols={["ID", "User", "Amount", "Method", "Account", "Requested", "Status", "Actions"]} />
                <tbody>
                  {withdrawals.map((w, i) => (
                    <TR key={w.id} i={i}>
                      <td className="px-4 py-3 font-mono text-[hsl(214_15%_40%)] text-[12px]">#{w.id}</td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-semibold text-white">{w.user}</p>
                          <p className="text-[11px] text-[hsl(214_15%_45%)]">{w.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-black text-[#ffba00] text-[15px]">৳{w.amount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-white">{w.method}</td>
                      <td className="px-4 py-3 text-[hsl(214_15%_55%)] font-mono text-[12px]">{w.account}</td>
                      <td className="px-4 py-3 text-[hsl(214_15%_40%)] text-[12px] whitespace-nowrap">{fmtDate(w.requested)}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-black capitalize ${
                          w.status === "pending" ? "bg-yellow-500/15 text-yellow-400 border border-yellow-500/30" :
                          w.status === "approved" ? "bg-green-500/15 text-green-400 border border-green-500/30" :
                          "bg-red-500/15 text-red-400 border border-red-500/30"}`}>
                          {w.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {w.status === "pending" ? (
                          <div className="flex gap-1.5">
                            <button onClick={() => approveWithdrawal(w.id)}
                              className="px-2.5 py-1 rounded text-[12px] font-bold bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors flex items-center gap-1">
                              <CheckCircle size={12} /> Approve
                            </button>
                            <button onClick={() => rejectWithdrawal(w.id)}
                              className="px-2.5 py-1 rounded text-[12px] font-bold bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors flex items-center gap-1">
                              <XCircle size={12} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-[12px] text-[hsl(214_15%_35%)] capitalize">{w.status}</span>
                        )}
                      </td>
                    </TR>
                  ))}
                </tbody>
              </TableWrap>
            </div>
          )}

          {/* ═══ PROMOTIONS ═══ */}
          {tab === "promotions" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-[hsl(214_15%_45%)]">{promotions.length} promotions</p>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-[13px] font-black text-[hsl(214_42%_9%)] hover:brightness-110 transition-all"
                  style={{ background: "#ffba00" }}>
                  <Star size={14} /> New Promotion
                </button>
              </div>

              <div className="space-y-3">
                {promotions.map((p) => (
                  <div key={p.id} className="rounded-xl p-4 border flex items-center gap-4"
                    style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: p.active ? "#ffba0020" : "hsl(214 44% 14%)" }}>
                      <Gift size={20} style={{ color: p.active ? "#ffba00" : "hsl(214 15% 40%)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-bold text-white text-[14px]">{p.name}</p>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${p.active ? "bg-green-500/20 text-green-400" : "bg-[hsl(214_44%_15%)] text-[hsl(214_15%_40%)]"}`}>
                          {p.active ? "Active" : "Paused"}
                        </span>
                      </div>
                      <div className="flex gap-4 text-[12px] text-[hsl(214_15%_45%)]">
                        <span>Value: <strong className="text-[#ffba00]">{p.value}</strong></span>
                        <span>Max: <strong className="text-white">{p.maxBonus}</strong></span>
                        <span>Wagering: <strong className="text-white">{p.wagering}</strong></span>
                        <span>Claimed: <strong className="text-white">{p.claimed}</strong></span>
                        <span>Expires: <strong className="text-white">{p.expires}</strong></span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => togglePromo(p.id)} className="transition-colors hover:opacity-80">
                        {p.active
                          ? <ToggleRight size={28} style={{ color: "#22c55e" }} />
                          : <ToggleLeft size={28} style={{ color: "hsl(214 15% 38%)" }} />}
                      </button>
                      <button className="p-2 rounded hover:bg-white/5 text-[hsl(214_15%_45%)] hover:text-white transition-colors">
                        <Eye size={15} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ═══ REPORTS ═══ */}
          {tab === "reports" && (
            <div className="space-y-5">
              {/* KPI summary */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Total Revenue (30d)", value: "৳18.4L", trend: "+22%", color: "#22c55e" },
                  { label: "New Users (30d)", value: "2,841", trend: "+15%", color: "#3b82f6" },
                  { label: "Bets Placed (30d)", value: "48,203", trend: "+31%", color: "#f97316" },
                  { label: "Avg Daily Deposit", value: "৳61K", trend: "+8%", color: "#a855f7" },
                ].map(k => (
                  <div key={k.label} className="rounded-xl p-4 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                    <p className="text-[12px] text-[hsl(214_15%_45%)] mb-1">{k.label}</p>
                    <p className="text-[22px] font-black text-white">{k.value}</p>
                    <p className="text-[12px] font-bold text-green-400 mt-1">{k.trend} vs last month</p>
                  </div>
                ))}
              </div>

              {/* Sport breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                  <h3 className="text-[15px] font-black text-white mb-4">Revenue by Sport</h3>
                  <div className="space-y-3">
                    {SPORT_BREAKDOWN.map(s => (
                      <div key={s.sport}>
                        <div className="flex justify-between text-[13px] mb-1">
                          <span className="text-[hsl(214_15%_60%)]">{s.sport}</span>
                          <div className="flex gap-4">
                            <span className="text-[hsl(214_15%_45%)]">{s.bets.toLocaleString()} bets</span>
                            <span className="font-bold text-[#ffba00]">{s.revenue}</span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full" style={{ background: "hsl(214 28% 18%)" }}>
                          <div className="h-2 rounded-full" style={{ width: `${s.share}%`, background: "#ffba00" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment methods breakdown */}
                <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                  <h3 className="text-[15px] font-black text-white mb-4">Deposits by Method</h3>
                  <div className="space-y-3">
                    {[
                      { method: "bKash", share: 54, amount: "৳9.8L", color: "#e91e8c" },
                      { method: "Nagad", share: 22, amount: "৳4.0L", color: "#ff6f00" },
                      { method: "Rocket", share: 14, amount: "৳2.5L", color: "#6200ea" },
                      { method: "Bank Transfer", share: 7, amount: "৳1.3L", color: "#00acc1" },
                      { method: "Crypto", share: 3, amount: "৳54K", color: "#f59e0b" },
                    ].map(m => (
                      <div key={m.method}>
                        <div className="flex justify-between text-[13px] mb-1">
                          <span className="text-[hsl(214_15%_60%)]">{m.method}</span>
                          <div className="flex gap-4">
                            <span className="text-[hsl(214_15%_45%)]">{m.share}%</span>
                            <span className="font-bold" style={{ color: m.color }}>{m.amount}</span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full" style={{ background: "hsl(214 28% 18%)" }}>
                          <div className="h-2 rounded-full" style={{ width: `${m.share}%`, background: m.color }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Games performance */}
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: "hsl(214 28% 18%)" }}>
                <div className="px-5 py-3 border-b" style={{ background: "hsl(214 44% 9%)", borderColor: "hsl(214 28% 18%)" }}>
                  <h3 className="text-[14px] font-black text-white">Top Performing Games</h3>
                </div>
                <TableWrap>
                  <TH cols={["Game", "Provider", "Type", "Bets", "Revenue", "RTP", "Status"]} />
                  <tbody>
                    {MOCK_GAMES.slice(0, 5).map((g, i) => (
                      <TR key={g.name} i={i}>
                        <td className="px-4 py-3 font-bold text-white">{g.name}</td>
                        <td className="px-4 py-3 text-[hsl(214_15%_50%)]">{g.provider}</td>
                        <td className="px-4 py-3 text-[hsl(214_15%_50%)]">{g.type}</td>
                        <td className="px-4 py-3 text-white">{g.bets.toLocaleString()}</td>
                        <td className="px-4 py-3 font-bold text-[#ffba00]">{g.revenue}</td>
                        <td className="px-4 py-3 text-[hsl(214_15%_50%)]">{g.rtp}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-green-500/15 text-green-400">Active</span>
                        </td>
                      </TR>
                    ))}
                  </tbody>
                </TableWrap>
              </div>
            </div>
          )}

          {/* ═══ SUPPORT ═══ */}
          {tab === "support" && (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4">
              {/* Ticket list */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-2">
                    {["All", "Open", "Replied", "Resolved"].map(f => (
                      <button key={f} className="px-3 py-1.5 rounded text-[12px] font-semibold border hover:bg-white/5 transition-colors text-[hsl(214_15%_50%)]"
                        style={{ borderColor: "hsl(214 28% 18%)" }}>{f}</button>
                    ))}
                  </div>
                  <span className="text-[13px] text-[hsl(214_15%_45%)]">{support.filter(s => s.status === "open").length} open</span>
                </div>

                {support.map(ticket => (
                  <div key={ticket.id}
                    onClick={() => setSelectedTicket(selectedTicket === ticket.id ? null : ticket.id)}
                    className="rounded-xl p-4 border cursor-pointer transition-all hover:border-[#ffba00]"
                    style={{
                      background: "hsl(214 44% 10%)",
                      borderColor: selectedTicket === ticket.id ? "#ffba00" : "hsl(214 28% 18%)"
                    }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-black uppercase ${
                            ticket.status === "open" ? "bg-red-500/20 text-red-400" :
                            ticket.status === "replied" ? "bg-blue-500/20 text-blue-400" :
                            "bg-green-500/20 text-green-400"}`}>
                            {ticket.status}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                            ticket.priority === "high" ? "bg-red-500/10 text-red-400" :
                            ticket.priority === "medium" ? "bg-yellow-500/10 text-yellow-400" :
                            "bg-blue-500/10 text-blue-400"}`}>
                            {ticket.priority}
                          </span>
                          <span className="text-[11px] text-[hsl(214_15%_40%)]">#{ticket.id}</span>
                        </div>
                        <p className="font-bold text-white text-[14px]">{ticket.subject}</p>
                        <p className="text-[12px] text-[hsl(214_15%_45%)] mt-0.5 line-clamp-2">{ticket.message}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[12px] font-semibold text-[hsl(210_100%_65%)]">{ticket.user}</p>
                        <p className="text-[11px] text-[hsl(214_15%_40%)]">{fmtDate(ticket.time)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply panel */}
              <div className="rounded-xl border overflow-hidden sticky top-20 self-start"
                style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                {selectedTicket ? (() => {
                  const t = support.find(s => s.id === selectedTicket)!;
                  return (
                    <>
                      <div className="px-4 py-3 border-b" style={{ background: "hsl(214 42% 9%)", borderColor: "hsl(214 28% 16%)" }}>
                        <p className="font-bold text-white">Ticket #{t.id} — {t.user}</p>
                        <p className="text-[13px] text-[#ffba00] font-semibold">{t.subject}</p>
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="rounded-lg p-3" style={{ background: "hsl(214 44% 8%)" }}>
                          <p className="text-[12px] text-[hsl(214_15%_50%)] mb-1">User message:</p>
                          <p className="text-[13px] text-white leading-relaxed">{t.message}</p>
                        </div>
                        <textarea
                          rows={5} value={replyText} onChange={e => setReplyText(e.target.value)}
                          placeholder="Type your reply to the user…"
                          className="w-full px-3 py-2.5 rounded-lg text-[13px] text-white outline-none border focus:border-[#ffba00] transition-colors resize-none"
                          style={{ background: "hsl(214 44% 8%)", borderColor: "hsl(214 28% 22%)" }}
                        />
                        <div className="flex gap-2">
                          <button onClick={() => sendReply(t.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[13px] font-black transition-all hover:brightness-110"
                            style={{ background: "#ffba00", color: "hsl(214 42% 9%)" }}>
                            <Send size={13} /> Send Reply
                          </button>
                          <button
                            onClick={() => setSupport(ss => ss.map(s => s.id === t.id ? { ...s, status: "resolved" } : s))}
                            className="px-3 py-2 rounded-lg text-[13px] font-bold bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">
                            Resolve
                          </button>
                        </div>
                        <div className="pt-2 border-t" style={{ borderColor: "hsl(214 28% 16%)" }}>
                          <p className="text-[12px] font-bold text-[hsl(214_15%_40%)] mb-2">Quick Replies:</p>
                          <div className="flex flex-col gap-1.5">
                            {[
                              "Your withdrawal is being processed and will arrive within 24 hours.",
                              "Your bonus has been credited. Please check your account.",
                              "We've verified your documents. Your account is fully verified.",
                            ].map(q => (
                              <button key={q} onClick={() => setReplyText(q)}
                                className="text-left text-[12px] text-[hsl(214_15%_50%)] hover:text-white px-2 py-1.5 rounded hover:bg-white/5 transition-colors border"
                                style={{ borderColor: "hsl(214 28% 18%)" }}>
                                {q}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })() : (
                  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                    <MessageSquare size={36} className="text-[hsl(214_15%_30%)] mb-3" />
                    <p className="text-[14px] font-semibold text-[hsl(214_15%_40%)]">Select a ticket to reply</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ═══ SETTINGS ═══ */}
          {tab === "settings" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-4xl">
              {[
                {
                  title: "Site Configuration", icon: Settings, fields: [
                    { label: "Site Name", value: "XBetZone", type: "text" },
                    { label: "Default Currency", value: "BDT", type: "text" },
                    { label: "Min Deposit (৳)", value: "1000", type: "number" },
                    { label: "Min Withdrawal (৳)", value: "500", type: "number" },
                    { label: "Max Withdrawal / Day (৳)", value: "500000", type: "number" },
                    { label: "KYC Required Above (৳)", value: "50000", type: "number" },
                  ]
                },
                {
                  title: "Betting Limits", icon: ClipboardList, fields: [
                    { label: "Min Bet (৳)", value: "100", type: "number" },
                    { label: "Max Bet (৳)", value: "100000", type: "number" },
                    { label: "Max Payout (৳)", value: "5000000", type: "number" },
                    { label: "Max Combo Legs", value: "15", type: "number" },
                    { label: "Odds Margin (%)", value: "5.5", type: "number" },
                    { label: "Live Bet Delay (sec)", value: "3", type: "number" },
                  ]
                },
                {
                  title: "Welcome Bonus", icon: Gift, fields: [
                    { label: "Bonus % (1st deposit)", value: "125", type: "number" },
                    { label: "Max Bonus (৳)", value: "30000", type: "number" },
                    { label: "Min Deposit for Bonus (৳)", value: "1000", type: "number" },
                    { label: "Wagering Requirement (x)", value: "20", type: "number" },
                    { label: "Validity (days)", value: "30", type: "number" },
                    { label: "Max Bet While Active (৳)", value: "1000", type: "number" },
                  ]
                },
                {
                  title: "Notifications & Security", icon: Bell, fields: [
                    { label: "SMTP Host", value: "smtp.gmail.com", type: "text" },
                    { label: "SMTP Port", value: "587", type: "number" },
                    { label: "From Email", value: "noreply@xbetzone.com", type: "text" },
                    { label: "Session Timeout (min)", value: "60", type: "number" },
                    { label: "Max Login Attempts", value: "5", type: "number" },
                    { label: "2FA Required for Withdrawal", value: "1", type: "number" },
                  ]
                },
              ].map(({ title, icon: Icon, fields }) => (
                <div key={title} className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                  <div className="flex items-center gap-2 mb-4">
                    <Icon size={16} style={{ color: "#ffba00" }} />
                    <h3 className="text-[15px] font-black text-white">{title}</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {fields.map(({ label, value, type }) => (
                      <div key={label}>
                        <label className="block text-[11px] font-bold text-[hsl(214_15%_45%)] uppercase tracking-wider mb-1">{label}</label>
                        <input defaultValue={value} type={type}
                          className="w-full px-3 py-2 rounded-lg text-[13px] text-white outline-none border focus:border-[#ffba00] transition-colors"
                          style={{ background: "hsl(214 44% 7%)", borderColor: "hsl(214 28% 20%)" }} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Games management inline */}
              <div className="rounded-xl p-5 border lg:col-span-2" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                <div className="flex items-center gap-2 mb-4">
                  <GamepadIcon size={16} style={{ color: "#ffba00" }} />
                  <h3 className="text-[15px] font-black text-white">Games On/Off</h3>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {games.map(g => (
                    <div key={g.name} className="flex items-center justify-between p-3 rounded-lg border"
                      style={{ background: "hsl(214 44% 8%)", borderColor: "hsl(214 28% 16%)" }}>
                      <div className="min-w-0">
                        <p className="text-[13px] font-bold text-white truncate">{g.name}</p>
                        <p className="text-[11px] text-[hsl(214_15%_45%)]">{g.type}</p>
                      </div>
                      <button onClick={() => toggleGame(g.name)} className="shrink-0 ml-2">
                        {g.active
                          ? <ToggleRight size={24} style={{ color: "#22c55e" }} />
                          : <ToggleLeft size={24} style={{ color: "hsl(214 15% 35%)" }} />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Save button */}
              <div className="lg:col-span-2 flex items-center gap-4">
                <button onClick={saveSettings}
                  className="px-8 py-3 rounded-xl text-[14px] font-black transition-all hover:brightness-110"
                  style={{ background: "linear-gradient(135deg, #ffba00, #ff8c00)", color: "hsl(214 42% 9%)" }}>
                  Save All Settings
                </button>
                {settingsSaved && (
                  <div className="flex items-center gap-2 text-green-400 font-semibold text-[14px] animate-pulse">
                    <CheckCircle size={16} /> Settings saved successfully!
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
