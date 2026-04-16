import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BetslipPanel from "@/components/BetslipPanel";
import { Clock, Zap } from "lucide-react";
import { useBetslip } from "@/context/BetslipContext";

const virtualSports = [
  { id: "vs1", name: "Virtual Football", icon: "⚽", provider: "Kiron", nextGame: "2 min", description: "English Premier League simulation", hot: true },
  { id: "vs2", name: "Virtual Basketball", icon: "🏀", provider: "Kiron", nextGame: "3 min", description: "NBA-style virtual matchups", hot: false },
  { id: "vs3", name: "Virtual Tennis", icon: "🎾", provider: "Kiron", nextGame: "1 min", description: "Grand slam simulations", hot: true },
  { id: "vs4", name: "Virtual Horse Racing", icon: "🏇", provider: "Leap Gaming", nextGame: "4 min", description: "8-horse race events every 3 minutes", hot: false },
  { id: "vs5", name: "Virtual Greyhound", icon: "🐕", provider: "Leap Gaming", nextGame: "2 min", description: "6-dog sprint races", hot: false },
  { id: "vs6", name: "Virtual Cricket", icon: "🏏", provider: "Kiron", nextGame: "5 min", description: "T20 format virtual cricket", hot: true },
  { id: "vs7", name: "Virtual Motorsport", icon: "🏎️", provider: "Leap Gaming", nextGame: "6 min", description: "Formula racing simulation", hot: false },
  { id: "vs8", name: "Virtual Cycling", icon: "🚴", provider: "Kiron", nextGame: "3 min", description: "Tour de France style races", hot: false },
];

const virtualOddsTemplate = [
  { team: "Team Red", odd: "2.40" },
  { team: "Draw", odd: "3.10" },
  { team: "Team Blue", odd: "2.90" },
];

export default function VirtualSportsPage() {
  const { addBet, hasBet, removeBet } = useBetslip();

  const handleOddClick = (sportId: string, sportName: string, team: string, odd: string) => {
    const betId = `${sportId}-${team}`;
    if (hasBet(betId)) {
      removeBet(betId);
    } else {
      addBet({
        id: betId,
        match: `${sportName} — Next Game`,
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
        <div className="bg-gradient-to-r from-[hsl(200_60%_14%)] via-[hsl(210_65%_10%)] to-[hsl(210_65%_10%)] border-b border-[hsl(210_40%_18%)] px-4 py-6">
          <div className="max-w-full mx-auto">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">🎮</span>
              <h1 className="text-3xl font-black text-white">Virtual Sports</h1>
              <span className="px-2 py-0.5 bg-[#ffba00] rounded text-sm font-bold text-[hsl(214_42%_9%)] flex items-center gap-1">
                <Zap className="w-3 h-3" /> 24/7
              </span>
            </div>
            <p className="text-base text-muted-foreground ml-12">Bet every few minutes — no waiting for real fixtures</p>
          </div>
        </div>

        <div className="max-w-full mx-auto px-3 sm:px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {virtualSports.map(sport => (
                  <div
                    key={sport.id}
                    className="bg-card border border-card-border rounded-lg overflow-hidden hover:border-[#ffba00] transition-all"
                    data-testid={`virtual-sport-${sport.id}`}
                  >
                    <div className="px-4 py-3 bg-[hsl(210_60%_12%)] flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{sport.icon}</span>
                        <div>
                          <p className="text-base font-bold text-white flex items-center gap-2">
                            {sport.name}
                            {sport.hot && (
                              <span className="text-[13px] px-1.5 py-0.5 bg-[hsl(15_100%_55%)] rounded font-bold text-white">HOT</span>
                            )}
                          </p>
                          <p className="text-sm text-muted-foreground">{sport.provider} · {sport.description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="px-4 py-3">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <Clock className="w-3 h-3" />
                        Next game in <span className="text-green-400 font-semibold ml-1">{sport.nextGame}</span>
                      </div>
                      <div className="flex gap-1.5">
                        {virtualOddsTemplate.map(o => {
                          const betId = `${sport.id}-${o.team}`;
                          const selected = hasBet(betId);
                          return (
                            <button
                              key={o.team}
                              onClick={() => handleOddClick(sport.id, sport.name, o.team, o.odd)}
                              className={`flex-1 py-2 rounded text-sm font-bold border transition-all ${
                                selected
                                  ? "bg-[#ffba00] border-[#ffba00] text-[hsl(214_42%_9%)]"
                                  : "bg-[hsl(214_36%_18%)] border-[hsl(214_28%_24%)] text-white hover:bg-[#ffba00] hover:border-[#ffba00] hover:text-[hsl(214_42%_9%)]"
                              }`}
                              data-testid={`virtual-odd-${sport.id}-${o.team.toLowerCase().replace(/\s/g, "-")}`}
                            >
                              <span className={`block text-[13px] font-normal mb-0.5 ${selected ? "text-[hsl(214_42%_20%)]" : "text-muted-foreground"}`}>{o.team}</span>
                              {o.odd}
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
