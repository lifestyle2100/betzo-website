import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Link } from "wouter";
import { TrendingUp, Users, History, Zap } from "lucide-react";

const RECENT_CRASHES = [
  { x: 14.52, color: "text-green-400" },
  { x: 1.03, color: "text-red-400" },
  { x: 8.27, color: "text-green-400" },
  { x: 2.14, color: "text-yellow-400" },
  { x: 43.18, color: "text-green-400" },
  { x: 1.01, color: "text-red-400" },
  { x: 5.63, color: "text-green-400" },
  { x: 1.88, color: "text-yellow-400" },
  { x: 21.07, color: "text-green-400" },
  { x: 3.34, color: "text-green-400" },
  { x: 1.02, color: "text-red-400" },
  { x: 9.81, color: "text-green-400" },
];

const LIVE_BETS = [
  { user: "user***23", bet: "৳500", cashout: "৳3,250", mult: "6.50x" },
  { user: "ace***77", bet: "৳1,000", cashout: "৳2,100", mult: "2.10x" },
  { user: "pro***15", bet: "৳200", cashout: "৳1,840", mult: "9.20x" },
  { user: "win***42", bet: "৳2,000", cashout: "৳5,400", mult: "2.70x" },
  { user: "bet***88", bet: "৳500", cashout: null, mult: null },
  { user: "fly***33", bet: "৳1,500", cashout: "৳22,500", mult: "15.00x" },
  { user: "sky***61", bet: "৳300", cashout: null, mult: null },
];

export default function AviatorPage() {
  const [multiplier, setMultiplier] = useState(1.00);
  const [crashed, setCrashed] = useState(false);
  const [running, setRunning] = useState(false);
  const [stake, setStake] = useState("500");
  const [autoCashout, setAutoCashout] = useState("2.00");
  const [cashedOut, setCashedOut] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRound = () => {
    setCrashed(false);
    setCashedOut(false);
    setMultiplier(1.00);
    setRunning(true);
  };

  useEffect(() => {
    if (!running) return;
    const crashAt = 1 + Math.random() * 19; // crash between 1x and 20x
    intervalRef.current = setInterval(() => {
      setMultiplier(prev => {
        const next = prev + prev * 0.02;
        if (next >= crashAt) {
          clearInterval(intervalRef.current!);
          setCrashed(true);
          setRunning(false);
          return parseFloat(crashAt.toFixed(2));
        }
        return parseFloat(next.toFixed(2));
      });
    }, 100);
    return () => clearInterval(intervalRef.current!);
  }, [running]);

  const cashout = () => {
    if (!running || cashedOut) return;
    clearInterval(intervalRef.current!);
    setCashedOut(true);
    setRunning(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(214 36% 12%)" }}>
      <Header />
      <main className="flex-1 px-3 py-4 max-w-full mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="text-3xl">✈️</div>
          <div>
            <h1 className="text-2xl font-black text-white">Aviator</h1>
            <p className="text-[hsl(214_15%_50%)] text-sm">Crash game — Cash out before the plane flies away!</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="flex items-center gap-1 text-green-400 text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Live
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
          {/* Game area */}
          <div>
            {/* Recent crashes */}
            <div
              className="rounded-sm p-3 mb-4 flex flex-wrap gap-2"
              style={{ background: "hsl(214 38% 10%)", border: "1px solid hsl(214 28% 16%)" }}
            >
              <span className="text-[hsl(214_15%_45%)] text-sm mr-1">History:</span>
              {RECENT_CRASHES.map((c, i) => (
                <span key={i} className={`text-sm font-bold px-2 py-0.5 rounded ${c.color}`}
                  style={{ background: "hsl(214 32% 18%)" }}>
                  {c.x.toFixed(2)}x
                </span>
              ))}
            </div>

            {/* Main multiplier display */}
            <div
              className="rounded-sm flex flex-col items-center justify-center mb-4 relative overflow-hidden"
              style={{
                background: "radial-gradient(ellipse at 50% 120%, hsl(214 50% 18%) 0%, hsl(214 42% 8%) 70%)",
                border: "1px solid hsl(214 28% 20%)",
                minHeight: 320,
              }}
            >
              {/* Stars / dots background */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: "radial-gradient(1px 1px at 20% 30%, white, transparent), radial-gradient(1px 1px at 80% 20%, white, transparent), radial-gradient(1px 1px at 50% 60%, white, transparent), radial-gradient(1px 1px at 30% 80%, white, transparent), radial-gradient(1px 1px at 70% 70%, white, transparent)",
              }} />

              {/* Plane emoji */}
              <div className={`text-6xl mb-4 transition-all ${running ? "animate-bounce" : ""} ${crashed ? "grayscale" : ""}`}>
                {crashed ? "💥" : "✈️"}
              </div>

              <div
                className={`text-7xl font-black tabular-nums ${
                  crashed ? "text-red-400" :
                  cashedOut ? "text-green-400" :
                  multiplier > 5 ? "text-green-400" :
                  multiplier > 2 ? "text-yellow-400" : "text-white"
                }`}
                style={{ textShadow: "0 0 30px currentColor" }}
                data-testid="aviator-multiplier"
              >
                {multiplier.toFixed(2)}x
              </div>

              {crashed && (
                <div className="mt-2 text-red-400 text-xl font-bold animate-pulse">FLEW AWAY!</div>
              )}
              {cashedOut && !crashed && (
                <div className="mt-2 text-green-400 text-lg font-bold">
                  Cashed out! +৳{(parseFloat(stake) * multiplier).toFixed(0)}
                </div>
              )}

              {!running && !crashed && !cashedOut && (
                <div className="mt-2 text-[hsl(214_15%_50%)] text-sm">Waiting for next round...</div>
              )}
            </div>

            {/* Bet controls */}
            <div
              className="rounded-sm p-4"
              style={{ background: "hsl(214 38% 10%)", border: "1px solid hsl(214 28% 16%)" }}
            >
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="text-[hsl(214_15%_50%)] text-sm mb-1 block">Bet Amount (৳)</label>
                  <input
                    type="number"
                    value={stake}
                    onChange={e => setStake(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm text-white font-bold"
                    style={{ background: "hsl(214 32% 16%)", border: "1px solid hsl(214 28% 22%)" }}
                    disabled={running}
                  />
                  <div className="flex gap-1 mt-1">
                    {["100", "500", "1000", "5000"].map(v => (
                      <button key={v} onClick={() => setStake(v)}
                        className="flex-1 py-1 text-xs rounded font-semibold transition-colors"
                        style={{ background: "hsl(214 30% 20%)", color: "hsl(214 8% 68%)" }}
                        disabled={running}>৳{v}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[hsl(214_15%_50%)] text-sm mb-1 block">Auto Cash-out at</label>
                  <input
                    type="number"
                    step="0.1"
                    value={autoCashout}
                    onChange={e => setAutoCashout(e.target.value)}
                    className="w-full px-3 py-2 rounded-sm text-white font-bold"
                    style={{ background: "hsl(214 32% 16%)", border: "1px solid hsl(214 28% 22%)" }}
                    disabled={running}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                {!running ? (
                  <button
                    onClick={startRound}
                    className="flex-1 py-3 rounded-sm font-black text-[hsl(214_42%_9%)] text-lg transition-all hover:brightness-110"
                    style={{ background: "#ffba00" }}
                    data-testid="button-aviator-bet"
                  >
                    {crashed || cashedOut ? "BET AGAIN" : "PLACE BET — ৳" + stake}
                  </button>
                ) : (
                  <button
                    onClick={cashout}
                    className="flex-1 py-3 rounded-sm font-black text-white text-lg transition-all animate-pulse"
                    style={{ background: "hsl(142 60% 38%)", border: "2px solid hsl(142 60% 50%)" }}
                    data-testid="button-aviator-cashout"
                  >
                    CASH OUT — ৳{(parseFloat(stake) * multiplier).toFixed(0)}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right panel */}
          <div className="space-y-4">
            {/* Live bets */}
            <div
              className="rounded-sm overflow-hidden"
              style={{ background: "hsl(214 38% 10%)", border: "1px solid hsl(214 28% 16%)" }}
            >
              <div className="px-3 py-2 flex items-center gap-2 border-b" style={{ background: "hsl(214 42% 8%)", borderColor: "hsl(214 28% 14%)" }}>
                <Users className="w-3.5 h-3.5 text-[#ffba00]" />
                <h3 className="text-[13px] font-bold text-white uppercase tracking-widest">Live Bets</h3>
              </div>
              <div>
                {LIVE_BETS.map((bet, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 border-b"
                    style={{ borderColor: "hsl(214 28% 14%)" }}>
                    <div>
                      <p className="text-sm text-white font-semibold">{bet.user}</p>
                      <p className="text-xs text-[hsl(214_15%_45%)]">{bet.bet}</p>
                    </div>
                    {bet.cashout ? (
                      <div className="text-right">
                        <p className="text-sm font-bold text-green-400">{bet.cashout}</p>
                        <p className="text-xs text-[#ffba00]">{bet.mult}</p>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-red-400 animate-pulse">Flying...</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Top wins */}
            <div
              className="rounded-sm overflow-hidden"
              style={{ background: "hsl(214 38% 10%)", border: "1px solid hsl(214 28% 16%)" }}
            >
              <div className="px-3 py-2 flex items-center gap-2 border-b" style={{ background: "hsl(214 42% 8%)", borderColor: "hsl(214 28% 14%)" }}>
                <TrendingUp className="w-3.5 h-3.5 text-green-400" />
                <h3 className="text-[13px] font-bold text-white uppercase tracking-widest">Top Multipliers</h3>
              </div>
              <div>
                {[
                  { user: "fly***99", mult: "158.32x", win: "৳7,91,600" },
                  { user: "ace***12", mult: "87.44x", win: "৳4,37,200" },
                  { user: "pro***07", mult: "43.18x", win: "৳2,15,900" },
                  { user: "win***55", mult: "21.07x", win: "৳1,05,350" },
                  { user: "sky***88", mult: "15.00x", win: "৳75,000" },
                ].map((w, i) => (
                  <div key={i} className="flex items-center justify-between px-3 py-2 border-b"
                    style={{ borderColor: "hsl(214 28% 14%)" }}>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold w-4 ${i === 0 ? "text-yellow-400" : i === 1 ? "text-gray-300" : "text-amber-600"}`}>{i + 1}</span>
                      <span className="text-sm text-[hsl(214_15%_55%)]">{w.user}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-400">{w.win}</p>
                      <p className="text-xs text-[#ffba00]">{w.mult}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
