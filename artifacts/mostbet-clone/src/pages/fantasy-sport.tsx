import Header from "@/components/Header";
import Footer from "@/components/Footer";

const CONTESTS = [
  { id: 1, sport: "🏏", name: "IPL Mega Contest",          prize: "৳50,00,000", entry: "৳49",  teams: "2,45,821/5,00,000", type: "Mega",   spots: "5,00,000" },
  { id: 2, sport: "🏏", name: "IPL Head-to-Head",          prize: "৳90",        entry: "৳49",  teams: "1/2",               type: "H2H",    spots: "2" },
  { id: 3, sport: "🏏", name: "IPL Small League",          prize: "৳4,500",     entry: "৳49",  teams: "87/100",            type: "Small",  spots: "100" },
  { id: 4, sport: "⚽", name: "Premier League Big League", prize: "৳10,00,000", entry: "৳99",  teams: "38,214/1,00,000",   type: "Mega",   spots: "1,00,000" },
  { id: 5, sport: "⚽", name: "Champions League Qualifier",prize: "৳5,00,000",  entry: "৳199", teams: "14,820/50,000",     type: "Mega",   spots: "50,000" },
  { id: 6, sport: "🏀", name: "NBA Fantasy Draft",          prize: "৳2,50,000",  entry: "৳149", teams: "8,412/25,000",      type: "Mega",   spots: "25,000" },
];

const HOW_TO = [
  { step: 1, icon: "📅", title: "Pick a Match",    desc: "Choose from upcoming fixtures in cricket, football, basketball, and more" },
  { step: 2, icon: "⭐", title: "Build Your Team",  desc: "Select 11 players within the ৳100 credit budget. Pick captain for 2x points" },
  { step: 3, icon: "🏆", title: "Join a Contest",  desc: "Enter free or paid contests — from head-to-head to mega leagues" },
  { step: 4, icon: "💰", title: "Win Real Money",   desc: "Earn points based on real player performance and climb the leaderboard" },
];

export default function FantasySportPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(214 36% 12%)" }}>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div style={{ background: "linear-gradient(135deg, hsl(142 50% 10%) 0%, hsl(214 50% 14%) 100%)", borderBottom: "1px solid hsl(214 28% 18%)" }}>
          <div className="max-w-full mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🏆</span>
              <h1 className="text-3xl font-black text-white">Fantasy Sport</h1>
            </div>
            <p className="text-[hsl(214_15%_55%)] max-w-lg text-base">
              Build your dream team, compete with millions, and win real money based on live player performance
            </p>
            <div className="flex gap-6 mt-4 text-sm">
              {[
                { label: "Active Users", value: "8.5 Lakh" },
                { label: "Prize Pool Today", value: "৳2.4 Crore" },
                { label: "Sports Available", value: "6+" },
              ].map(s => (
                <div key={s.label}>
                  <p className="font-bold text-[#ffba00] text-lg">{s.value}</p>
                  <p className="text-[hsl(214_15%_45%)] text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-full mx-auto px-4 py-6 space-y-8">
          {/* Sport tabs */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {["🏏 Cricket", "⚽ Football", "🏀 Basketball", "🎾 Tennis", "🏒 Hockey", "⚾ Baseball"].map((s, i) => (
              <button key={s}
                className="shrink-0 px-4 py-2 rounded-sm text-sm font-bold transition-all"
                style={i === 0 ? { background: "#ffba00", color: "hsl(214 42% 9%)" } : { background: "hsl(214 30% 16%)", color: "hsl(214 8% 68%)" }}
              >{s}</button>
            ))}
          </div>

          {/* Upcoming contests */}
          <div>
            <h2 className="text-lg font-bold text-white mb-3">Upcoming Contests</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {CONTESTS.map(c => (
                <div key={c.id}
                  className="rounded-sm overflow-hidden hover:border-[#ffba00] transition-all cursor-pointer"
                  style={{ background: "hsl(214 32% 15%)", border: "1px solid hsl(214 28% 20%)" }}
                  data-testid={`contest-${c.id}`}
                >
                  <div className="px-3 py-2 flex items-center justify-between border-b" style={{ background: "hsl(214 38% 12%)", borderColor: "hsl(214 28% 16%)" }}>
                    <span className="text-sm font-bold text-white">{c.sport} {c.name}</span>
                    <span
                      className="text-[11px] font-black px-1.5 py-0.5 rounded"
                      style={{
                        background: c.type === "Mega" ? "#ffba00" : c.type === "H2H" ? "hsl(142 60% 38%)" : "hsl(200 60% 38%)",
                        color: c.type === "Mega" ? "hsl(214 42% 9%)" : "white"
                      }}
                    >{c.type}</span>
                  </div>
                  <div className="px-3 py-3 space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs text-[hsl(214_15%_45%)]">Prize Pool</p>
                        <p className="font-black text-[#ffba00] text-lg">{c.prize}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[hsl(214_15%_45%)]">Entry Fee</p>
                        <p className="font-bold text-white text-base">{c.entry}</p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs text-[hsl(214_15%_45%)] mb-1">
                        <span>{c.teams} teams</span>
                        <span>{c.spots} spots</span>
                      </div>
                      <div className="h-1.5 rounded-full" style={{ background: "hsl(214 32% 22%)" }}>
                        <div className="h-1.5 rounded-full" style={{
                          width: `${Math.min(100, (parseInt(c.teams.split("/")[0].replace(/,/g, "")) / parseInt(c.spots.replace(/,/g, ""))) * 100)}%`,
                          background: "#ffba00"
                        }} />
                      </div>
                    </div>
                    <button
                      className="w-full py-2 rounded-sm text-sm font-black"
                      style={{ background: "#ffba00", color: "hsl(214 42% 9%)" }}
                    >Join Contest</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* How it works */}
          <div>
            <h2 className="text-lg font-bold text-white mb-3">How It Works</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {HOW_TO.map(s => (
                <div key={s.step}
                  className="rounded-sm p-4 text-center"
                  style={{ background: "hsl(214 32% 15%)", border: "1px solid hsl(214 28% 20%)" }}
                >
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <p className="font-bold text-white text-sm mb-1">{s.title}</p>
                  <p className="text-[hsl(214_15%_45%)] text-xs">{s.desc}</p>
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
