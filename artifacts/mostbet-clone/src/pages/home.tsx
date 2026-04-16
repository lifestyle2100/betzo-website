import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PromoBanner from "@/components/PromoBanner";
import BetslipPanel from "@/components/BetslipPanel";
import SportsSidebar from "@/components/SportsSidebar";
import RealMatchCard from "@/components/RealMatchCard";
import CasinoGameCard from "@/components/CasinoGameCard";
import { useGetOdds } from "@workspace/api-client-react";
import { normalizeEvent } from "@/lib/sportsData";
import { getMockMatchesBySport } from "@/lib/mockMatches";
import { Link, useLocation } from "wouter";
import { TrendingUp, Zap, Trophy, Star, ChevronRight, Flame, RefreshCw } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const casinoGames = [
  { id: "g1", name: "Book of Dead", provider: "Play'n GO", category: "slots", rtp: "96.21%", isHot: true, colorScheme: "orange" as const },
  { id: "g2", name: "Gates of Olympus", provider: "Pragmatic Play", category: "slots", rtp: "96.50%", isHot: true, colorScheme: "blue" as const },
  { id: "g3", name: "Lightning Roulette", provider: "Evolution Gaming", category: "roulette", rtp: "97.30%", colorScheme: "red" as const },
  { id: "g4", name: "Crazy Time", provider: "Evolution Gaming", category: "live-casino", isNew: true, colorScheme: "purple" as const },
  { id: "g5", name: "Blackjack VIP", provider: "Playtech", category: "blackjack", rtp: "99.50%", colorScheme: "green" as const },
  { id: "g6", name: "Sweet Bonanza", provider: "Pragmatic Play", category: "slots", rtp: "96.48%", isNew: true, colorScheme: "orange" as const },
  { id: "g7", name: "Aviator", provider: "Spribe", category: "crash", isHot: true, colorScheme: "blue" as const },
  { id: "g8", name: "Dragon Tiger", provider: "Evolution Gaming", category: "baccarat", colorScheme: "red" as const },
];

const TABS = [
  { key: "cricket_ipl", label: "🏏 IPL" },
  { key: "cricket_international_t20", label: "🏏 T20 Intl" },
  { key: "cricket_psl", label: "🏏 PSL" },
  { key: "soccer_epl", label: "⚽ Premier League" },
  { key: "basketball_nba", label: "🏀 NBA" },
];

function MatchSkeleton() {
  return (
    <div className="rounded-sm p-3 space-y-2" style={{ background: "hsl(214 32% 15%)", border: "1px solid hsl(214 28% 18%)" }}>
      <Skeleton className="h-3 w-2/3 bg-[hsl(214_28%_20%)]" />
      <Skeleton className="h-4 w-3/4 bg-[hsl(214_28%_20%)]" />
      <Skeleton className="h-4 w-1/2 bg-[hsl(214_28%_20%)]" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-9 flex-1 bg-[hsl(214_28%_20%)]" />
        <Skeleton className="h-9 flex-1 bg-[hsl(214_28%_20%)]" />
        <Skeleton className="h-9 flex-1 bg-[hsl(214_28%_20%)]" />
      </div>
    </div>
  );
}

function SportTab({ sportKey }: { sportKey: string }) {
  const { data, isLoading } = useGetOdds(
    { sport: sportKey, regions: "us,uk,eu", markets: "h2h" },
    { query: { retry: 1, staleTime: 60_000 } }
  );
  const apiMatches = (data ?? []).map(normalizeEvent);
  // Use mock data when API returns nothing (key expired, quota exceeded, etc.)
  const matches = (apiMatches.length > 0 ? apiMatches : getMockMatchesBySport(sportKey)).slice(0, 6);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {Array.from({ length: 4 }).map((_, i) => <MatchSkeleton key={i} />)}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {matches.map((match) => (
        <RealMatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState(TABS[0].key);
  const [, navigate] = useLocation();

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(214 36% 12%)" }}>
      <Header />

      {/* Stats bar — Mostbet style */}
      <div className="border-b" style={{ background: "hsl(214 40% 10%)", borderColor: "hsl(214 28% 15%)" }}>
        <div className="max-w-full mx-auto px-4 py-1.5 flex items-center justify-around gap-4">
          {[
            { icon: Trophy, label: "Sports Markets", value: "1M+", color: "text-yellow-400" },
            { icon: Zap, label: "Live Events", value: "Live", color: "text-red-400" },
            { icon: Star, label: "Casino Games", value: "5,000+", color: "text-purple-400" },
            { icon: TrendingUp, label: "Active Users", value: "200K+", color: "text-green-400" },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex items-center gap-2">
              <Icon className={`w-3.5 h-3.5 ${color} shrink-0`} />
              <div className="hidden sm:block">
                <span className="text-white font-bold text-[14px]">{value}</span>
                <span className="text-[hsl(214_15%_48%)] text-[14px] ml-1">{label}</span>
              </div>
              <div className="sm:hidden">
                <span className="text-white font-bold text-sm">{value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <main className="flex-1">
        <div className="max-w-full mx-auto px-3 sm:px-4 py-3">
          {/* 3-column layout: left sidebar | center | right betslip */}
          <div className="flex gap-3">
            {/* Left sidebar */}
            <SportsSidebar />

            {/* Center content */}
            <div className="flex-1 min-w-0 space-y-4">
              {/* Promo banner */}
              <PromoBanner />

              {/* Live odds section */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4" style={{ color: "#ffba00" }} />
                    <h2 className="text-[16px] font-bold text-white">Live Odds</h2>
                    <span className="flex items-center gap-1 text-[14px] text-green-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                      Real-time
                    </span>
                  </div>
                  <Link href="/sportsbook">
                    <span
                      className="text-[14px] text-[hsl(210_100%_65%)] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                      data-testid="link-view-all-sports"
                    >
                      View All <ChevronRight className="w-3 h-3" />
                    </span>
                  </Link>
                </div>

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList
                    className="h-auto flex-wrap gap-0.5 p-0.5 mb-2.5"
                    style={{ background: "hsl(214 38% 10%)", border: "1px solid hsl(214 28% 16%)" }}
                  >
                    {TABS.map((tab) => (
                      <TabsTrigger
                        key={tab.key}
                        value={tab.key}
                        className="text-[14px] px-2.5 py-1.5 rounded-sm text-[hsl(214_10%_62%)] data-[state=active]:bg-[#ffba00] data-[state=active]:text-[hsl(214_42%_9%)] data-[state=active]:font-bold data-[state=active]:shadow-none"
                        data-testid={`home-tab-${tab.key}`}
                      >
                        {tab.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {TABS.map((tab) => (
                    <TabsContent key={tab.key} value={tab.key} className="mt-0">
                      <SportTab sportKey={tab.key} />
                    </TabsContent>
                  ))}
                </Tabs>
              </div>

              {/* Top Casino Games */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🎰</span>
                    <h2 className="text-[16px] font-bold text-white">Top Casino Games</h2>
                  </div>
                  <Link href="/casino">
                    <span
                      className="text-[14px] text-[hsl(210_100%_65%)] hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
                      data-testid="link-view-all-casino"
                    >
                      View All <ChevronRight className="w-3 h-3" />
                    </span>
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {casinoGames.map((game) => (
                    <CasinoGameCard key={game.id} {...game} />
                  ))}
                </div>
              </div>

              {/* Promotions strip */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">🎁</span>
                  <h2 className="text-[16px] font-bold text-white">Promotions</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { title: "Welcome Bonus", desc: "125% up to ৳30,000 on first deposit", icon: "🎉", color: "#ffba00", textColor: "hsl(214 42% 9%)", tag: "NEW" },
                    { title: "Free Spins Friday", desc: "Get 50 free spins every Friday", icon: "🎰", color: "hsl(270 60% 55%)", textColor: "white", tag: "WEEKLY" },
                    { title: "Accumulator Boost", desc: "Up to 100% profit boost on accas", icon: "⚽", color: "hsl(142 60% 38%)", textColor: "white", tag: "SPORTS" },
                  ].map((promo) => (
                    <div
                      key={promo.title}
                      className="rounded-sm p-3 hover:border-[hsl(214_28%_28%)] transition-all cursor-pointer"
                      style={{ background: "hsl(214 32% 15%)", border: "1px solid hsl(214 28% 18%)" }}
                      onClick={() => navigate("/promotions")}
                      data-testid={`promo-${promo.title.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="text-2xl">{promo.icon}</span>
                        <div className="flex-1 min-w-0">
                          <span
                            className="inline-block text-[12px] font-bold px-1.5 py-0.5 rounded mb-1"
                            style={{ backgroundColor: promo.color + "33", color: promo.color }}
                          >
                            {promo.tag}
                          </span>
                          <p className="text-[14px] font-semibold text-white">{promo.title}</p>
                          <p className="text-[14px] text-[hsl(214_15%_48%)] mt-0.5">{promo.desc}</p>
                        </div>
                      </div>
                      <button
                        className="w-full mt-2.5 py-1.5 rounded-sm text-[14px] font-bold transition-colors"
                        style={{ background: promo.color, color: promo.textColor }}
                        data-testid={`promo-cta-${promo.title.toLowerCase().replace(/\s/g, "-")}`}
                      >
                        Claim Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right betslip */}
            <aside className="w-[230px] shrink-0 hidden lg:flex flex-col">
              <div className="sticky top-[109px] space-y-2">
                <BetslipPanel />

                {/* Top Winners */}
                <div
                  className="rounded-sm overflow-hidden"
                  style={{ background: "hsl(214 38% 10%)", border: "1px solid hsl(214 28% 16%)" }}
                >
                  <div
                    className="px-3 py-2 flex items-center gap-2 border-b"
                    style={{ background: "hsl(214 42% 8%)", borderColor: "hsl(214 28% 14%)" }}
                  >
                    <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                    <h3 className="text-[13px] font-bold text-white uppercase tracking-widest">Top Winners Today</h3>
                  </div>
                  <div>
                    {[
                      { user: "user***23", amount: "+৳4,52,000", odd: "14.50x" },
                      { user: "bet***77", amount: "+৳2,18,000", odd: "8.72x" },
                      { user: "ace***15", amount: "+৳1,89,000", odd: "6.30x" },
                      { user: "win***42", amount: "+৳1,24,000", odd: "12.40x" },
                      { user: "pro***88", amount: "+৳98,000", odd: "4.90x" },
                    ].map((winner, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between px-3 py-2 border-b"
                        style={{ borderColor: "hsl(214 28% 14%)" }}
                        data-testid={`winner-${i}`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[14px] font-bold w-4 text-center ${
                              i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : i === 2 ? "text-amber-600" : "text-[hsl(214_15%_40%)]"
                            }`}
                          >
                            {i + 1}
                          </span>
                          <span className="text-[14px] text-[hsl(214_15%_55%)]">{winner.user}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-[14px] font-bold text-green-400">{winner.amount}</p>
                          <p className="text-[13px] text-[hsl(214_15%_38%)]">{winner.odd}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
