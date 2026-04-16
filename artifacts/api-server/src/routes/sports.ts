import { Router, type IRouter } from "express";

const router: IRouter = Router();
const BASE_URL = "https://api.the-odds-api.com/v4";

function getApiKey(): string {
  const key = process.env["ODDS_API_KEY"];
  if (!key) throw new Error("ODDS_API_KEY is not set");
  return key;
}

// ── Simple in-memory TTL cache ─────────────────────────────────────────────
interface CacheEntry<T> {
  data: T;
  expiresAt: number;
}
const cache = new Map<string, CacheEntry<unknown>>();

function getCache<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null; }
  return entry.data as T;
}
function setCache<T>(key: string, data: T, ttlMs: number) {
  cache.set(key, { data, expiresAt: Date.now() + ttlMs });
}

// ── Sports list (cached 10 min) ────────────────────────────────────────────
router.get("/sports", async (req, res) => {
  try {
    const cached = getCache<unknown[]>("sports");
    if (cached) { res.json(cached); return; }

    const apiKey = getApiKey();
    const response = await fetch(`${BASE_URL}/sports/?apiKey=${apiKey}`);
    if (!response.ok) {
      res.status(response.status).json({ error: "Failed to fetch sports" }); return;
    }
    const data = await response.json() as unknown[];
    setCache("sports", data, 10 * 60 * 1000);
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Error fetching sports");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Single sport odds (cached 3 min) ─────────────────────────────────────
class OddsApiError extends Error {
  constructor(public statusCode: number, public errorCode: string, message: string) {
    super(message);
    this.name = "OddsApiError";
  }
}

async function fetchOddsForSport(sport: string, regions: string, markets: string, log: any) {
  const cacheKey = `odds:${sport}:${regions}:${markets}`;
  const cached = getCache<unknown[]>(cacheKey);
  if (cached) return cached;

  const apiKey = getApiKey();
  const url = `${BASE_URL}/sports/${encodeURIComponent(sport)}/odds/?apiKey=${apiKey}&regions=${encodeURIComponent(regions)}&markets=${encodeURIComponent(markets)}&oddsFormat=decimal`;
  const response = await fetch(url);

  if (!response.ok) {
    let body: any = {};
    try { body = await response.json(); } catch {}
    const errorCode = body?.error_code ?? "UNKNOWN";
    const message = body?.message ?? `HTTP ${response.status}`;
    log.error({ sport, status: response.status, errorCode, message }, "Odds API error");
    throw new OddsApiError(response.status, errorCode, message);
  }

  const remaining = response.headers.get("x-requests-remaining");
  const used = response.headers.get("x-requests-used");
  log.info({ sport, remaining, used }, "Odds API quota");

  const data = await response.json() as unknown[];
  setCache(cacheKey, data, 3 * 60 * 1000);
  return data;
}

router.get("/odds", async (req, res) => {
  try {
    const sport = (req.query["sport"] as string) || "soccer_epl";
    const regions = (req.query["regions"] as string) || "us";
    const markets = (req.query["markets"] as string) || "h2h";
    const data = await fetchOddsForSport(sport, regions, markets, req.log);
    res.json(data);
  } catch (err) {
    if (err instanceof OddsApiError) {
      const status = err.statusCode === 401 || err.statusCode === 402 || err.statusCode === 429 ? err.statusCode : 502;
      res.status(status).json({ error: err.message, error_code: err.errorCode });
      return;
    }
    req.log.error({ err }, "Error fetching odds");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── ALL SPORTS odds — parallel fetch with cache ────────────────────────────
// Curated list of the most popular active sports globally
const ALL_SPORTS_KEYS = [
  // Cricket first (highly relevant for BD)
  "cricket_ipl",
  "cricket_international_t20",
  "cricket_psl",
  "cricket_odi",
  // Soccer — top leagues
  "soccer_epl",
  "soccer_spain_la_liga",
  "soccer_germany_bundesliga",
  "soccer_italy_serie_a",
  "soccer_france_ligue_one",
  "soccer_uefa_champs_league",
  "soccer_uefa_europa_league",
  "soccer_conmebol_copa_libertadores",
  "soccer_usa_mls",
  "soccer_efl_champ",
  // Basketball
  "basketball_nba",
  "basketball_euroleague",
  // Ice Hockey
  "icehockey_nhl",
  // Tennis
  "tennis_atp_barcelona_open",
  "tennis_atp_munich",
  "tennis_wta_stuttgart_open",
  // Baseball
  "baseball_mlb",
  // MMA
  "mma_mixed_martial_arts",
  // Rugby
  "rugbyleague_nrl",
  // American Football
  "americanfootball_ufl",
];

const SPORT_META: Record<string, { group: string; icon: string }> = {
  cricket_ipl:                    { group: "Cricket",            icon: "🏏" },
  cricket_international_t20:      { group: "Cricket",            icon: "🏏" },
  cricket_psl:                    { group: "Cricket",            icon: "🏏" },
  cricket_odi:                    { group: "Cricket",            icon: "🏏" },
  soccer_epl:                     { group: "Soccer",             icon: "⚽" },
  soccer_spain_la_liga:           { group: "Soccer",             icon: "⚽" },
  soccer_germany_bundesliga:      { group: "Soccer",             icon: "⚽" },
  soccer_italy_serie_a:           { group: "Soccer",             icon: "⚽" },
  soccer_france_ligue_one:        { group: "Soccer",             icon: "⚽" },
  soccer_uefa_champs_league:      { group: "Soccer",             icon: "⚽" },
  soccer_uefa_europa_league:      { group: "Soccer",             icon: "⚽" },
  soccer_conmebol_copa_libertadores: { group: "Soccer",          icon: "⚽" },
  soccer_usa_mls:                 { group: "Soccer",             icon: "⚽" },
  soccer_efl_champ:               { group: "Soccer",             icon: "⚽" },
  basketball_nba:                 { group: "Basketball",         icon: "🏀" },
  basketball_euroleague:          { group: "Basketball",         icon: "🏀" },
  icehockey_nhl:                  { group: "Ice Hockey",         icon: "🏒" },
  tennis_atp_barcelona_open:      { group: "Tennis",             icon: "🎾" },
  tennis_atp_munich:              { group: "Tennis",             icon: "🎾" },
  tennis_wta_stuttgart_open:      { group: "Tennis",             icon: "🎾" },
  baseball_mlb:                   { group: "Baseball",           icon: "⚾" },
  mma_mixed_martial_arts:         { group: "MMA",                icon: "🥊" },
  rugbyleague_nrl:                { group: "Rugby",              icon: "🏉" },
  americanfootball_ufl:           { group: "American Football",  icon: "🏈" },
};

router.get("/odds/all", async (req, res) => {
  try {
    const regions = (req.query["regions"] as string) || "us,uk,eu";
    const markets = (req.query["markets"] as string) || "h2h";

    // Fetch all sports in parallel, using per-sport cache
    const results = await Promise.allSettled(
      ALL_SPORTS_KEYS.map(async (sportKey) => {
        const events = await fetchOddsForSport(sportKey, regions, markets, req.log);
        const meta = SPORT_META[sportKey] ?? { group: "Other", icon: "🏆" };
        return { sportKey, ...meta, events };
      })
    );

    // Check if every request failed with a quota error
    const firstRejection = results.find(r => r.status === "rejected") as PromiseRejectedResult | undefined;
    if (firstRejection && results.every(r => r.status === "rejected")) {
      const err = firstRejection.reason;
      if (err instanceof OddsApiError) {
        const status = err.statusCode === 401 || err.statusCode === 402 || err.statusCode === 429 ? err.statusCode : 502;
        res.status(status).json({ error: err.message, error_code: err.errorCode });
        return;
      }
    }

    const grouped: Record<string, { icon: string; sports: { sportKey: string; sportTitle: string; events: unknown[] }[] }> = {};

    for (const result of results) {
      if (result.status !== "fulfilled") continue;
      const { sportKey, group, icon, events } = result.value;
      if (!Array.isArray(events) || events.length === 0) continue;

      if (!grouped[group]) grouped[group] = { icon, sports: [] };

      // Derive sport title from first event if possible
      const firstEvent = events[0] as any;
      const sportTitle = firstEvent?.sport_title ?? sportKey;
      grouped[group].sports.push({ sportKey, sportTitle, events });
    }

    const totalMatches = Object.values(grouped)
      .flatMap(g => g.sports)
      .reduce((acc, s) => acc + (s.events as unknown[]).length, 0);

    req.log.info({ totalMatches, groups: Object.keys(grouped).length }, "All sports odds fetched");
    res.json(grouped);
  } catch (err) {
    req.log.error({ err }, "Error fetching all sports odds");
    res.status(500).json({ error: "Internal server error" });
  }
});

// ── Scores (cached 90 sec) ────────────────────────────────────────────────
router.get("/scores", async (req, res) => {
  try {
    const sport = (req.query["sport"] as string) || "soccer_epl";
    const daysFrom = (req.query["daysFrom"] as string) || "1";
    const cacheKey = `scores:${sport}:${daysFrom}`;

    const cached = getCache<unknown[]>(cacheKey);
    if (cached) { res.json(cached); return; }

    const apiKey = getApiKey();
    const url = `${BASE_URL}/sports/${encodeURIComponent(sport)}/scores/?apiKey=${apiKey}&daysFrom=${encodeURIComponent(daysFrom)}`;
    const response = await fetch(url);
    if (!response.ok) {
      res.status(response.status).json({ error: "Failed to fetch scores" }); return;
    }
    const data = await response.json() as unknown[];
    setCache(cacheKey, data, 90 * 1000);
    res.json(data);
  } catch (err) {
    req.log.error({ err }, "Error fetching scores");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
