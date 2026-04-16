import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BetslipPanel from "@/components/BetslipPanel";
import { Trophy } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

const sportFilters = [
  { id: "all", label: "All Sports", icon: "🏆" },
  { id: "football", label: "Football", icon: "⚽" },
  { id: "cricket", label: "Cricket", icon: "🏏" },
  { id: "basketball", label: "Basketball", icon: "🏀" },
  { id: "tennis", label: "Tennis", icon: "🎾" },
  { id: "esports", label: "eSports", icon: "🎮" },
];

const sportToPath: Record<string, string> = {
  football: "/sportsbook/soccer_epl",
  cricket: "/sportsbook/cricket_ipl",
  basketball: "/sportsbook/basketball_nba",
  tennis: "/sportsbook/tennis_atp_french_open",
  esports: "/esports",
};

const tournaments = [
  {
    id: "t1", sport: "football", icon: "⚽", name: "UEFA Champions League",
    country: "Europe", prize: "€2.03 Billion", status: "LIVE",
    teams: 32, matches: 8, nextMatch: "Today 21:00",
    featured: true, color: "from-[hsl(220_70%_25%)] to-[hsl(214_42%_12%)]",
  },
  {
    id: "t2", sport: "cricket", icon: "🏏", name: "IPL 2025",
    country: "India", prize: "₹1,200 Crore", status: "LIVE",
    teams: 10, matches: 12, nextMatch: "Today 19:30",
    featured: true, color: "from-[hsl(25_80%_25%)] to-[hsl(214_42%_12%)]",
  },
  {
    id: "t3", sport: "football", icon: "⚽", name: "FIFA World Cup 2026",
    country: "USA/Canada/Mexico", prize: "$1 Billion", status: "UPCOMING",
    teams: 48, matches: 0, nextMatch: "Jun 2026",
    featured: true, color: "from-[hsl(210_60%_22%)] to-[hsl(214_42%_12%)]",
  },
  {
    id: "t4", sport: "cricket", icon: "🏏", name: "ICC T20 World Cup",
    country: "International", prize: "$10 Million", status: "UPCOMING",
    teams: 20, matches: 0, nextMatch: "Oct 2025",
    featured: false, color: "from-[hsl(120_40%_20%)] to-[hsl(214_42%_12%)]",
  },
  {
    id: "t5", sport: "basketball", icon: "🏀", name: "NBA Playoffs 2025",
    country: "USA", prize: "$22 Million", status: "LIVE",
    teams: 16, matches: 5, nextMatch: "Tonight 02:00",
    featured: false, color: "from-[hsl(20_80%_22%)] to-[hsl(214_42%_12%)]",
  },
  {
    id: "t6", sport: "tennis", icon: "🎾", name: "Wimbledon 2025",
    country: "United Kingdom", prize: "£50 Million", status: "UPCOMING",
    teams: 128, matches: 0, nextMatch: "Jul 2025",
    featured: false, color: "from-[hsl(90_50%_18%)] to-[hsl(214_42%_12%)]",
  },
  {
    id: "t7", sport: "football", icon: "⚽", name: "Premier League 2024/25",
    country: "England", prize: "£2.4 Billion", status: "LIVE",
    teams: 20, matches: 15, nextMatch: "Tomorrow 15:00",
    featured: false, color: "from-[hsl(210_60%_22%)] to-[hsl(214_42%_12%)]",
  },
  {
    id: "t8", sport: "esports", icon: "🎮", name: "ESL Pro League Season 21",
    country: "International", prize: "$750,000", status: "LIVE",
    teams: 24, matches: 6, nextMatch: "Today 20:00",
    featured: false, color: "from-[hsl(270_50%_22%)] to-[hsl(214_42%_12%)]",
  },
  {
    id: "t9", sport: "cricket", icon: "🏏", name: "Bangladesh Premier League",
    country: "Bangladesh", prize: "৳50 Crore", status: "UPCOMING",
    teams: 7, matches: 0, nextMatch: "Jan 2026",
    featured: false, color: "from-[hsl(150_50%_18%)] to-[hsl(214_42%_12%)]",
  },
  {
    id: "t10", sport: "football", icon: "⚽", name: "Copa América 2025",
    country: "South America", prize: "$10 Million", status: "UPCOMING",
    teams: 16, matches: 0, nextMatch: "Jun 2025",
    featured: false, color: "from-[hsl(45_80%_20%)] to-[hsl(214_42%_12%)]",
  },
  {
    id: "t11", sport: "basketball", icon: "🏀", name: "EuroLeague Basketball",
    country: "Europe", prize: "€20 Million", status: "LIVE",
    teams: 18, matches: 4, nextMatch: "Tomorrow 19:00",
    featured: false, color: "from-[hsl(0_60%_22%)] to-[hsl(214_42%_12%)]",
  },
  {
    id: "t12", sport: "tennis", icon: "🎾", name: "Roland Garros 2025",
    country: "France", prize: "€53 Million", status: "UPCOMING",
    teams: 256, matches: 0, nextMatch: "May 2025",
    featured: false, color: "from-[hsl(350_60%_22%)] to-[hsl(214_42%_12%)]",
  },
];

export default function TournamentsPage() {
  const [sport, setSport] = useState("all");
  const [, navigate] = useLocation();

  const filtered = sport === "all" ? tournaments : tournaments.filter(t => t.sport === sport);
  const featured = filtered.filter(t => t.featured);
  const regular = filtered.filter(t => !t.featured);

  const handleBet = (tournament: typeof tournaments[0]) => {
    const path = sportToPath[tournament.sport] ?? "/sportsbook/soccer_epl";
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div
          className="border-b px-4 py-6"
          style={{
            background: "linear-gradient(135deg, hsl(214 55% 16%) 0%, hsl(214 42% 10%) 100%)",
            borderColor: "hsl(214 28% 16%)",
          }}
        >
          <div className="max-w-full mx-auto">
            <div className="flex items-center gap-3 mb-1">
              <Trophy className="w-8 h-8 text-[#ffba00]" />
              <h1 className="text-3xl font-black text-white">Tournaments</h1>
              <span className="px-2 py-0.5 bg-[#ffba00] rounded text-sm font-bold text-[hsl(214_42%_9%)]">
                {tournaments.filter(t => t.status === "LIVE").length} LIVE
              </span>
            </div>
            <p className="text-base text-muted-foreground ml-11">
              Bet on the world's biggest sports tournaments with the best odds
            </p>
          </div>
        </div>

        <div className="max-w-full mx-auto px-3 sm:px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
            <div>
              {/* Sport filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
                {sportFilters.map(f => (
                  <button
                    key={f.id}
                    onClick={() => setSport(f.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      sport === f.id
                        ? "bg-[#ffba00] text-[hsl(214_42%_9%)] font-bold"
                        : "bg-[hsl(214_36%_18%)] text-muted-foreground hover:text-white"
                    }`}
                    data-testid={`tournament-filter-${f.id}`}
                  >
                    {f.icon} {f.label}
                  </button>
                ))}
              </div>

              {/* Featured tournaments */}
              {featured.length > 0 && (
                <>
                  <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                    <span className="text-[#ffba00]">★</span> Featured Tournaments
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
                    {featured.map(t => (
                      <TournamentCard key={t.id} tournament={t} onBet={() => handleBet(t)} />
                    ))}
                  </div>
                </>
              )}

              {/* All tournaments */}
              {regular.length > 0 && (
                <>
                  <h2 className="text-base font-bold text-white mb-3">All Tournaments</h2>
                  <div className="space-y-2.5">
                    {regular.map(t => (
                      <TournamentRow key={t.id} tournament={t} onBet={() => handleBet(t)} />
                    ))}
                  </div>
                </>
              )}

              {filtered.length === 0 && (
                <div className="text-center py-16 text-muted-foreground">
                  <Trophy className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="font-semibold text-white">No tournaments found</p>
                  <p className="text-base mt-1">Check back soon for upcoming events</p>
                </div>
              )}
            </div>
            <aside className="hidden lg:block">
              <BetslipPanel />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function TournamentCard({ tournament: t, onBet }: { tournament: typeof tournaments[0]; onBet: () => void }) {
  return (
    <div
      className={`bg-gradient-to-br ${t.color} border rounded-xl overflow-hidden hover:border-[#ffba00] transition-all group`}
      style={{ borderColor: "hsl(214 28% 20%)" }}
      data-testid={`tournament-card-${t.id}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <span className="text-3xl">{t.icon}</span>
          <span className={`text-[13px] font-bold px-2 py-0.5 rounded ${
            t.status === "LIVE"
              ? "bg-red-500 text-white"
              : "bg-[hsl(214_36%_24%)] text-muted-foreground"
          }`}>
            {t.status}
          </span>
        </div>
        <h3 className="text-base font-bold text-white mb-1 group-hover:text-[#ffba00] transition-colors">
          {t.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3">{t.country}</p>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{t.teams} teams</span>
          <span className="font-semibold text-[#ffba00]">{t.prize}</span>
        </div>
        {t.status === "LIVE" && (
          <div className="mt-2 text-sm text-green-400">
            🔴 {t.matches} matches live
          </div>
        )}
        {t.status === "UPCOMING" && (
          <div className="mt-2 text-sm text-muted-foreground">
            🗓 Starts: {t.nextMatch}
          </div>
        )}
        <button
          onClick={onBet}
          className="mt-3 w-full py-1.5 bg-[#ffba00] text-[hsl(214_42%_9%)] rounded text-sm font-bold hover:bg-[#ffc929] transition-colors"
          data-testid={`tournament-bet-${t.id}`}
        >
          Bet Now
        </button>
      </div>
    </div>
  );
}

function TournamentRow({ tournament: t, onBet }: { tournament: typeof tournaments[0]; onBet: () => void }) {
  return (
    <div
      className="bg-card border border-card-border rounded-lg px-4 py-3 flex items-center gap-4 hover:border-[#ffba00] transition-all group"
      data-testid={`tournament-row-${t.id}`}
    >
      <span className="text-3xl shrink-0">{t.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-base font-bold text-white group-hover:text-[#ffba00] transition-colors truncate">
            {t.name}
          </p>
          <span className={`shrink-0 text-[12px] font-bold px-1.5 py-0.5 rounded ${
            t.status === "LIVE" ? "bg-red-500 text-white" : "bg-[hsl(214_36%_22%)] text-muted-foreground"
          }`}>
            {t.status}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-0.5">
          {t.country} · {t.teams} teams · {t.status === "LIVE" ? `${t.matches} live matches` : `Starts ${t.nextMatch}`}
        </p>
      </div>
      <div className="shrink-0 text-right">
        <p className="text-sm font-bold text-[#ffba00]">{t.prize}</p>
        <button
          onClick={onBet}
          className="mt-1 px-3 py-1 bg-[hsl(214_36%_20%)] border border-[hsl(214_28%_28%)] hover:bg-[#ffba00] hover:border-[#ffba00] hover:text-[hsl(214_42%_9%)] text-white rounded text-sm font-medium transition-colors"
          data-testid={`tournament-row-bet-${t.id}`}
        >
          Bet
        </button>
      </div>
    </div>
  );
}
