import { useState } from "react";
import { Clock, Star, TrendingUp } from "lucide-react";

interface Odds {
  home: number;
  draw?: number;
  away: number;
}

interface MatchCardProps {
  id: string;
  sport: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  time: string;
  isLive?: boolean;
  liveScore?: string;
  odds: Odds;
  totalMarkets?: number;
  isFeatured?: boolean;
}

export default function MatchCard({
  id,
  sport,
  league,
  homeTeam,
  awayTeam,
  time,
  isLive = false,
  liveScore,
  odds,
  totalMarkets = 42,
  isFeatured = false,
}: MatchCardProps) {
  const [selectedOdd, setSelectedOdd] = useState<string | null>(null);

  const oddsOptions = [
    { key: "home", label: "1", value: odds.home },
    ...(odds.draw !== undefined ? [{ key: "draw", label: "X", value: odds.draw }] : []),
    { key: "away", label: "2", value: odds.away },
  ];

  return (
    <div
      className={`bg-card border rounded-lg overflow-hidden hover:border-[hsl(210_100%_56%)] transition-all cursor-pointer ${
        isFeatured ? "border-[hsl(210_100%_40%)]" : "border-card-border"
      }`}
      data-testid={`match-card-${id}`}
    >
      {/* Header */}
      <div className="px-3 py-2 bg-[hsl(210_60%_12%)] flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {isLive ? (
            <span className="flex items-center gap-1 text-red-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-dot inline-block" />
              LIVE
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {time}
            </span>
          )}
          <span>|</span>
          <span className="truncate max-w-[140px]">{league}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isFeatured && (
            <TrendingUp className="w-3.5 h-3.5 text-[hsl(15_100%_55%)]" />
          )}
          <button className="text-muted-foreground hover:text-yellow-400 transition-colors" data-testid={`match-favorite-${id}`}>
            <Star className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Teams */}
      <div className="px-3 py-3">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <span className="text-base font-semibold text-white truncate">{homeTeam}</span>
              {liveScore && (
                <span className="text-base font-bold text-green-400 shrink-0">
                  {liveScore.split("-")[0]}
                </span>
              )}
            </div>
            <div className="flex items-center justify-between gap-1 mt-1">
              <span className="text-base font-semibold text-white truncate">{awayTeam}</span>
              {liveScore && (
                <span className="text-base font-bold text-green-400 shrink-0">
                  {liveScore.split("-")[1]}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Odds */}
        <div className="flex gap-1.5">
          {oddsOptions.map(({ key, label, value }) => (
            <button
              key={key}
              onClick={() => setSelectedOdd(selectedOdd === key ? null : key)}
              className={`flex-1 py-2 rounded text-sm font-bold border transition-all odds-btn ${
                selectedOdd === key
                  ? "bg-[hsl(210_100%_56%)] border-[hsl(210_100%_56%)] text-white"
                  : "bg-[hsl(210_50%_18%)] border-[hsl(210_40%_24%)] text-white hover:bg-[hsl(210_100%_56%)] hover:border-[hsl(210_100%_56%)]"
              }`}
              data-testid={`odds-${id}-${key}`}
            >
              <span className="block text-[13px] text-muted-foreground font-normal mb-0.5">{label}</span>
              {value.toFixed(2)}
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-3 pb-2 flex items-center justify-between">
        <button className="text-sm text-[hsl(210_100%_70%)] hover:text-white transition-colors" data-testid={`match-markets-${id}`}>
          +{totalMarkets} markets
        </button>
        {isLive && (
          <span className="text-sm text-muted-foreground">Watch Live</span>
        )}
      </div>
    </div>
  );
}
