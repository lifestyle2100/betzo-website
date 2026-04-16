import { useAuth } from "@/context/AuthContext";
import { AccountLayout } from "./profile";
import { Link } from "wouter";
import { Star, Gift, Zap, Trophy, Clock, CheckCircle, ChevronRight } from "lucide-react";

const ACTIVE_BONUSES = [
  {
    id: 1, title: "Welcome Bonus", type: "Sports",
    amount: 25000, wagerRequired: 500000, wagered: 187500,
    validUntil: "2024-05-10", color: "#ffba00", icon: Gift,
    desc: "125% on first deposit · 20x wagering",
  },
  {
    id: 2, title: "Free Bet",  type: "Sports",
    amount: 500, wagerRequired: 10000, wagered: 2500,
    validUntil: "2024-04-20", color: "#3b82f6", icon: Zap,
    desc: "Free bet credited — min odds 1.5",
  },
];

const ALL_PROMOS = [
  { id: 1, title: "Welcome Bonus",     desc: "125% up to ৳30,000 on first deposit", tag: "NEW",     color: "#ffba00", icon: Gift,   href: "/register" },
  { id: 2, title: "Casino Welcome",    desc: "100% + 250 Free Spins on first casino deposit", tag: "CASINO",  color: "#a855f7", icon: Star,   href: "/casino" },
  { id: 3, title: "Weekly Cashback",   desc: "15% cashback on sports losses every Monday", tag: "WEEKLY",  color: "#22c55e", icon: Clock,  href: "/sportsbook" },
  { id: 4, title: "eSports Boost",     desc: "200% bonus on your first eSports bet", tag: "ESPORTS", color: "#06b6d4", icon: Trophy, href: "/esports" },
  { id: 5, title: "VIP Reload",        desc: "50% reload bonus every Friday — VIP members", tag: "VIP",     color: "#ec4899", icon: Star,   href: "/promotions" },
  { id: 6, title: "Refer a Friend",    desc: "Earn ৳500 for every friend who deposits", tag: "REFER",   color: "#f97316", icon: Gift,   href: "/promotions" },
];

export default function BonusesPage() {
  const { user } = useAuth();

  if (!user) return (
    <AccountLayout active="/bonuses">
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-white text-[17px] font-bold mb-4">Please log in to view bonuses</p>
        <Link href="/login"><span className="px-5 py-2.5 rounded-lg font-black text-[hsl(214_42%_9%)] text-[15px] cursor-pointer" style={{ background: "#ffba00" }}>Log In</span></Link>
      </div>
    </AccountLayout>
  );

  return (
    <AccountLayout active="/bonuses">
      <div className="space-y-5">
        <h1 className="text-[19px] font-black text-white">Bonuses & Rewards</h1>

        {/* Active bonuses */}
        <section>
          <h2 className="text-[15px] font-black text-white mb-3 flex items-center gap-2"><Star size={15} className="text-[#ffba00]" /> Active Bonuses</h2>
          {ACTIVE_BONUSES.length === 0 ? (
            <div className="rounded-xl p-6 border text-center" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
              <p className="text-[hsl(214_15%_45%)] text-[14px]">No active bonuses. Claim one below!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ACTIVE_BONUSES.map(b => {
                const Icon = b.icon;
                const pct = Math.min(100, (b.wagered / b.wagerRequired) * 100);
                const remaining = b.wagerRequired - b.wagered;
                return (
                  <div key={b.id} className="rounded-xl p-4 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${b.color}20` }}>
                        <Icon size={20} style={{ color: b.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-[15px] font-black text-white">{b.title}</h3>
                          <span className="px-1.5 py-0.5 rounded text-[11px] font-black" style={{ background: `${b.color}20`, color: b.color }}>{b.type}</span>
                        </div>
                        <p className="text-[12px] text-[hsl(214_15%_45%)] mb-2">{b.desc}</p>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[12px] text-[hsl(214_15%_45%)]">Wagering Progress</span>
                          <span className="text-[12px] font-bold text-white">{pct.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 rounded-full mb-2" style={{ background: "hsl(214 28% 16%)" }}>
                          <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: b.color }} />
                        </div>
                        <div className="flex items-center justify-between text-[12px]">
                          <span className="text-[hsl(214_15%_45%)]">৳{b.wagered.toLocaleString()} / ৳{b.wagerRequired.toLocaleString()}</span>
                          <span className="text-[hsl(214_15%_45%)]">৳{remaining.toLocaleString()} remaining</span>
                        </div>
                        <div className="flex items-center justify-between mt-2 text-[12px]">
                          <span className="text-[hsl(214_15%_45%)] flex items-center gap-1"><Clock size={11} /> Expires: {b.validUntil}</span>
                          <span className="font-black" style={{ color: b.color }}>৳{b.amount.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Available Promotions */}
        <section>
          <h2 className="text-[15px] font-black text-white mb-3 flex items-center gap-2"><Gift size={15} className="text-[#ffba00]" /> Available Promotions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {ALL_PROMOS.map(p => {
              const Icon = p.icon;
              return (
                <Link key={p.id} href={p.href}>
                  <span className="block rounded-xl p-4 border hover:bg-white/[0.03] transition-colors cursor-pointer" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${p.color}20` }}>
                        <Icon size={18} style={{ color: p.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="text-[14px] font-black text-white">{p.title}</h3>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-black" style={{ background: `${p.color}20`, color: p.color }}>{p.tag}</span>
                        </div>
                        <p className="text-[12px] text-[hsl(214_15%_45%)]">{p.desc}</p>
                      </div>
                      <ChevronRight size={15} className="text-[hsl(214_15%_35%)] shrink-0 mt-0.5" />
                    </div>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Loyalty tier */}
        <section>
          <h2 className="text-[15px] font-black text-white mb-3 flex items-center gap-2"><Trophy size={15} className="text-[#ffba00]" /> VIP Status</h2>
          <div className="rounded-xl p-5 border" style={{ background: "hsl(214 44% 10%)", borderColor: "hsl(214 28% 18%)" }}>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #a78bfa, #7c3aed)" }}>
                <Star size={24} className="text-white" />
              </div>
              <div>
                <p className="text-[12px] text-[hsl(214_15%_45%)] uppercase tracking-wider">Current Level</p>
                <p className="text-[19px] font-black text-white">Silver</p>
                <p className="text-[12px] text-[hsl(214_15%_45%)]">Next level: Gold at ৳100,000 wagered</p>
              </div>
            </div>
            <div className="h-2.5 rounded-full mb-2" style={{ background: "hsl(214 28% 16%)" }}>
              <div className="h-2.5 rounded-full" style={{ width: "38%", background: "linear-gradient(90deg, #a78bfa, #7c3aed)" }} />
            </div>
            <div className="flex justify-between text-[12px] text-[hsl(214_15%_45%)]">
              <span>৳38,000 wagered</span><span>৳100,000 needed</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[{ name: "Bronze", color: "#b45309", done: true }, { name: "Silver", color: "#94a3b8", done: true }, { name: "Gold", color: "#ffba00", done: false }, { name: "Platinum", color: "#06b6d4", done: false }].map(t => (
                <div key={t.name} className="text-center p-2 rounded-lg" style={{ background: t.done ? `${t.color}12` : "hsl(214 44% 7%)", border: `1px solid ${t.done ? t.color + "40" : "hsl(214 28% 16%)"}` }}>
                  {t.done && <CheckCircle size={12} className="mx-auto mb-1" style={{ color: t.color }} />}
                  <p className="text-[11px] font-bold" style={{ color: t.done ? t.color : "hsl(214 15% 35%)" }}>{t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AccountLayout>
  );
}
