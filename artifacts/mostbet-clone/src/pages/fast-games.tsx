import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { Zap } from "lucide-react";

const FAST_GAMES = [
  { id: "aviator",    name: "Aviator",      provider: "Spribe",          icon: "✈️",  desc: "Crash game — cash out before the plane flies away!",  tag: "HOT",  rtp: "97.00%" },
  { id: "crash",      name: "Crash",        provider: "BC Originals",    icon: "📈",  desc: "Watch the multiplier grow and cash out at the right time", tag: "NEW", rtp: "96.00%" },
  { id: "mines",      name: "Mines",        provider: "Spribe",          icon: "💣",  desc: "Reveal gems, avoid mines — the further you go the bigger the win!", tag: "HOT", rtp: "96.00%" },
  { id: "plinko",     name: "Plinko",       provider: "Spribe",          icon: "🎯",  desc: "Drop the ball and watch it bounce to big multipliers", tag: null,   rtp: "97.00%" },
  { id: "hilo",       name: "Hi-Lo",        provider: "Spribe",          icon: "🃏",  desc: "Predict if the next card is higher or lower",          tag: null,   rtp: "96.50%" },
  { id: "dice",       name: "Dice",         provider: "Spribe",          icon: "🎲",  desc: "Set your win chance and roll the dice your way",       tag: null,   rtp: "99.00%" },
  { id: "wheel",      name: "Wheel",        provider: "Spribe",          icon: "🎡",  desc: "Spin the wheel — set risk and hit big multipliers",    tag: null,   rtp: "97.00%" },
  { id: "goal",       name: "Goal",         provider: "Spribe",          icon: "⚽",  desc: "Kick the ball past the goalkeeper to multiply your bet", tag: null, rtp: "96.80%" },
  { id: "keno",       name: "Keno",         provider: "Turbo Games",     icon: "🔢",  desc: "Pick your lucky numbers and see how many match",       tag: null,   rtp: "96.00%" },
  { id: "balloon",    name: "Balloon",      provider: "Turbo Games",     icon: "🎈",  desc: "Inflate the balloon for higher multipliers — don't let it pop!", tag: "NEW", rtp: "97.00%" },
  { id: "coinflip",   name: "Coin Flip",    provider: "BC Originals",    icon: "🪙",  desc: "50/50 — heads or tails with a 2x multiplier",          tag: null,   rtp: "99.00%" },
  { id: "miniroulette",name:"Mini Roulette",provider: "Spribe",          icon: "🔴",  desc: "Roulette with a 36x jackpot on a single number",       tag: null,   rtp: "96.67%" },
];

export default function FastGamesPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(214 36% 12%)" }}>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <div className="border-b" style={{ background: "linear-gradient(135deg, hsl(214 50% 12%) 0%, hsl(260 50% 16%) 100%)", borderColor: "hsl(214 28% 18%)" }}>
          <div className="max-w-full mx-auto px-4 py-8 text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Zap className="w-8 h-8 text-[#ffba00]" />
              <h1 className="text-3xl font-black text-white">Fast Games</h1>
            </div>
            <p className="text-[hsl(214_15%_55%)] text-base max-w-lg mx-auto">
              Instant-result games — bet, win, repeat in seconds
            </p>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <span className="text-[hsl(214_15%_45%)]">🕐 Results in seconds</span>
              <span className="text-[hsl(214_15%_45%)]">⚡ Instant payouts</span>
              <span className="text-[hsl(214_15%_45%)]">💰 Up to 1000x multiplier</span>
            </div>
          </div>
        </div>

        <div className="max-w-full mx-auto px-4 py-6">
          {/* Game grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
            {FAST_GAMES.map((game) => (
              <Link key={game.id} href={game.id === "aviator" ? "/aviator" : "#"}>
                <div
                  className="rounded-sm overflow-hidden cursor-pointer group transition-all hover:scale-[1.03] hover:border-[#ffba00]"
                  style={{ background: "hsl(214 32% 15%)", border: "1px solid hsl(214 28% 20%)" }}
                  data-testid={`fast-game-${game.id}`}
                >
                  {/* Game visual */}
                  <div
                    className="h-32 flex flex-col items-center justify-center relative"
                    style={{ background: "linear-gradient(135deg, hsl(214 40% 18%) 0%, hsl(260 40% 22%) 100%)" }}
                  >
                    {game.tag && (
                      <span
                        className="absolute top-2 left-2 text-[11px] font-black px-1.5 py-0.5 rounded"
                        style={{ background: game.tag === "HOT" ? "#ff4444" : "#ffba00", color: game.tag === "HOT" ? "white" : "hsl(214 42% 9%)" }}
                      >
                        {game.tag}
                      </span>
                    )}
                    <span className="text-4xl mb-1">{game.icon}</span>
                    <span className="text-[11px] text-[hsl(214_15%_55%)]">RTP {game.rtp}</span>
                  </div>

                  <div className="p-2.5">
                    <h3 className="text-[14px] font-bold text-white group-hover:text-[#ffba00] transition-colors">{game.name}</h3>
                    <p className="text-[12px] text-[hsl(214_15%_45%)]">{game.provider}</p>
                    <button
                      className="w-full mt-2 py-1.5 rounded-sm text-[13px] font-bold text-[hsl(214_42%_9%)] transition-all hover:brightness-110"
                      style={{ background: "#ffba00" }}
                    >
                      Play Now
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
