import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CasinoGameCard, { type CasinoGame } from "@/components/CasinoGameCard";
import GameLaunchModal from "@/components/GameLaunchModal";
import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useCallback } from "react";

const categories = [
  { id: "all", label: "All Games", icon: "🎮" },
  { id: "slots", label: "Slots", icon: "🎰" },
  { id: "live", label: "Live Casino", icon: "📹" },
  { id: "roulette", label: "Roulette", icon: "🎡" },
  { id: "blackjack", label: "Blackjack", icon: "🃏" },
  { id: "baccarat", label: "Baccarat", icon: "🎴" },
  { id: "poker", label: "Poker", icon: "♠️" },
  { id: "crash", label: "Crash Games", icon: "📈" },
  { id: "jackpot", label: "Jackpots", icon: "💎" },
];

const API_BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
const CASINO_API = `${API_BASE}/api/casino/games`;

export default function CasinoPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [provider, setProvider] = useState("All Providers");
  const [games, setGames] = useState<CasinoGame[]>([]);
  const [providers, setProviders] = useState<string[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeGame, setActiveGame] = useState<CasinoGame | null>(null);

  const fetchGames = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ limit: "80" });
      if (category !== "all") params.set("category", category);
      if (provider !== "All Providers") params.set("provider", provider);
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`${CASINO_API}?${params}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setGames(data.games ?? []);
      setTotal(data.meta?.total ?? 0);
      if (data.meta?.providers) {
        setProviders(["All Providers", ...data.meta.providers]);
      }
    } catch (e) {
      setError("Unable to load games. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [category, provider, search]);

  useEffect(() => {
    const t = setTimeout(fetchGames, search ? 350 : 0);
    return () => clearTimeout(t);
  }, [fetchGames, search]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-[hsl(270_60%_25%)] via-[hsl(270_50%_18%)] to-[hsl(210_70%_11%)] border-b border-[hsl(210_40%_18%)] px-4 py-8">
          <div className="max-w-full mx-auto text-center">
            <h1 className="text-3xl font-black text-white mb-2">🎰 Casino</h1>
            <p className="text-muted-foreground mb-4">
              {loading ? "Loading games…" : `${total}+ slots, live casino, and table games`}
            </p>
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search games, providers…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-[hsl(210_60%_14%)] border-[hsl(210_40%_22%)]"
                data-testid="input-search-casino"
              />
            </div>
          </div>
        </div>

        <div className="max-w-full mx-auto px-3 sm:px-4 py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  category === cat.id
                    ? "bg-[hsl(210_100%_56%)] text-white"
                    : "bg-card border border-card-border text-muted-foreground hover:text-white hover:border-[hsl(210_100%_56%)]"
                }`}
                data-testid={`casino-category-${cat.id}`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
            {providers.map((p) => (
              <button
                key={p}
                onClick={() => setProvider(p)}
                className={`shrink-0 px-2.5 py-1 rounded text-sm font-medium transition-colors ${
                  provider === p
                    ? "bg-[hsl(270_60%_45%)] text-white"
                    : "bg-[hsl(210_50%_18%)] text-muted-foreground hover:text-white"
                }`}
                data-testid={`casino-provider-${p.toLowerCase().replace(/[\s']/g, "-")}`}
              >
                {p}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between mb-3">
            <span className="text-base text-muted-foreground">
              {loading ? "Loading…" : `${games.length} games available`}
            </span>
            <button
              onClick={fetchGames}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-white transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>

          {error && (
            <div className="text-center py-8 text-red-400">
              <p>{error}</p>
              <button onClick={fetchGames} className="mt-3 px-4 py-2 bg-[hsl(210_100%_56%)] text-white rounded text-base">
                Try Again
              </button>
            </div>
          )}

          {loading && !error && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} className="h-44 bg-card border border-card-border rounded-lg animate-pulse" />
              ))}
            </div>
          )}

          {!loading && !error && games.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-2.5">
              {games.map((game) => (
                <CasinoGameCard key={game.id} {...game} onPlay={setActiveGame} />
              ))}
            </div>
          )}

          {!loading && !error && games.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <div className="text-4xl mb-3">🎰</div>
              <p className="font-semibold text-white">No games found</p>
              <p className="text-base mt-1">Try a different search or filter</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      {activeGame && <GameLaunchModal game={activeGame} onClose={() => setActiveGame(null)} />}
    </div>
  );
}
