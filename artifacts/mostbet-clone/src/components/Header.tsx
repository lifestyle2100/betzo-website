import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, Search, Bell, ChevronDown, LogOut, User, Wallet, Globe, MessageCircle, TrendingUp, Trophy, Star, Clock, Lock } from "lucide-react";
import logo from "@/assets/xbetzone-logo.png";
import { useAuth } from "@/context/AuthContext";
import { useLang, LANGUAGES } from "@/context/LanguageContext";

const NAV_ITEMS = [
  { labelKey: "sports" as const,      href: "/sportsbook",   icon: "⚽" },
  { labelKey: "live" as const,        href: "/live",         icon: "🔴", badge: "LIVE" },
  { labelKey: "fastGames" as const,   href: "/fast-games",   icon: "⚡" },
  { labelKey: "casino" as const,      href: "/casino",       icon: "🎰" },
  { labelKey: "liveCasino" as const,  href: "/live-casino",  icon: "🃏" },
  { labelKey: "aviator" as const,     href: "/aviator",      icon: "✈️", badge: "HOT" },
  { labelKey: "esports" as const,     href: "/esports",      icon: "🎮" },
  { labelKey: "fantasySport" as const,href: "/fantasy-sport",icon: "🏆" },
  { labelKey: "virtualSports" as const,href: "/virtual-sports",icon: "🕹️" },
  { labelKey: "poker" as const,       href: "/poker",        icon: "♠️" },
  { labelKey: "toto" as const,        href: "/toto",         icon: "🎯" },
  { labelKey: "tournaments" as const, href: "/tournaments",  icon: "🥇" },
  { labelKey: "promotions" as const,  href: "/promotions",   icon: "🎁" },
];

export default function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const { user, logout } = useAuth();
  const { t, lang, langOption, setLang } = useLang();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const navLabels: Record<typeof NAV_ITEMS[number]["labelKey"], string> = {
    sports: t.nav.sports,
    live: t.nav.live,
    fastGames: t.nav.fastGames,
    casino: t.nav.casino,
    liveCasino: t.nav.liveCasino,
    aviator: t.nav.aviator,
    esports: t.nav.esports,
    fantasySport: t.nav.fantasySport,
    virtualSports: t.nav.virtualSports,
    poker: t.nav.poker,
    toto: t.nav.toto,
    tournaments: t.nav.tournaments,
    promotions: t.nav.promotions,
  };

  const isActive = (href: string) =>
    location === href || (href !== "/" && location.startsWith(href));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    setUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 shadow-2xl" style={{ background: "hsl(214 44% 8%)" }}>
      {/* ── Top utility bar ── */}
      <div style={{ background: "hsl(214 48% 6%)", borderBottom: "1px solid hsl(214 28% 12%)" }}>
        <div className="max-w-full px-4 h-[36px] flex items-center justify-between text-[14px] text-[hsl(214_15%_50%)]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
              <span className="text-green-400 font-semibold">Live: 847 events</span>
            </span>
            <span className="hidden sm:inline" style={{ color: "hsl(214 28% 22%)" }}>|</span>
            <span className="hidden sm:inline text-[hsl(214_15%_38%)]">Best Odds Guaranteed</span>
          </div>
          <div className="flex items-center gap-3">
            {/* Language selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangMenuOpen(v => !v)}
                className="flex items-center gap-1 hover:text-white transition-colors px-1 py-0.5 rounded hover:bg-white/5"
                data-testid="language-selector"
              >
                <Globe className="w-3 h-3" />
                <span className="text-base leading-none">{langOption.flag}</span>
                <span className="font-semibold text-[14px]">{langOption.label}</span>
                <ChevronDown className={`w-2.5 h-2.5 transition-transform ${langMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {langMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-1 w-48 rounded-xl border overflow-hidden z-[200] shadow-2xl"
                  style={{ background: "hsl(214 42% 11%)", borderColor: "hsl(214 28% 20%)" }}
                  data-testid="language-menu"
                >
                  <div className="px-3 py-2 border-b" style={{ borderColor: "hsl(214 28% 16%)" }}>
                    <p className="text-[13px] font-bold text-[hsl(214_15%_45%)] uppercase tracking-widest">Select Language</p>
                  </div>
                  {LANGUAGES.map(l => (
                    <button
                      key={l.code}
                      onClick={() => { setLang(l.code); setLangMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors hover:bg-[hsl(214_36%_16%)] ${
                        lang === l.code ? "text-[#ffba00] bg-[rgba(255,186,0,0.07)]" : "text-[hsl(214_8%_70%)]"
                      }`}
                      data-testid={`lang-option-${l.code}`}
                    >
                      <span className="text-lg">{l.flag}</span>
                      <span className="flex-1 text-left font-medium">{l.nativeName}</span>
                      {lang === l.code && <span className="w-1.5 h-1.5 rounded-full bg-[#ffba00]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <span style={{ color: "hsl(214 28% 22%)" }}>|</span>
            <button className="flex items-center gap-1 hover:text-white transition-colors text-[14px]">
              BDT <ChevronDown className="w-2.5 h-2.5" />
            </button>
            <span style={{ color: "hsl(214 28% 22%)" }}>|</span>
            <a href="#" className="hover:text-white transition-colors flex items-center gap-1 text-[14px]">
              <MessageCircle className="w-3 h-3" />
              {t.common.support}
            </a>
          </div>
        </div>
      </div>

      {/* ── Main nav bar ── */}
      <div style={{ borderBottom: "1px solid hsl(214 28% 12%)" }}>
        <div className="max-w-full px-3 flex items-center gap-2 h-[56px]">
          {/* Logo */}
          <Link href="/" data-testid="link-logo">
            <div className="flex items-center shrink-0 mr-1">
              <img src={logo} alt="XBetZone" className="h-8 w-auto object-contain" style={{ maxWidth: 140 }} />
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-stretch h-full flex-1 overflow-x-auto no-scrollbar">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              const label = navLabels[item.labelKey];
              return (
                <Link key={item.href} href={item.href} data-testid={`link-nav-${item.href.replace(/\//g, "").replace(/-/g, "")}`}>
                  <span
                    className={`relative flex items-center gap-1.5 px-3 h-full text-[15px] font-semibold cursor-pointer transition-colors whitespace-nowrap ${
                      active
                        ? "text-[#ffba00]"
                        : "text-[hsl(214_8%_68%)] hover:text-white hover:bg-white/[0.03]"
                    }`}
                  >
                    <span className="text-[15px] leading-none">{item.icon}</span>
                    {label}
                    {item.badge === "LIVE" && (
                      <span className="px-1 py-0.5 text-[12px] font-black rounded-sm text-white bg-red-600 leading-none animate-pulse tracking-wide">
                        LIVE
                      </span>
                    )}
                    {active && (
                      <span className="absolute bottom-0 left-1 right-1 h-[2px] rounded-t" style={{ background: "#ffba00" }} />
                    )}
                  </span>
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1.5 shrink-0 ml-auto">
            <button
              className="hidden sm:flex p-2 rounded text-[hsl(214_15%_50%)] hover:text-white hover:bg-white/[0.06] transition-colors"
              data-testid="button-search"
            >
              <Search className="w-4 h-4" />
            </button>
            {/* ── Notification bell ── */}
            <div className="hidden sm:block relative" ref={notifRef}>
              <button
                onClick={() => setNotifOpen(v => !v)}
                className="flex p-2 rounded text-[hsl(214_15%_50%)] hover:text-white hover:bg-white/[0.06] transition-colors relative"
                data-testid="button-notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
              </button>

              {notifOpen && (
                <div
                  className="absolute right-0 top-full mt-1.5 w-[340px] rounded-sm shadow-2xl z-50 overflow-hidden"
                  style={{ background: "hsl(214 38% 11%)", border: "1px solid hsl(214 28% 18%)" }}
                  data-testid="notification-dropdown"
                >
                  {/* Header */}
                  <div
                    className="flex items-center justify-between px-4 py-3 border-b"
                    style={{ borderColor: "hsl(214 28% 16%)", background: "hsl(214 42% 9%)" }}
                  >
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-[#ffba00]" />
                      <span className="font-bold text-white text-[15px]">Notifications</span>
                      <span className="px-1.5 py-0.5 text-[11px] font-black rounded bg-red-500 text-white">3</span>
                    </div>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-[hsl(214_15%_45%)] hover:text-white transition-colors text-[13px]"
                    >
                      Mark all read
                    </button>
                  </div>

                  {/* Notification items */}
                  <div className="max-h-[360px] overflow-y-auto">
                    {[
                      {
                        icon: "🎁",
                        title: "Welcome Bonus Activated!",
                        desc: "Your 125% first deposit bonus up to ৳30,000 is ready to use.",
                        time: "Just now",
                        unread: true,
                        color: "text-[#ffba00]",
                      },
                      {
                        icon: "✅",
                        title: "Bet Settled — Win!",
                        desc: "Man City vs Arsenal · Man City Win @ 1.85 — You won ৳925.00",
                        time: "2 min ago",
                        unread: true,
                        color: "text-green-400",
                      },
                      {
                        icon: "💰",
                        title: "Deposit Confirmed",
                        desc: "৳5,000 has been successfully added to your account.",
                        time: "1 hour ago",
                        unread: true,
                        color: "text-green-400",
                      },
                      {
                        icon: "🏆",
                        title: "Tournament Starting Soon",
                        desc: "Sunday Special poker tournament starts in 30 minutes. ৳1,50,000 prize pool.",
                        time: "3 hours ago",
                        unread: false,
                        color: "text-blue-400",
                      },
                      {
                        icon: "⚽",
                        title: "Match Reminder",
                        desc: "Liverpool vs Chelsea kicks off in 1 hour. Check the latest odds.",
                        time: "5 hours ago",
                        unread: false,
                        color: "text-[hsl(214_15%_55%)]",
                      },
                      {
                        icon: "🔒",
                        title: "Login from New Device",
                        desc: "New login detected from Chrome on Windows. Not you? Secure your account.",
                        time: "Yesterday",
                        unread: false,
                        color: "text-red-400",
                      },
                    ].map((n, i) => (
                      <div
                        key={i}
                        className="flex gap-3 px-4 py-3 border-b cursor-pointer hover:bg-white/[0.03] transition-colors"
                        style={{
                          borderColor: "hsl(214 28% 14%)",
                          background: n.unread ? "hsl(214 40% 13%)" : "transparent",
                        }}
                      >
                        <div className="text-xl mt-0.5 shrink-0">{n.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-[13px] font-bold ${n.unread ? "text-white" : "text-[hsl(214_15%_60%)]"}`}>
                              {n.title}
                            </p>
                            {n.unread && (
                              <span className="w-2 h-2 rounded-full bg-[#ffba00] shrink-0" />
                            )}
                          </div>
                          <p className="text-[12px] text-[hsl(214_15%_45%)] mt-0.5 leading-snug">{n.desc}</p>
                          <p className={`text-[11px] mt-1 ${n.color}`}>{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer */}
                  <div
                    className="px-4 py-2.5 text-center border-t"
                    style={{ borderColor: "hsl(214 28% 16%)", background: "hsl(214 42% 9%)" }}
                  >
                    <Link href="/notifications">
                      <span
                        className="text-[13px] font-semibold text-[#ffba00] hover:text-white transition-colors cursor-pointer"
                        onClick={() => setNotifOpen(false)}
                      >
                        View all notifications →
                      </span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {user ? (
              <div className="flex items-center gap-1.5">
                <div
                  className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-sm font-bold"
                  style={{ background: "hsl(214 36% 14%)", borderColor: "hsl(214 28% 22%)" }}
                  data-testid="user-balance"
                >
                  <Wallet className="w-3.5 h-3.5 text-[#ffba00]" />
                  <span className="text-white">৳{parseFloat(user.balance).toFixed(2)}</span>
                </div>

                <Link href="/deposit">
                  <span
                    className="hidden sm:flex px-3 py-1.5 text-[14px] font-black rounded text-[hsl(214_42%_9%)] hover:brightness-110 transition-all cursor-pointer"
                    style={{ background: "#ffba00" }}
                    data-testid="button-deposit"
                  >
                    {t.common.deposit}
                  </span>
                </Link>

                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setUserMenuOpen(v => !v)}
                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border text-sm font-semibold text-white hover:border-[#ffba00] transition-colors"
                    style={{ background: "hsl(214 36% 14%)", borderColor: "hsl(214 28% 22%)" }}
                    data-testid="user-menu-button"
                  >
                    <User className="w-3.5 h-3.5 text-[#ffba00]" />
                    <span className="hidden sm:inline max-w-[80px] truncate">{user.username}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  {userMenuOpen && (
                    <div
                      className="absolute right-0 top-full mt-1 w-52 rounded-lg border overflow-hidden z-50 shadow-xl"
                      style={{ background: "hsl(214 42% 11%)", borderColor: "hsl(214 28% 20%)" }}
                    >
                      <div className="px-4 py-3 border-b" style={{ borderColor: "hsl(214 28% 16%)" }}>
                        <p className="text-sm font-bold text-white">{user.username}</p>
                        <p className="text-[13px] text-muted-foreground truncate">{user.email}</p>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Wallet className="w-3 h-3 text-[#ffba00]" />
                          <span className="text-sm font-bold text-[#ffba00]">৳{parseFloat(user.balance).toFixed(2)}</span>
                        </div>
                      </div>
                      {[
                        { icon: User,        label: "My Profile",     href: "/profile" },
                        { icon: Wallet,      label: "Deposit",        href: "/deposit" },
                        { icon: TrendingUp,  label: "Withdraw",       href: "/withdraw" },
                        { icon: Trophy,      label: "My Bets",        href: "/my-bets" },
                        { icon: Clock,       label: "Transactions",   href: "/transactions" },
                        { icon: Star,        label: "Bonuses",        href: "/bonuses" },
                        { icon: Bell,        label: "Notifications",  href: "/notifications" },
                        { icon: Lock,        label: "Security",       href: "/security" },
                      ].map(({ icon: Icon, label, href }) => (
                        <Link key={href} href={href}>
                          <span
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[hsl(214_8%_72%)] hover:text-white hover:bg-[hsl(214_36%_16%)] transition-colors cursor-pointer"
                          >
                            <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                            {label}
                          </span>
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-[hsl(214_36%_16%)] transition-colors border-t"
                        style={{ borderColor: "hsl(214 28% 16%)" }}
                        data-testid="button-logout"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Log Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <Link href="/login">
                  <button
                    className="px-3.5 py-1.5 text-[15px] font-semibold rounded text-white border border-[hsl(214_28%_26%)] hover:border-[hsl(214_28%_36%)] hover:bg-white/[0.06] transition-colors"
                    data-testid="button-login"
                  >
                    {t.common.login}
                  </button>
                </Link>
                <Link href="/register">
                  <button
                    className="px-3.5 py-1.5 text-[15px] font-black rounded text-[hsl(214_42%_9%)] transition-all hover:brightness-110"
                    style={{ background: "#ffba00" }}
                    data-testid="button-register"
                  >
                    {t.common.register}
                  </button>
                </Link>
              </>
            )}

            <button
              className="lg:hidden p-2 rounded text-[hsl(214_15%_55%)] hover:text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Nav ── */}
      {mobileOpen && (
        <div className="lg:hidden" style={{ background: "hsl(214 44% 8%)", borderBottom: "1px solid hsl(214 28% 12%)" }}>
          {NAV_ITEMS.map((item) => {
            const label = navLabels[item.labelKey];
            return (
              <Link key={item.href} href={item.href}>
                <span
                  className={`flex items-center gap-2.5 px-4 py-3 text-[15px] font-medium border-b cursor-pointer transition-colors ${
                    isActive(item.href)
                      ? "text-[#ffba00] bg-[rgba(255,186,0,0.06)]"
                      : "text-[hsl(214_8%_72%)] hover:text-white hover:bg-white/[0.04]"
                  }`}
                  style={{ borderColor: "hsl(214 28% 12%)" }}
                  onClick={() => setMobileOpen(false)}
                  data-testid={`link-mobile-${item.href.replace(/\//g, "").replace(/-/g, "")}`}
                >
                  <span className="text-lg leading-none">{item.icon}</span>
                  {label}
                  {item.badge === "LIVE" && (
                    <span className="ml-auto px-1.5 py-0.5 text-[13px] font-bold rounded bg-red-600 text-white animate-pulse">
                      LIVE
                    </span>
                  )}
                </span>
              </Link>
            );
          })}

          {/* Mobile language selector */}
          <div className="px-4 py-3" style={{ borderBottom: "1px solid hsl(214 28% 12%)" }}>
            <p className="text-[13px] font-bold text-[hsl(214_15%_45%)] uppercase tracking-widest mb-2">Language</p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(l => (
                <button
                  key={l.code}
                  onClick={() => setLang(l.code)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    lang === l.code
                      ? "bg-[rgba(255,186,0,0.14)] text-[#ffba00] border border-[rgba(255,186,0,0.28)]"
                      : "bg-[hsl(214_36%_16%)] text-[hsl(214_8%_68%)] border border-transparent"
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.nativeName}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 flex gap-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex-1 py-2 text-base font-semibold rounded text-red-400 border border-red-800"
              >
                Log Out
              </button>
            ) : (
              <>
                <Link href="/login" className="flex-1">
                  <button className="w-full py-2 text-base font-semibold rounded text-white border border-[hsl(214_28%_26%)]">{t.common.login}</button>
                </Link>
                <Link href="/register" className="flex-1">
                  <button className="w-full py-2 text-base font-black rounded text-[hsl(214_42%_9%)]" style={{ background: "#ffba00" }}>{t.common.register}</button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
