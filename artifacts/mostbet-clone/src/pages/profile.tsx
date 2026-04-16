import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  User, Mail, Phone, MapPin, Calendar, Shield, Edit3,
  Camera, ChevronRight, CheckCircle, Clock, TrendingUp,
  Trophy, Wallet, Star, Lock, Bell, Globe, LogOut,
} from "lucide-react";

function AccountLayout({ children, active }: { children: React.ReactNode; active: string }) {
  const { user, logout } = useAuth();
  const MENU = [
    { href: "/profile",      icon: User,       label: "My Profile" },
    { href: "/deposit",      icon: Wallet,      label: "Deposit" },
    { href: "/withdraw",     icon: TrendingUp,  label: "Withdraw" },
    { href: "/my-bets",      icon: Trophy,      label: "My Bets" },
    { href: "/transactions", icon: Clock,       label: "Transactions" },
    { href: "/bonuses",      icon: Star,        label: "Bonuses" },
    { href: "/notifications",icon: Bell,        label: "Notifications" },
    { href: "/security",     icon: Lock,        label: "Security" },
  ];
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(214 44% 7%)" }}>
      <Header />
      <div className="flex-1">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex gap-5">
          {/* Sidebar */}
          <aside className="w-56 shrink-0 hidden md:block">
            {user && (
              <div className="rounded-xl p-4 mb-3 border text-center" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                <div className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center text-[22px] font-black text-[hsl(214_42%_9%)]" style={{ background: "#ffba00" }}>
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <p className="text-[14px] font-bold text-white">{user.username}</p>
                <p className="text-[12px] text-[hsl(214_15%_45%)]">{user.email}</p>
                <div className="mt-2 px-3 py-1.5 rounded-lg text-center" style={{ background: "hsl(214 44% 7%)" }}>
                  <p className="text-[12px] text-[hsl(214_15%_45%)]">Balance</p>
                  <p className="text-[16px] font-black text-[#ffba00]">৳{parseFloat(user.balance).toFixed(2)}</p>
                </div>
              </div>
            )}
            <nav className="rounded-xl overflow-hidden border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
              {MENU.map(({ href, icon: Icon, label }) => (
                <Link key={href} href={href}>
                  <span className={`flex items-center justify-between px-4 py-2.5 text-[14px] font-semibold border-b transition-colors last:border-0 cursor-pointer ${active === href ? "text-[hsl(214_42%_9%)]" : "text-[hsl(214_15%_55%)] hover:text-white hover:bg-white/5"}`}
                    style={{ borderColor: "hsl(214 28% 14%)", ...(active === href ? { background: "#ffba00" } : {}) }}>
                    <span className="flex items-center gap-2.5"><Icon size={15} />{label}</span>
                    <ChevronRight size={13} className="opacity-50" />
                  </span>
                </Link>
              ))}
              <button onClick={logout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-red-400 hover:bg-red-500/10 transition-colors border-t" style={{ borderColor: "hsl(214 28% 14%)" }}>
                <LogOut size={15} /> Log Out
              </button>
            </nav>
          </aside>
          {/* Content */}
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}

export { AccountLayout };

export default function ProfilePage() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ username: user?.username || "", email: user?.email || "", phone: "", country: user?.country || "Bangladesh" });
  const [saved, setSaved] = useState(false);

  if (!user) return (
    <AccountLayout active="/profile">
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-white text-[17px] font-bold mb-4">Please log in to view your profile</p>
        <Link href="/login"><span className="px-5 py-2.5 rounded-lg font-black text-[hsl(214_42%_9%)] text-[15px] cursor-pointer" style={{ background: "#ffba00" }}>Log In</span></Link>
      </div>
    </AccountLayout>
  );

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  const STATS = [
    { label: "Total Bets", value: "24", icon: Trophy, color: "#3b82f6" },
    { label: "Won", value: "11", icon: CheckCircle, color: "#22c55e" },
    { label: "Active Bets", value: "3", icon: Clock, color: "#f97316" },
    { label: "Win Rate", value: "46%", icon: TrendingUp, color: "#a855f7" },
  ];

  return (
    <AccountLayout active="/profile">
      <div className="space-y-4">
        {/* Header Card */}
        <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
          <div className="flex items-start gap-4">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-[26px] font-black text-[hsl(214_42%_9%)]" style={{ background: "#ffba00" }}>
                {user.username.charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white" style={{ background: "hsl(214 44% 18%)", border: "2px solid hsl(214 44% 10%)" }}>
                <Camera size={11} />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[19px] font-black text-white">{user.username}</h1>
                <span className="px-2 py-0.5 rounded text-[11px] font-black text-white" style={{ background: "#22c55e" }}>Verified</span>
              </div>
              <p className="text-[13px] text-[hsl(214_15%_45%)]">{user.email}</p>
              <p className="text-[12px] text-[hsl(214_15%_40%)] mt-0.5 flex items-center gap-1">
                <Calendar size={11} /> Member since {new Date(user.createdAt).toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
              </p>
            </div>
            <button onClick={() => setEditing(!editing)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[13px] font-semibold border hover:bg-white/5 transition-colors text-[hsl(214_15%_55%)]" style={{ borderColor: "hsl(214 28% 22%)" }}>
              <Edit3 size={13} /> Edit
            </button>
          </div>
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-green-400 text-[14px] font-semibold" style={{ background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.25)" }}>
            <CheckCircle size={15} /> Profile updated successfully
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {STATS.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="rounded-xl p-4 border text-center" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
              <div className="w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center" style={{ background: `${color}20` }}>
                <Icon size={16} style={{ color }} />
              </div>
              <p className="text-[19px] font-black text-white">{value}</p>
              <p className="text-[12px] text-[hsl(214_15%_45%)]">{label}</p>
            </div>
          ))}
        </div>

        {/* Profile Form */}
        <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
          <h2 className="text-[15px] font-black text-white mb-4 flex items-center gap-2"><User size={16} className="text-[#ffba00]" /> Account Information</h2>
          <form onSubmit={handleSave}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: "Username", key: "username", icon: User, type: "text" },
                { label: "Email Address", key: "email", icon: Mail, type: "email" },
                { label: "Phone Number", key: "phone", icon: Phone, type: "tel" },
                { label: "Country", key: "country", icon: MapPin, type: "text" },
              ].map(({ label, key, icon: Icon, type }) => (
                <div key={key}>
                  <label className="block text-[12px] font-bold text-[hsl(214_15%_45%)] uppercase tracking-wider mb-1.5">{label}</label>
                  <div className="relative">
                    <Icon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(214_15%_40%)]" />
                    <input type={type} value={(form as any)[key]} disabled={!editing}
                      onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                      className="w-full pl-9 pr-3 py-2.5 rounded-lg text-[14px] text-white outline-none border transition-colors disabled:opacity-60"
                      style={{ background: "hsl(214 44% 7%)", borderColor: editing ? "#ffba00" : "hsl(214 28% 20%)" }}
                    />
                  </div>
                </div>
              ))}
            </div>
            {editing && (
              <div className="flex gap-2 mt-4">
                <button type="submit" className="px-5 py-2 rounded-lg text-[14px] font-black text-[hsl(214_42%_9%)] hover:brightness-110 transition-all" style={{ background: "#ffba00" }}>Save Changes</button>
                <button type="button" onClick={() => setEditing(false)} className="px-5 py-2 rounded-lg text-[14px] font-semibold text-white border hover:bg-white/5 transition-colors" style={{ borderColor: "hsl(214 28% 22%)" }}>Cancel</button>
              </div>
            )}
          </form>
        </div>

        {/* Account Details */}
        <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
          <h2 className="text-[15px] font-black text-white mb-4 flex items-center gap-2"><Shield size={16} className="text-[#ffba00]" /> Account Details</h2>
          <div className="space-y-3">
            {[
              { label: "Account ID", value: `#${user.id}` },
              { label: "Currency", value: user.currency || "BDT" },
              { label: "Account Status", value: "Active", green: true },
              { label: "KYC Status", value: "Verified", green: true },
              { label: "2FA Status", value: "Disabled", red: true },
            ].map(({ label, value, green, red }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "hsl(214 28% 16%)" }}>
                <span className="text-[14px] text-[hsl(214_15%_50%)]">{label}</span>
                <span className={`text-[14px] font-bold ${green ? "text-green-400" : red ? "text-red-400" : "text-white"}`}>{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { label: "Deposit Funds", href: "/deposit", color: "#22c55e", icon: Wallet },
            { label: "Withdraw", href: "/withdraw", color: "#3b82f6", icon: TrendingUp },
            { label: "My Bets", href: "/my-bets", color: "#f97316", icon: Trophy },
            { label: "Bonuses", href: "/bonuses", color: "#a855f7", icon: Star },
            { label: "Transactions", href: "/transactions", color: "#06b6d4", icon: Clock },
            { label: "Security", href: "/security", color: "#ec4899", icon: Lock },
          ].map(({ label, href, color, icon: Icon }) => (
            <Link key={href} href={href}>
              <span className="flex items-center gap-2.5 p-3.5 rounded-xl border font-semibold text-[14px] text-white hover:bg-white/5 transition-colors cursor-pointer" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}20` }}>
                  <Icon size={16} style={{ color }} />
                </span>
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </AccountLayout>
  );
}
