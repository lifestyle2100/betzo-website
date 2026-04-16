import { Play, Star, Users } from "lucide-react";
import { useState } from "react";

export interface CasinoGame {
  id: string;
  name: string;
  provider: string;
  category: string;
  subCategory?: string;
  rtp?: string;
  isHot?: boolean;
  isNew?: boolean;
  isLive?: boolean;
  players?: number;
  minBet?: string;
  maxBet?: string;
  thumbnail?: string;
  demoUrl?: string;
  tags?: string[];
  colorScheme?: "blue" | "purple" | "green" | "orange" | "red";
}

const colorSchemes = {
  blue: "from-[hsl(210_80%_30%)] to-[hsl(210_80%_15%)]",
  purple: "from-[hsl(270_60%_35%)] to-[hsl(270_60%_18%)]",
  green: "from-[hsl(140_60%_28%)] to-[hsl(140_60%_14%)]",
  orange: "from-[hsl(30_80%_35%)] to-[hsl(30_80%_18%)]",
  red: "from-[hsl(350_70%_35%)] to-[hsl(350_70%_18%)]",
};

const categoryIcons: Record<string, string> = {
  slots: "🎰",
  roulette: "🎡",
  blackjack: "🃏",
  baccarat: "🎴",
  poker: "♠️",
  live: "📹",
  "live-casino": "📹",
  crash: "📈",
  jackpot: "💎",
  table: "🎲",
};

function pickColor(id: string): keyof typeof colorSchemes {
  const colors: (keyof typeof colorSchemes)[] = ["blue", "purple", "green", "orange", "red"];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = id.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

interface CasinoGameCardProps extends CasinoGame {
  onPlay?: (game: CasinoGame) => void;
}

export default function CasinoGameCard(props: CasinoGameCardProps) {
  const { id, name, provider, category, rtp, isHot = false, isNew = false, isLive = false,
    players, thumbnail, colorScheme, onPlay } = props;
  const [imgError, setImgError] = useState(false);
  const scheme = colorScheme ?? pickColor(id);

  const handlePlay = () => onPlay?.(props);

  return (
    <div
      className="game-card bg-card border border-card-border rounded-lg overflow-hidden group cursor-pointer"
      data-testid={`casino-card-${id}`}
      onClick={handlePlay}
    >
      <div className={`relative h-32 ${!thumbnail || imgError ? `bg-gradient-to-br ${colorSchemes[scheme]} flex items-center justify-center` : ""}`}>
        {thumbnail && !imgError ? (
          <img
            src={thumbnail}
            alt={name}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <span className="text-5xl select-none">{categoryIcons[category] || "🎮"}</span>
        )}

        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            className="w-11 h-11 rounded-full bg-[hsl(210_100%_56%)] flex items-center justify-center shadow-lg"
            data-testid={`casino-play-${id}`}
            onClick={(e) => { e.stopPropagation(); handlePlay(); }}
          >
            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
          </button>
        </div>

        <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
          {isHot && (
            <span className="px-1.5 py-0.5 text-[13px] font-bold rounded bg-[hsl(15_100%_55%)] text-white">HOT</span>
          )}
          {isNew && (
            <span className="px-1.5 py-0.5 text-[13px] font-bold rounded bg-green-500 text-white">NEW</span>
          )}
          {isLive && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 text-[13px] font-bold rounded bg-red-600 text-white">
              <span className="w-1 h-1 rounded-full bg-white animate-pulse" />
              LIVE
            </span>
          )}
        </div>

        <button
          className="absolute top-2 right-2 text-muted-foreground hover:text-yellow-400 transition-colors opacity-0 group-hover:opacity-100"
          data-testid={`casino-favorite-${id}`}
        >
          <Star className="w-4 h-4" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1">
          {rtp && (
            <span className="px-1.5 py-0.5 bg-black/60 rounded text-[13px] text-white font-medium">
              RTP {rtp}
            </span>
          )}
          {players !== undefined && (
            <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-black/60 rounded text-[13px] text-green-400 font-medium ml-auto">
              <Users className="w-2.5 h-2.5" />
              {players.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      <div className="px-2.5 py-2">
        <p className="text-base font-semibold text-white truncate">{name}</p>
        <p className="text-sm text-muted-foreground truncate mt-0.5">{provider}</p>
      </div>
    </div>
  );
}
