import type { OddsEvent, Sport } from "@workspace/api-client-react";

export const POPULAR_SPORTS: { key: string; label: string; icon: string; group: string }[] = [
  { key: "soccer_epl", label: "Premier League", icon: "⚽", group: "Soccer" },
  { key: "soccer_spain_la_liga", label: "La Liga", icon: "⚽", group: "Soccer" },
  { key: "soccer_germany_bundesliga", label: "Bundesliga", icon: "⚽", group: "Soccer" },
  { key: "soccer_italy_serie_a", label: "Serie A", icon: "⚽", group: "Soccer" },
  { key: "soccer_france_ligue_one", label: "Ligue 1", icon: "⚽", group: "Soccer" },
  { key: "soccer_uefa_champs_league", label: "Champions League", icon: "⚽", group: "Soccer" },
  { key: "cricket_ipl", label: "IPL", icon: "🏏", group: "Cricket" },
  { key: "cricket_international_t20", label: "International T20", icon: "🏏", group: "Cricket" },
  { key: "cricket_odi", label: "ODI", icon: "🏏", group: "Cricket" },
  { key: "cricket_psl", label: "PSL", icon: "🏏", group: "Cricket" },
  { key: "basketball_nba", label: "NBA", icon: "🏀", group: "Basketball" },
  { key: "basketball_ncaab", label: "NCAA Basketball", icon: "🏀", group: "Basketball" },
  { key: "tennis_atp_french_open", label: "ATP Tennis", icon: "🎾", group: "Tennis" },
  { key: "baseball_mlb", label: "MLB Baseball", icon: "⚾", group: "Baseball" },
  { key: "icehockey_nhl", label: "NHL Hockey", icon: "🏒", group: "Ice Hockey" },
  { key: "americanfootball_nfl", label: "NFL", icon: "🏈", group: "American Football" },
  { key: "mma_mixed_martial_arts", label: "MMA / UFC", icon: "🥊", group: "MMA" },
];

export interface NormalizedMatch {
  id: string;
  sportKey: string;
  sportTitle: string;
  league: string;
  homeTeam: string;
  awayTeam: string;
  commenceTime: string;
  isLive: boolean;
  homeOdds: number | null;
  awayOdds: number | null;
  drawOdds: number | null;
  bookmaker: string;
  totalMarkets: number;
}

/** Extract best h2h odds from the first bookmaker available */
export function normalizeEvent(event: OddsEvent): NormalizedMatch {
  const now = new Date();
  const commence = new Date(event.commence_time);
  const isLive = commence <= now;

  let homeOdds: number | null = null;
  let awayOdds: number | null = null;
  let drawOdds: number | null = null;
  let bookmakerName = "";
  let totalMarkets = 0;

  if (event.bookmakers && event.bookmakers.length > 0) {
    const bk = event.bookmakers[0];
    bookmakerName = bk.title;
    totalMarkets = event.bookmakers.reduce((acc, b) => acc + b.markets.length, 0) * 8;

    const h2h = bk.markets.find((m) => m.key === "h2h");
    if (h2h) {
      for (const outcome of h2h.outcomes) {
        if (outcome.name === event.home_team) homeOdds = outcome.price;
        else if (outcome.name === event.away_team) awayOdds = outcome.price;
        else if (outcome.name === "Draw") drawOdds = outcome.price;
      }
    }
  }

  return {
    id: event.id,
    sportKey: event.sport_key,
    sportTitle: event.sport_title,
    league: event.sport_title,
    homeTeam: event.home_team,
    awayTeam: event.away_team,
    commenceTime: event.commence_time,
    isLive,
    homeOdds,
    awayOdds,
    drawOdds,
    bookmaker: bookmakerName,
    totalMarkets: Math.max(totalMarkets, 12),
  };
}

export function formatMatchTime(commenceTime: string): string {
  const date = new Date(commenceTime);
  const now = new Date();
  const diff = date.getTime() - now.getTime();

  if (diff < 0) return "Live";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days === 0 && hours === 0) return `In ${mins}m`;
  if (days === 0) return `Today ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  if (days === 1) return `Tomorrow ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  return date.toLocaleDateString([], { weekday: "short", hour: "2-digit", minute: "2-digit" });
}

export function getSportIcon(sportKey: string): string {
  if (sportKey.startsWith("soccer")) return "⚽";
  if (sportKey.startsWith("basketball")) return "🏀";
  if (sportKey.startsWith("tennis")) return "🎾";
  if (sportKey.startsWith("icehockey")) return "🏒";
  if (sportKey.startsWith("baseball")) return "⚾";
  if (sportKey.startsWith("americanfootball")) return "🏈";
  if (sportKey.startsWith("mma")) return "🥊";
  if (sportKey.startsWith("rugbyleague") || sportKey.startsWith("rugbyunion")) return "🏉";
  if (sportKey.startsWith("cricket")) return "🏏";
  return "🏆";
}

export function groupSportsByGroup(sports: Sport[]) {
  const groups: Record<string, Sport[]> = {};
  for (const s of sports) {
    if (!s.active) continue;
    if (!groups[s.group]) groups[s.group] = [];
    groups[s.group].push(s);
  }
  return groups;
}
