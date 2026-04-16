import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BetslipPanel from "@/components/BetslipPanel";
import CasinoGameCard, { type CasinoGame } from "@/components/CasinoGameCard";
import GameLaunchModal from "@/components/GameLaunchModal";
import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";

const categories = ["All", "Roulette", "Blackjack", "Baccarat", "Game Shows", "Poker"];

const subCategoryMap: Record<string, string> = {
  "Roulette": "roulette",
  "Blackjack": "blackjack",
  "Baccarat": "baccarat",
  "Game Shows": "game-shows",
  "Poker": "poker",
};

const API_BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const CASINO_API = `${API_BASE}/api/casino/games`;

export default function LiveCasinoPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [games, setGames] = useState<CasinoGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [activeGame, setActiveGame] = useState<CasinoGame | null>(null);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ category: "live", limit: "40" });
      const res = await fetch(`${CASINO_API}?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const all: CasinoGame[] = data.games ?? [];
      setGames(all);
      setTotalPlayers(all.reduce((s, g) => s + (g.players ?? 0), 0));
    } catch {
      setError("Unable to load live games. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchGames(); }, [fetchGames]);

  const filtered = activeCategory === "All"
    ? games
    : games.filter(g => {
        const sub = subCategoryMap[activeCategory] ?? activeCategory.toLowerCase();
        return g.subCategory === sub || g.category === sub;
      });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-[hsl(270_60%_15%)] via-[hsl(210_65%_10%)] to-[hsl(210_65%_10%)] border-b border-[hsl(210_40%_18%)] px-4 py-6">
          <div className="max-w-full mx-auto">
            <div className="flex items-center gap-3 mb-1">
              <span className="text-3xl">🎰</span>
              <h1 className="text-3xl font-black text-white">Live Casino</h1>
              <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500 rounded text-sm font-bold text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse inline-block" />
                LIVE
              </span>
            </div>
            <p className="text-base text-muted-foreground ml-12">
              Real dealers, real tables — stream in HD 24/7
              {totalPlayers > 0 && (
                <span className="ml-2 text-green-400 font-medium">
                  · {totalPlayers.toLocaleString()} players online
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="max-w-full mx-auto px-3 sm:px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`shrink-0 px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                        activeCategory === cat
                          ? "bg-[#ffba00] text-[hsl(214_42%_9%)]"
                          : "bg-[hsl(214_36%_18%)] text-muted-foreground hover:text-white"
                      }`}
                      data-testid={`live-casino-cat-${cat.toLowerCase().replace(/\s/g, "-")}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                <button
                  onClick={fetchGames}
                  className="shrink-0 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors ml-2"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>

              {error && (
                <div className="text-center py-8 text-red-400">
                  <p>{error}</p>
                  <button onClick={fetchGames} className="mt-3 px-4 py-2 bg-[#ffba00] text-[hsl(214_42%_9%)] font-bold rounded text-base">
                    Try Again
                  </button>
                </div>
              )}

              {loading && !error && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-44 bg-card border border-card-border rounded-lg animate-pulse" />
                  ))}
                </div>
              )}

              {!loading && !error && (
                <>
                  <p className="text-sm text-muted-foreground mb-3">
                    {filtered.length} tables available
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                    {filtered.map(game => (
                      <CasinoGameCard key={game.id} {...game} onPlay={setActiveGame} />
                    ))}
                  </div>
                </>
              )}

              {!loading && !error && filtered.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <div className="text-4xl mb-2">📹</div>
                  <p className="font-semibold text-white">No tables in this category</p>
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
      {activeGame && <GameLaunchModal game={activeGame} onClose={() => setActiveGame(null)} />}
    </div>
  );
}
