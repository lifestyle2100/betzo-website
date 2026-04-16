import Header from "@/components/Header";
import Footer from "@/components/Footer";

const POKER_GAMES = [
  { id: "texas-holdem",   name: "Texas Hold'em",      icon: "♠️", players: "2-9", blinds: "৳10/৳20",  status: "live",   seats: 3, maxSeats: 9 },
  { id: "omaha",          name: "Omaha Hi",            icon: "♣️", players: "2-9", blinds: "৳25/৳50",  status: "live",   seats: 6, maxSeats: 9 },
  { id: "omaha-hi-lo",    name: "Omaha Hi-Lo",         icon: "♦️", players: "2-9", blinds: "৳50/৳100", status: "live",   seats: 2, maxSeats: 9 },
  { id: "7-stud",         name: "7 Card Stud",         icon: "♥️", players: "2-8", blinds: "৳10/৳20",  status: "wait",   seats: 0, maxSeats: 8 },
  { id: "short-deck",     name: "Short Deck Poker",    icon: "🃏", players: "2-9", blinds: "৳100/৳200",status: "live",   seats: 5, maxSeats: 9 },
  { id: "speed-poker",    name: "Speed Poker",         icon: "⚡", players: "2-9", blinds: "৳5/৳10",   status: "live",   seats: 8, maxSeats: 9 },
];

const TOURNAMENTS = [
  { name: "Sunday Special",        buyIn: "৳2,200", prize: "৳1,50,000", players: "342/500", starts: "Today 20:00" },
  { name: "Daily Freeroll",        buyIn: "FREE",   prize: "৳10,000",   players: "1,204/2,000", starts: "Today 18:00" },
  { name: "High Roller Thursday",  buyIn: "৳11,000",prize: "৳5,00,000", players: "88/200",  starts: "Thu 21:00" },
  { name: "Micro Monday",          buyIn: "৳220",   prize: "৳15,000",   players: "512/1,000",starts: "Mon 19:00" },
  { name: "Mini Series #3",        buyIn: "৳1,100", prize: "৳75,000",   players: "201/400", starts: "Sat 17:00" },
];

export default function PokerPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(214 36% 12%)" }}>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="border-b" style={{
          background: "linear-gradient(135deg, hsl(214 50% 10%) 0%, hsl(340 50% 14%) 100%)",
          borderColor: "hsl(214 28% 18%)"
        }}>
          <div className="max-w-full mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🃏</span>
              <h1 className="text-3xl font-black text-white">Poker</h1>
              <span className="px-2 py-0.5 text-xs font-bold rounded bg-red-500 text-white animate-pulse">LIVE</span>
            </div>
            <p className="text-[hsl(214_15%_55%)] max-w-lg">
              Real-money poker tables — cash games and tournaments available 24/7
            </p>
            <div className="flex gap-6 mt-4 text-sm">
              {[
                { label: "Active Players", value: "3,847" },
                { label: "Tables Running", value: "124" },
                { label: "Tournament Prize", value: "৳15 Lakh" },
              ].map(s => (
                <div key={s.label}>
                  <p className="font-bold text-white text-lg">{s.value}</p>
                  <p className="text-[hsl(214_15%_45%)]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-full mx-auto px-4 py-6 space-y-6">
          {/* Tabs */}
          <div className="flex gap-2">
            {["Cash Games", "Tournaments", "Sit & Go"].map((t, i) => (
              <button key={t}
                className="px-4 py-2 rounded-sm text-[14px] font-bold transition-all"
                style={i === 0 ? { background: "#ffba00", color: "hsl(214 42% 9%)" } : { background: "hsl(214 30% 16%)", color: "hsl(214 8% 68%)" }}
              >{t}</button>
            ))}
          </div>

          {/* Cash Games */}
          <div>
            <h2 className="text-lg font-bold text-white mb-3">Cash Games</h2>
            <div className="rounded-sm overflow-hidden" style={{ border: "1px solid hsl(214 28% 18%)" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: "hsl(214 40% 11%)" }}>
                    {["Game", "Stakes", "Players", "Seats", ""].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-[hsl(214_15%_45%)] font-semibold">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {POKER_GAMES.map((g) => (
                    <tr key={g.id} className="border-t hover:bg-[hsl(214_32%_17%)] transition-colors cursor-pointer" style={{ borderColor: "hsl(214 28% 16%)" }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{g.icon}</span>
                          <span className="font-semibold text-white">{g.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[hsl(214_8%_72%)]">{g.blinds}</td>
                      <td className="px-4 py-3 text-[hsl(214_8%_72%)]">{g.players}</td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${g.status === "live" ? "text-green-400" : "text-yellow-400"}`}>
                          {g.seats}/{g.maxSeats}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          className="px-3 py-1.5 rounded-sm text-[13px] font-bold"
                          style={g.status === "live" ? { background: "#ffba00", color: "hsl(214 42% 9%)" } : { background: "hsl(214 30% 22%)", color: "hsl(214 8% 60%)" }}
                        >
                          {g.status === "live" ? "Join Table" : "Wait List"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tournaments */}
          <div>
            <h2 className="text-lg font-bold text-white mb-3">Upcoming Tournaments</h2>
            <div className="space-y-2">
              {TOURNAMENTS.map((t) => (
                <div key={t.name}
                  className="rounded-sm px-4 py-3 flex items-center justify-between hover:border-[#ffba00] transition-all cursor-pointer"
                  style={{ background: "hsl(214 32% 15%)", border: "1px solid hsl(214 28% 20%)" }}
                >
                  <div>
                    <p className="font-bold text-white">{t.name}</p>
                    <p className="text-sm text-[hsl(214_15%_45%)]">{t.starts} · {t.players} registered</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-bold text-[#ffba00]">Prize: {t.prize}</p>
                    <p className="text-sm text-[hsl(214_15%_45%)]">Buy-in: {t.buyIn}</p>
                  </div>
                  <button
                    className="px-4 py-2 rounded-sm font-bold text-[14px]"
                    style={{ background: "#ffba00", color: "hsl(214 42% 9%)" }}
                  >Register</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
