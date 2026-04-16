import { X, ExternalLink, Users, Shield, Zap, Trophy, Play } from "lucide-react";
import { useState, useEffect } from "react";
import type { CasinoGame } from "./CasinoGameCard";

interface GameLaunchModalProps {
  game: CasinoGame;
  onClose: () => void;
}

const categoryIcons: Record<string, string> = {
  slots: "🎰",
  roulette: "🎡",
  blackjack: "🃏",
  baccarat: "🎴",
  poker: "♠️",
  live: "📹",
  crash: "📈",
  jackpot: "💎",
  table: "🎲",
};

export default function GameLaunchModal({ game, onClose }: GameLaunchModalProps) {
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [liveCount, setLiveCount] = useState(game.players ?? 0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    if (!game.isLive) return;
    const interval = setInterval(() => {
      setLiveCount(prev => {
        const delta = Math.floor(Math.random() * 7) - 3;
        return Math.max(1, prev + delta);
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [game.isLive]);

  const isLiveGame = game.isLive || game.category === "live";
  const hasDemo = !!game.demoUrl;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      data-testid="game-launch-modal"
    >
      <div className="relative w-full max-w-5xl mx-4 max-h-[92vh] flex flex-col bg-[hsl(210_70%_9%)] border border-[hsl(210_40%_20%)] rounded-2xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[hsl(210_40%_18%)] shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{categoryIcons[game.category] || "🎮"}</span>
            <div>
              <h2 className="text-xl font-black text-white leading-tight">{game.name}</h2>
              <p className="text-sm text-muted-foreground">{game.provider}</p>
            </div>
            <div className="flex gap-1.5 ml-2">
              {game.isHot && <span className="px-1.5 py-0.5 text-[13px] font-bold rounded bg-[hsl(15_100%_55%)] text-white">HOT</span>}
              {game.isNew && <span className="px-1.5 py-0.5 text-[13px] font-bold rounded bg-green-500 text-white">NEW</span>}
              {isLiveGame && (
                <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[13px] font-bold rounded bg-red-600 text-white">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  LIVE
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[hsl(210_50%_18%)] hover:bg-[hsl(210_50%_25%)] flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
            data-testid="close-game-modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-col lg:flex-row flex-1 overflow-hidden min-h-0">
          {/* Left panel — always visible */}
          <div className="w-full lg:w-72 shrink-0 p-5 border-b lg:border-b-0 lg:border-r border-[hsl(210_40%_18%)] flex flex-col gap-4 overflow-y-auto">
            {/* Thumbnail */}
            <div className="rounded-xl overflow-hidden aspect-video bg-[hsl(210_60%_14%)]">
              {game.thumbnail ? (
                <img src={game.thumbnail} alt={game.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-5xl">
                  {categoryIcons[game.category] || "🎮"}
                </div>
              )}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-2">
              {game.rtp && (
                <div className="bg-[hsl(210_60%_14%)] rounded-lg p-2.5 text-center">
                  <p className="text-[13px] text-muted-foreground uppercase tracking-wide">RTP</p>
                  <p className="text-lg font-black text-green-400">{game.rtp}</p>
                </div>
              )}
              {isLiveGame && (
                <div className="bg-[hsl(210_60%_14%)] rounded-lg p-2.5 text-center">
                  <p className="text-[13px] text-muted-foreground uppercase tracking-wide">Playing</p>
                  <p className="text-lg font-black text-[hsl(210_100%_56%)]">{liveCount.toLocaleString()}</p>
                </div>
              )}
              {game.minBet && (
                <div className="bg-[hsl(210_60%_14%)] rounded-lg p-2.5 text-center">
                  <p className="text-[13px] text-muted-foreground uppercase tracking-wide">Min Bet</p>
                  <p className="text-base font-bold text-white">{game.minBet}</p>
                </div>
              )}
              {game.maxBet && (
                <div className="bg-[hsl(210_60%_14%)] rounded-lg p-2.5 text-center">
                  <p className="text-[13px] text-muted-foreground uppercase tracking-wide">Max Bet</p>
                  <p className="text-base font-bold text-white">{game.maxBet}</p>
                </div>
              )}
            </div>

            {/* Tags */}
            {game.tags && game.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {game.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-[hsl(210_50%_18%)] rounded-full text-[14px] text-muted-foreground capitalize">
                    {tag.replace(/-/g, " ")}
                  </span>
                ))}
              </div>
            )}

            {/* Trust badges */}
            <div className="border-t border-[hsl(210_40%_18%)] pt-3 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Shield className="w-3.5 h-3.5 text-green-500" /> Certified Fair Game
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Zap className="w-3.5 h-3.5 text-yellow-400" /> Instant Play — No Download
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trophy className="w-3.5 h-3.5 text-[hsl(15_100%_55%)]" /> Welcome Bonus up to ৳30,000
              </div>
            </div>
          </div>

          {/* Right panel — game area */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-hidden">
            {isLiveGame ? (
              /* ── LIVE GAME: registration CTA ── */
              <div className="flex flex-col items-center justify-center text-center px-8 py-10 gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 to-[hsl(15_100%_45%)] flex items-center justify-center shadow-xl">
                  <span className="text-5xl">📹</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white mb-2">Join the Live Table</h3>
                  <p className="text-muted-foreground text-base max-w-sm">
                    {game.name} is a real live dealer table streaming 24/7 in HD.
                    {liveCount > 0 && (
                      <> <span className="text-green-400 font-semibold">{liveCount} players</span> are at the table right now.</>
                    )}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                  <button
                    className="flex-1 py-3 px-6 bg-[hsl(15_100%_55%)] hover:bg-[hsl(15_100%_45%)] text-white font-bold rounded-xl transition-colors text-base"
                    onClick={() => window.open("https://xbetzone.com/register", "_blank")}
                    data-testid="join-table-btn"
                  >
                    Register &amp; Play
                  </button>
                  <button
                    className="flex-1 py-3 px-6 bg-[hsl(210_100%_56%)] hover:bg-[hsl(210_100%_46%)] text-white font-bold rounded-xl transition-colors text-base"
                    onClick={() => window.open("https://xbetzone.com/login", "_blank")}
                    data-testid="login-table-btn"
                  >
                    Log In
                  </button>
                </div>
                <p className="text-[14px] text-muted-foreground">
                  First deposit bonus: <span className="text-[hsl(15_100%_55%)] font-bold">100% up to ৳30,000</span>
                </p>
              </div>
            ) : hasDemo ? (
              /* ── SLOT DEMO: embed or open in new tab ── */
              <div className="w-full h-full flex flex-col min-h-0">
                <div className="flex items-center justify-between px-4 py-2 bg-[hsl(210_60%_13%)] border-b border-[hsl(210_40%_18%)] shrink-0">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-sm text-muted-foreground">Demo Mode — Play for Free</span>
                  </div>
                  <a
                    href={game.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-sm text-[hsl(210_100%_56%)] hover:text-white transition-colors"
                    data-testid="open-demo-newtab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open in new tab
                  </a>
                </div>
                {!iframeError ? (
                  <div className="relative flex-1 min-h-0 bg-black">
                    {!iframeLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[hsl(210_70%_9%)] z-10">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-[hsl(210_100%_56%)] border-t-transparent rounded-full animate-spin" />
                          <p className="text-base text-muted-foreground">Loading {game.name}…</p>
                        </div>
                      </div>
                    )}
                    <iframe
                      src={game.demoUrl}
                      className="w-full h-full border-0"
                      title={game.name}
                      onLoad={() => setIframeLoaded(true)}
                      onError={() => setIframeError(true)}
                      allow="autoplay; fullscreen"
                      data-testid="game-iframe"
                    />
                  </div>
                ) : (
                  /* Fallback if iframe blocked */
                  <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center">
                    <div className="w-20 h-20 rounded-full bg-[hsl(210_60%_18%)] flex items-center justify-center">
                      <Play className="w-10 h-10 text-[hsl(210_100%_56%)]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-2">{game.name}</h3>
                      <p className="text-muted-foreground text-base">
                        This game opens best in a new tab.
                      </p>
                    </div>
                    <a
                      href={game.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-8 py-3.5 bg-[hsl(210_100%_56%)] hover:bg-[hsl(210_100%_46%)] text-white font-bold rounded-xl transition-colors"
                      data-testid="open-demo-fallback"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Play Free Demo
                    </a>
                  </div>
                )}
              </div>
            ) : (
              /* ── NO DEMO: register CTA ── */
              <div className="flex flex-col items-center justify-center text-center px-8 py-10 gap-6">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[hsl(210_80%_30%)] to-[hsl(270_60%_35%)] flex items-center justify-center shadow-xl">
                  <span className="text-5xl">{categoryIcons[game.category] || "🎮"}</span>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white mb-2">Play {game.name}</h3>
                  <p className="text-muted-foreground text-base max-w-sm">
                    Create a free account to play {game.name} and claim your <span className="text-[hsl(15_100%_55%)] font-semibold">৳30,000 welcome bonus</span>.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                  <button
                    className="flex-1 py-3 px-6 bg-[hsl(15_100%_55%)] hover:bg-[hsl(15_100%_45%)] text-white font-bold rounded-xl transition-colors text-base"
                    onClick={() => window.open("https://xbetzone.com/register", "_blank")}
                    data-testid="register-play-btn"
                  >
                    Register &amp; Play
                  </button>
                  <button
                    className="flex-1 py-3 px-6 bg-[hsl(210_50%_20%)] hover:bg-[hsl(210_50%_28%)] text-white font-bold rounded-xl transition-colors text-base border border-[hsl(210_40%_28%)]"
                    onClick={() => window.open("https://xbetzone.com/login", "_blank")}
                    data-testid="login-play-btn"
                  >
                    Log In
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
