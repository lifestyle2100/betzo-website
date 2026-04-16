import { useState } from "react";
import { Clock, Star, Tv } from "lucide-react";
import type { NormalizedMatch } from "@/lib/sportsData";
import { formatMatchTime, getSportIcon } from "@/lib/sportsData";

interface RealMatchCardProps {
  match: NormalizedMatch;
  liveScore?: { home: string; away: string } | null;
}

export default function RealMatchCard({ match, liveScore }: RealMatchCardProps) {
  const [selectedOdd, setSelectedOdd] = useState<string | null>(null);

  const hasDraw = match.drawOdds !== null;

  const oddsOptions = [
    ...(match.homeOdds ? [{ key: "home", label: "1", value: match.homeOdds }] : []),
    ...(hasDraw && match.drawOdds ? [{ key: "draw", label: "X", value: match.drawOdds }] : []),
    ...(match.awayOdds ? [{ key: "away", label: "2", value: match.awayOdds }] : []),
  ];

  const time = formatMatchTime(match.commenceTime);
  const icon = getSportIcon(match.sportKey);

  return (
    <div
      className="overflow-hidden cursor-pointer group transition-all hover:border-[hsl(214_28%_26%)]"
      style={{ background: "hsl(214 32% 15%)", border: "1px solid hsl(214 28% 18%)", borderRadius: 4 }}
      data-testid={`real-match-${match.id}`}
    >
      {/* Match header */}
      <div
        className="px-2.5 py-1.5 flex items-center justify-between"
        style={{ background: "hsl(214 38% 11%)", borderBottom: "1px solid hsl(214 28% 15%)" }}
      >
        <div className="flex items-center gap-2 text-[14px] text-[hsl(214_15%_50%)] min-w-0">
          {match.isLive ? (
            <span className="flex items-center gap-1 text-red-400 font-bold shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 live-dot inline-block" />
              LIVE
            </span>
          ) : (
            <span className="flex items-center gap-1 shrink-0">
              <Clock className="w-3 h-3" />
              {time}
            </span>
          )}
          <span className="text-[hsl(214_15%_30%)]">|</span>
          <span className="truncate">{icon} {match.league}</span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-1">
          {match.isLive && (
            <button className="text-[hsl(214_15%_40%)] hover:text-green-400 transition-colors" title="Watch Live">
              <Tv className="w-3 h-3" />
            </button>
          )}
          <button
            className="text-[hsl(214_15%_40%)] hover:text-[#ffba00] transition-colors"
            data-testid={`real-match-fav-${match.id}`}
            onClick={(e) => e.stopPropagation()}
          >
            <Star className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Teams */}
      <div className="px-2.5 pt-2.5 pb-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[15px] font-semibold text-white truncate">{match.homeTeam}</span>
          {liveScore ? (
            <span className="text-[15px] font-bold text-green-400 tabular-nums shrink-0">{liveScore.home}</span>
          ) : (
            <span className="text-[14px] text-[hsl(214_15%_40%)] shrink-0 tabular-nums">—</span>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="text-[15px] font-semibold text-white truncate">{match.awayTeam}</span>
          {liveScore ? (
            <span className="text-[15px] font-bold text-green-400 tabular-nums shrink-0">{liveScore.away}</span>
          ) : (
            <span className="text-[14px] text-[hsl(214_15%_40%)] shrink-0 tabular-nums">—</span>
          )}
        </div>
      </div>

      {/* Odds */}
      <div className="px-2.5 pb-2.5 pt-2">
        {oddsOptions.length > 0 ? (
          <div className="flex gap-1.5">
            {oddsOptions.map(({ key, label, value }) => (
              <button
                key={key}
                onClick={() => setSelectedOdd(selectedOdd === key ? null : key)}
                className="flex-1 py-2 rounded-sm text-[14px] font-bold transition-all"
                style={
                  selectedOdd === key
                    ? { background: "#ffba00", color: "hsl(214 42% 9%)", border: "1px solid #ffba00" }
                    : { background: "hsl(214 30% 19%)", color: "white", border: "1px solid hsl(214 28% 23%)" }
                }
                onMouseEnter={(e) => {
                  if (selectedOdd !== key) {
                    e.currentTarget.style.background = "#ffba00";
                    e.currentTarget.style.color = "hsl(214 42% 9%)";
                    e.currentTarget.style.borderColor = "#ffba00";
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedOdd !== key) {
                    e.currentTarget.style.background = "hsl(214 30% 19%)";
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.borderColor = "hsl(214 28% 23%)";
                  }
                }}
                data-testid={`real-odds-${match.id}-${key}`}
              >
                <span className="block text-[12px] font-normal mb-0.5 opacity-60">{label}</span>
                {value.toFixed(2)}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-2 text-[14px] text-[hsl(214_15%_40%)]">
            Odds not yet available
          </div>
        )}
      </div>

      {/* Footer */}
      <div
        className="px-2.5 py-1.5 flex items-center justify-between"
        style={{ background: "hsl(214 38% 11%)", borderTop: "1px solid hsl(214 28% 15%)" }}
      >
        <span className="text-[13px] text-[hsl(210_100%_70%)]">+{match.totalMarkets} markets</span>
        {match.bookmaker && (
          <span className="text-[12px] text-[hsl(214_15%_35%)]">{match.bookmaker}</span>
        )}
      </div>
    </div>
  );
}
