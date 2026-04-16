import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BetslipPanel from "@/components/BetslipPanel";
import { Monitor } from "lucide-react";
import { useState } from "react";
import { useBetslip } from "@/context/BetslipContext";

const esportsMatches = [
  {
    id: "es1", game: "CS2", icon: "🎯", league: "ESL Pro League",
    team1: "NAVI", team2: "FaZe Clan", time: "Today 20:00",
    odds: { t1: "2.10", t2: "1.75" }
  },
  {
    id: "es2", game: "Dota 2", icon: "🏆", league: "The International",
    team1: "Team Spirit", team2: "OG", time: "Today 22:00",
    odds: { t1: "1.90", t2: "1.95" }
  },
  {
    id: "es3", game: "League of Legends", icon: "⚔️", league: "LEC Spring",
    team1: "G2 Esports", team2: "Fnatic", time: "Tomorrow 18:00",
    odds: { t1: "1.65", t2: "2.20" }
  },
  {
    id: "es4", game: "Valorant", icon: "🔫", league: "VCT Champions",
    team1: "Sentinels", team2: "LOUD", time: "Tomorrow 21:00",
    odds: { t1: "2.50", t2: "1.55" }
  },
  {
    id: "es5", game: "CS2", icon: "🎯", league: "BLAST Premier",
    team1: "Vitality", team2: "Liquid", time: "Sat 19:00",
    odds: { t1: "1.80", t2: "2.05" }
  },
  {
    id: "es6", game: "Dota 2", icon: "🏆", league: "DPC League",
    team1: "PSG.LGD", team2: "T1", time: "Sat 14:00",
    odds: { t1: "1.70", t2: "2.15" }
  },
];

const games = ["All", "CS2", "Dota 2", "League of Legends", "Valorant"];

export default function ESportsPage() {
  const [selectedGame, setSelectedGame] = useState("All");
  const { addBet, hasBet, removeBet } = useBetslip();

  const filtered = selectedGame === "All"
    ? esportsMatches
    : esportsMatches.filter(m => m.game === selectedGame);

  const handleOdd = (matchId: string, team: string, matchLabel: string, odd: string) => {
    const betId = `${matchId}-${team}`;
    if (hasBet(betId)) {
      removeBet(betId);
    } else {
      addBet({
        id: betId,
        match: matchLabel,
        selection: team,
        odds: parseFloat(odd),
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-r from-[hsl(270_50%_14%)] via-[hsl(210_65%_10%)] to-[hsl(210_65%_10%)] border-b border-[hsl(210_40%_18%)] px-4 py-6">
          <div className="max-w-full mx-auto">
            <div className="flex items-center gap-3 mb-1">
              <Monitor className="w-8 h-8 text-[hsl(270_80%_65%)]" />
              <h1 className="text-3xl font-black text-white">eSports</h1>
              <span className="px-2 py-0.5 bg-[hsl(270_60%_50%)] rounded text-sm font-bold text-white">LIVE ODDS</span>
            </div>
            <p className="text-base text-muted-foreground ml-11">Bet on CS2, Dota 2, LoL, Valorant and more</p>
          </div>
        </div>

        <div className="max-w-full mx-auto px-3 sm:px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
            <div>
              {/* Game filter tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
                {games.map(game => (
                  <button
                    key={game}
                    onClick={() => setSelectedGame(game)}
                    className={`shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      selectedGame === game
                        ? "bg-[#ffba00] text-[hsl(214_42%_9%)]"
                        : "bg-[hsl(214_36%_18%)] text-muted-foreground hover:text-white"
                    }`}
                    data-testid={`esports-game-${game.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {game === "All" ? "🎮 All Games" :
                     game === "CS2" ? "🎯 CS2" :
                     game === "Dota 2" ? "🏆 Dota 2" :
                     game === "League of Legends" ? "⚔️ LoL" : "🔫 Valorant"}
                  </button>
                ))}
              </div>

              <div className="space-y-2.5">
                {filtered.map(match => (
                  <div
                    key={match.id}
                    className="bg-card border border-card-border rounded-lg overflow-hidden hover:border-[#ffba00] transition-all"
                    data-testid={`esports-match-${match.id}`}
                  >
                    <div className="px-3 py-2 bg-[hsl(210_60%_12%)] flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{match.icon}</span>
                      <span className="font-semibold text-white">{match.game}</span>
                      <span className="opacity-40">·</span>
                      <span>{match.league}</span>
                      <span className="ml-auto">{match.time}</span>
                    </div>
                    <div className="px-3 py-3 flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-base font-bold text-white">{match.team1}</p>
                        <p className="text-base font-bold text-white mt-1">{match.team2}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        {[
                          { key: "t1", label: "1", team: match.team1, odd: match.odds.t1 },
                          { key: "t2", label: "2", team: match.team2, odd: match.odds.t2 },
                        ].map(({ key, label, team, odd }) => {
                          const betId = `${match.id}-${key}`;
                          const selected = hasBet(betId);
                          return (
                            <button
                              key={key}
                              onClick={() => handleOdd(match.id, key, `${match.team1} vs ${match.team2}`, odd)}
                              className={`px-4 py-2.5 rounded text-sm font-bold border transition-all min-w-[60px] ${
                                selected
                                  ? "bg-[#ffba00] border-[#ffba00] text-[hsl(214_42%_9%)]"
                                  : "bg-[hsl(214_36%_18%)] border-[hsl(214_28%_24%)] text-white hover:bg-[#ffba00] hover:border-[#ffba00] hover:text-[hsl(214_42%_9%)]"
                              }`}
                              data-testid={`esports-odd-${match.id}-${key}`}
                            >
                              <span className={`block text-[13px] font-normal mb-0.5 ${selected ? "text-[hsl(214_42%_20%)]" : "text-muted-foreground"}`}>{label}</span>
                              {odd}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
