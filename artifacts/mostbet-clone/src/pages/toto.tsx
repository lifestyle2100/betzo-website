import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TOTO_MATCHES = [
  { id: 1, home: "Manchester City",  away: "Arsenal",          league: "Premier League", time: "Today 18:00" },
  { id: 2, home: "Liverpool",        away: "Chelsea",          league: "Premier League", time: "Today 20:45" },
  { id: 3, home: "Real Madrid",      away: "Barcelona",        league: "La Liga",        time: "Today 21:00" },
  { id: 4, home: "Bayern Munich",    away: "Dortmund",         league: "Bundesliga",     time: "Sat 18:30" },
  { id: 5, home: "Juventus",         away: "Inter Milan",      league: "Serie A",        time: "Sat 20:45" },
  { id: 6, home: "PSG",              away: "Marseille",        league: "Ligue 1",        time: "Sun 21:00" },
  { id: 7, home: "India",            away: "Pakistan",         league: "T20 World Cup",  time: "Sun 14:00" },
  { id: 8, home: "LA Lakers",        away: "Boston Celtics",   league: "NBA",            time: "Mon 04:00" },
  { id: 9, home: "Djokovic",         away: "Alcaraz",          league: "ATP Roland Garros",time:"Mon 15:00"},
  { id: 10, home:"Denmark",          away: "Spain",            league: "UEFA EURO",      time: "Tue 21:00" },
  { id: 11, home:"Houston Astros",   away: "NY Yankees",       league: "MLB",            time: "Wed 03:00" },
  { id: 12, home:"FaZe Clan",        away: "Team Liquid",      league: "CS2 Major",      time: "Wed 16:00" },
];

const JACKPOTS = [
  { name: "Super Jackpot 12/12",  prize: "৳50,00,000", participants: 18423,  minBet: "৳100" },
  { name: "Express 8/8",         prize: "৳5,00,000",  participants: 45821,  minBet: "৳50" },
  { name: "Mini Toto 6/6",       prize: "৳50,000",    participants: 12004,  minBet: "৳20" },
];

export default function TotoPage() {
  const [picks, setPicks] = useState<Record<number, "1" | "X" | "2">>({});
  const [stakeInput, setStakeInput] = useState("100");

  const setPick = (id: number, pick: "1" | "X" | "2") => {
    setPicks(prev => ({ ...prev, [id]: prev[id] === pick ? undefined! : pick }));
  };

  const filled = Object.keys(picks).length;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(214 36% 12%)" }}>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="border-b" style={{ background: "linear-gradient(135deg, hsl(214 50% 10%) 0%, hsl(200 50% 14%) 100%)", borderColor: "hsl(214 28% 18%)" }}>
          <div className="max-w-full mx-auto px-4 py-6">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">🎯</span>
              <h1 className="text-3xl font-black text-white">Toto</h1>
            </div>
            <p className="text-[hsl(214_15%_55%)]">Predict match results and win from the jackpot pool</p>

            {/* Jackpot cards */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-1">
              {JACKPOTS.map(j => (
                <div key={j.name}
                  className="shrink-0 rounded-sm px-4 py-3 text-center"
                  style={{ background: "hsl(214 40% 18%)", border: "1px solid hsl(214 28% 24%)", minWidth: 180 }}
                >
                  <p className="text-sm text-[hsl(214_15%_50%)]">{j.name}</p>
                  <p className="text-xl font-black text-[#ffba00]">{j.prize}</p>
                  <p className="text-xs text-[hsl(214_15%_45%)]">{j.participants.toLocaleString()} participants</p>
                  <p className="text-xs text-green-400 mt-0.5">Min bet: {j.minBet}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-full mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
          {/* Match selection */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white">Pick Your Outcomes</h2>
              <span className="text-sm text-[hsl(214_15%_50%)]">{filled}/12 selected</span>
            </div>

            <div className="space-y-2">
              {TOTO_MATCHES.map((m) => (
                <div key={m.id}
                  className="rounded-sm px-4 py-3 flex items-center gap-3"
                  style={{ background: "hsl(214 32% 15%)", border: "1px solid hsl(214 28% 20%)" }}
                >
                  <div className="text-[hsl(214_15%_38%)] text-sm font-bold w-5 text-center">{m.id}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] text-[hsl(214_15%_45%)]">{m.league} · {m.time}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[14px] font-semibold text-white truncate">{m.home}</span>
                      <span className="text-[hsl(214_15%_40%)] text-xs">vs</span>
                      <span className="text-[14px] font-semibold text-white truncate">{m.away}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    {(["1", "X", "2"] as const).map(pick => (
                      <button
                        key={pick}
                        onClick={() => setPick(m.id, pick)}
                        className="w-9 h-9 rounded-sm text-sm font-bold transition-all"
                        style={picks[m.id] === pick
                          ? { background: "#ffba00", color: "hsl(214 42% 9%)" }
                          : { background: "hsl(214 30% 20%)", color: "hsl(214 8% 68%)", border: "1px solid hsl(214 28% 26%)" }
                        }
                      >{pick}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bet slip */}
          <div>
            <div className="rounded-sm sticky top-[109px]" style={{ background: "hsl(214 38% 10%)", border: "1px solid hsl(214 28% 16%)" }}>
              <div className="px-4 py-3 border-b" style={{ background: "hsl(214 42% 8%)", borderColor: "hsl(214 28% 14%)" }}>
                <h3 className="text-[14px] font-bold text-white">Toto Coupon</h3>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[hsl(214_15%_50%)]">Selections</span>
                    <span className={`font-bold ${filled === 12 ? "text-green-400" : "text-[#ffba00]"}`}>{filled}/12</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "hsl(214 32% 20%)" }}>
                    <div className="h-2 rounded-full transition-all" style={{ width: `${(filled / 12) * 100}%`, background: filled === 12 ? "#22c55e" : "#ffba00" }} />
                  </div>
                </div>

                <div>
                  <label className="text-[hsl(214_15%_50%)] text-sm mb-1 block">Stake (৳)</label>
                  <input
                    type="number"
                    value={stakeInput}
                    onChange={e => setStakeInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm text-white font-bold"
                    style={{ background: "hsl(214 32% 16%)", border: "1px solid hsl(214 28% 22%)" }}
                  />
                  <div className="flex gap-1 mt-1">
                    {["50", "100", "500", "1000"].map(v => (
                      <button key={v} onClick={() => setStakeInput(v)}
                        className="flex-1 py-1 text-xs rounded font-semibold"
                        style={{ background: "hsl(214 30% 20%)", color: "hsl(214 8% 68%)" }}
                      >৳{v}</button>
                    ))}
                  </div>
                </div>

                <div className="rounded-sm p-3 space-y-2" style={{ background: "hsl(214 36% 13%)" }}>
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(214_15%_50%)]">Jackpot Pool</span>
                    <span className="font-bold text-[#ffba00]">৳50,00,000</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[hsl(214_15%_50%)]">Your Stake</span>
                    <span className="font-bold text-white">৳{stakeInput || "0"}</span>
                  </div>
                </div>

                <button
                  disabled={filled < 12}
                  className="w-full py-3 rounded-sm font-black text-lg transition-all"
                  style={filled === 12
                    ? { background: "#ffba00", color: "hsl(214 42% 9%)" }
                    : { background: "hsl(214 30% 20%)", color: "hsl(214 15% 40%)", cursor: "not-allowed" }
                  }
                  data-testid="button-toto-submit"
                >
                  {filled < 12 ? `Pick ${12 - filled} more` : "Submit Coupon"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
