import type { NormalizedMatch } from "./sportsData";

// Rich static match data — used as fallback when the Odds API is unavailable
const now = new Date();
const h = (hrs: number) => new Date(now.getTime() + hrs * 3600000).toISOString();

export const MOCK_MATCHES: NormalizedMatch[] = [
  // ─── Cricket ──────────────────────────────────────────────
  { id:"m1",  sportKey:"cricket_ipl",              sportTitle:"IPL",                 league:"IPL 2024",           homeTeam:"Mumbai Indians",      awayTeam:"Chennai Super Kings",    commenceTime:h(1),  isLive:false, homeOdds:1.85, awayOdds:2.10, drawOdds:null, bookmaker:"Betfair",   totalMarkets:38 },
  { id:"m2",  sportKey:"cricket_ipl",              sportTitle:"IPL",                 league:"IPL 2024",           homeTeam:"Royal Challengers",   awayTeam:"Kolkata Knight Riders",  commenceTime:h(3),  isLive:false, homeOdds:2.20, awayOdds:1.75, drawOdds:null, bookmaker:"Bet365",    totalMarkets:32 },
  { id:"m3",  sportKey:"cricket_ipl",              sportTitle:"IPL",                 league:"IPL 2024",           homeTeam:"Delhi Capitals",      awayTeam:"Punjab Kings",           commenceTime:h(5),  isLive:false, homeOdds:1.95, awayOdds:1.95, drawOdds:null, bookmaker:"Betway",    totalMarkets:28 },
  { id:"m4",  sportKey:"cricket_international_t20",sportTitle:"T20 International",   league:"T20 World Cup",      homeTeam:"India",               awayTeam:"Pakistan",               commenceTime:h(-1), isLive:true,  homeOdds:1.55, awayOdds:2.65, drawOdds:null, bookmaker:"Pinnacle",  totalMarkets:45 },
  { id:"m5",  sportKey:"cricket_international_t20",sportTitle:"T20 International",   league:"T20 World Cup",      homeTeam:"Australia",           awayTeam:"England",                commenceTime:h(2),  isLive:false, homeOdds:1.80, awayOdds:2.10, drawOdds:null, bookmaker:"Bet365",    totalMarkets:36 },
  { id:"m6",  sportKey:"cricket_odi",             sportTitle:"ODI",                 league:"ODI Series",         homeTeam:"South Africa",        awayTeam:"New Zealand",            commenceTime:h(8),  isLive:false, homeOdds:1.70, awayOdds:2.30, drawOdds:null, bookmaker:"Betfair",   totalMarkets:30 },
  { id:"m7",  sportKey:"cricket_psl",             sportTitle:"PSL",                 league:"PSL 2024",           homeTeam:"Lahore Qalandars",    awayTeam:"Karachi Kings",          commenceTime:h(4),  isLive:false, homeOdds:1.65, awayOdds:2.45, drawOdds:null, bookmaker:"Bet365",    totalMarkets:24 },
  { id:"m8",  sportKey:"cricket_psl",             sportTitle:"PSL",                 league:"PSL 2024",           homeTeam:"Peshawar Zalmi",      awayTeam:"Multan Sultans",         commenceTime:h(6),  isLive:false, homeOdds:2.10, awayOdds:1.82, drawOdds:null, bookmaker:"Betway",    totalMarkets:22 },

  // ─── Football / Soccer ────────────────────────────────────
  { id:"m9",  sportKey:"soccer_epl",              sportTitle:"Premier League",      league:"Premier League",     homeTeam:"Manchester City",     awayTeam:"Arsenal",                commenceTime:h(2),  isLive:false, homeOdds:1.72, awayOdds:5.20, drawOdds:3.80, bookmaker:"Bet365",    totalMarkets:55 },
  { id:"m10", sportKey:"soccer_epl",              sportTitle:"Premier League",      league:"Premier League",     homeTeam:"Liverpool",           awayTeam:"Chelsea",                commenceTime:h(-0.5),isLive:true, homeOdds:1.85, awayOdds:4.50, drawOdds:3.60, bookmaker:"Pinnacle",  totalMarkets:62 },
  { id:"m11", sportKey:"soccer_epl",              sportTitle:"Premier League",      league:"Premier League",     homeTeam:"Tottenham",           awayTeam:"Newcastle",              commenceTime:h(4),  isLive:false, homeOdds:2.10, awayOdds:3.40, drawOdds:3.20, bookmaker:"Betfair",   totalMarkets:48 },
  { id:"m12", sportKey:"soccer_spain_la_liga",    sportTitle:"La Liga",             league:"La Liga",            homeTeam:"Real Madrid",         awayTeam:"Barcelona",              commenceTime:h(3),  isLive:false, homeOdds:2.00, awayOdds:3.75, drawOdds:3.50, bookmaker:"Bet365",    totalMarkets:58 },
  { id:"m13", sportKey:"soccer_spain_la_liga",    sportTitle:"La Liga",             league:"La Liga",            homeTeam:"Atletico Madrid",     awayTeam:"Sevilla",                commenceTime:h(5),  isLive:false, homeOdds:1.62, awayOdds:5.50, drawOdds:3.90, bookmaker:"Betway",    totalMarkets:44 },
  { id:"m14", sportKey:"soccer_germany_bundesliga",sportTitle:"Bundesliga",         league:"Bundesliga",         homeTeam:"Bayern Munich",       awayTeam:"Borussia Dortmund",      commenceTime:h(2.5),isLive:false, homeOdds:1.55, awayOdds:6.00, drawOdds:4.20, bookmaker:"Unibet",    totalMarkets:52 },
  { id:"m15", sportKey:"soccer_germany_bundesliga",sportTitle:"Bundesliga",         league:"Bundesliga",         homeTeam:"RB Leipzig",          awayTeam:"Bayer Leverkusen",       commenceTime:h(4.5),isLive:false, homeOdds:2.30, awayOdds:3.10, drawOdds:3.30, bookmaker:"Bet365",    totalMarkets:40 },
  { id:"m16", sportKey:"soccer_italy_serie_a",    sportTitle:"Serie A",             league:"Serie A",            homeTeam:"Inter Milan",         awayTeam:"AC Milan",               commenceTime:h(6),  isLive:false, homeOdds:1.95, awayOdds:4.00, drawOdds:3.50, bookmaker:"Pinnacle",  totalMarkets:50 },
  { id:"m17", sportKey:"soccer_france_ligue_one", sportTitle:"Ligue 1",             league:"Ligue 1",            homeTeam:"PSG",                 awayTeam:"Marseille",              commenceTime:h(3.5),isLive:false, homeOdds:1.40, awayOdds:8.00, drawOdds:4.80, bookmaker:"Bet365",    totalMarkets:46 },
  { id:"m18", sportKey:"soccer_uefa_champs_league",sportTitle:"Champions League",   league:"UEFA Champions League",homeTeam:"Man City",          awayTeam:"Real Madrid",            commenceTime:h(-2), isLive:true,  homeOdds:2.10, awayOdds:3.60, drawOdds:3.40, bookmaker:"Betfair",   totalMarkets:68 },
  { id:"m19", sportKey:"soccer_uefa_champs_league",sportTitle:"Champions League",   league:"UEFA Champions League",homeTeam:"PSG",               awayTeam:"Bayern Munich",          commenceTime:h(7),  isLive:false, homeOdds:2.50, awayOdds:2.85, drawOdds:3.40, bookmaker:"Unibet",    totalMarkets:60 },

  // ─── Basketball ───────────────────────────────────────────
  { id:"m20", sportKey:"basketball_nba",          sportTitle:"NBA",                 league:"NBA",                homeTeam:"LA Lakers",           awayTeam:"Boston Celtics",         commenceTime:h(5),  isLive:false, homeOdds:2.15, awayOdds:1.75, drawOdds:null, bookmaker:"Bet365",    totalMarkets:35 },
  { id:"m21", sportKey:"basketball_nba",          sportTitle:"NBA",                 league:"NBA",                homeTeam:"Golden State Warriors",awayTeam:"Miami Heat",             commenceTime:h(-1), isLive:true,  homeOdds:1.65, awayOdds:2.35, drawOdds:null, bookmaker:"Pinnacle",  totalMarkets:38 },
  { id:"m22", sportKey:"basketball_nba",          sportTitle:"NBA",                 league:"NBA",                homeTeam:"Milwaukee Bucks",     awayTeam:"Philadelphia 76ers",     commenceTime:h(3),  isLive:false, homeOdds:1.90, awayOdds:1.95, drawOdds:null, bookmaker:"Betfair",   totalMarkets:32 },
  { id:"m23", sportKey:"basketball_ncaab",        sportTitle:"NCAA Basketball",     league:"NCAA Basketball",    homeTeam:"Duke Blue Devils",    awayTeam:"North Carolina Tar Heels",commenceTime:h(4), isLive:false, homeOdds:1.75, awayOdds:2.10, drawOdds:null, bookmaker:"Bet365",    totalMarkets:24 },

  // ─── Tennis ───────────────────────────────────────────────
  { id:"m24", sportKey:"tennis_atp_french_open",  sportTitle:"ATP Tennis",          league:"Roland Garros",      homeTeam:"Carlos Alcaraz",      awayTeam:"Novak Djokovic",         commenceTime:h(2),  isLive:false, homeOdds:1.95, awayOdds:2.00, drawOdds:null, bookmaker:"Bet365",    totalMarkets:28 },
  { id:"m25", sportKey:"tennis_atp_french_open",  sportTitle:"ATP Tennis",          league:"Roland Garros",      homeTeam:"Rafael Nadal",        awayTeam:"Daniil Medvedev",        commenceTime:h(4),  isLive:false, homeOdds:1.75, awayOdds:2.20, drawOdds:null, bookmaker:"Pinnacle",  totalMarkets:22 },
  { id:"m26", sportKey:"tennis_atp_french_open",  sportTitle:"ATP Tennis",          league:"ATP 1000",           homeTeam:"Jannik Sinner",       awayTeam:"Stefanos Tsitsipas",     commenceTime:h(-1), isLive:true,  homeOdds:1.60, awayOdds:2.45, drawOdds:null, bookmaker:"Betfair",   totalMarkets:30 },

  // ─── Ice Hockey ───────────────────────────────────────────
  { id:"m27", sportKey:"icehockey_nhl",           sportTitle:"NHL",                 league:"NHL Stanley Cup",    homeTeam:"Colorado Avalanche",  awayTeam:"Tampa Bay Lightning",    commenceTime:h(6),  isLive:false, homeOdds:1.80, awayOdds:2.10, drawOdds:3.50, bookmaker:"Bet365",    totalMarkets:30 },
  { id:"m28", sportKey:"icehockey_nhl",           sportTitle:"NHL",                 league:"NHL",                homeTeam:"Toronto Maple Leafs", awayTeam:"Montreal Canadiens",     commenceTime:h(4),  isLive:false, homeOdds:1.55, awayOdds:2.70, drawOdds:4.00, bookmaker:"Pinnacle",  totalMarkets:26 },

  // ─── Baseball ─────────────────────────────────────────────
  { id:"m29", sportKey:"baseball_mlb",            sportTitle:"MLB",                 league:"MLB",                homeTeam:"New York Yankees",    awayTeam:"Los Angeles Dodgers",    commenceTime:h(3),  isLive:false, homeOdds:1.90, awayOdds:1.95, drawOdds:null, bookmaker:"Bet365",    totalMarkets:22 },
  { id:"m30", sportKey:"baseball_mlb",            sportTitle:"MLB",                 league:"MLB",                homeTeam:"Boston Red Sox",      awayTeam:"Houston Astros",         commenceTime:h(5),  isLive:false, homeOdds:2.10, awayOdds:1.80, drawOdds:null, bookmaker:"Betfair",   totalMarkets:20 },

  // ─── MMA / UFC ────────────────────────────────────────────
  { id:"m31", sportKey:"mma_mixed_martial_arts",  sportTitle:"MMA",                 league:"UFC Fight Night",    homeTeam:"Israel Adesanya",     awayTeam:"Sean Strickland",        commenceTime:h(12), isLive:false, homeOdds:1.75, awayOdds:2.20, drawOdds:null, bookmaker:"Bet365",    totalMarkets:28 },
  { id:"m32", sportKey:"mma_mixed_martial_arts",  sportTitle:"MMA",                 league:"UFC Fight Night",    homeTeam:"Conor McGregor",      awayTeam:"Michael Chandler",       commenceTime:h(14), isLive:false, homeOdds:1.90, awayOdds:2.00, drawOdds:null, bookmaker:"Pinnacle",  totalMarkets:32 },

  // ─── American Football ────────────────────────────────────
  { id:"m33", sportKey:"americanfootball_nfl",    sportTitle:"NFL",                 league:"NFL",                homeTeam:"Kansas City Chiefs",  awayTeam:"San Francisco 49ers",    commenceTime:h(8),  isLive:false, homeOdds:1.85, awayOdds:2.05, drawOdds:null, bookmaker:"Bet365",    totalMarkets:42 },
  { id:"m34", sportKey:"americanfootball_nfl",    sportTitle:"NFL",                 league:"NFL",                homeTeam:"Dallas Cowboys",      awayTeam:"Green Bay Packers",      commenceTime:h(10), isLive:false, homeOdds:1.70, awayOdds:2.25, drawOdds:null, bookmaker:"Betfair",   totalMarkets:38 },

  // ─── More Premier League / live ──────────────────────────
  { id:"m35", sportKey:"soccer_epl",              sportTitle:"Premier League",      league:"Premier League",     homeTeam:"Manchester United",   awayTeam:"West Ham",               commenceTime:h(-1.5),isLive:true, homeOdds:1.75, awayOdds:4.80, drawOdds:3.70, bookmaker:"Unibet",    totalMarkets:54 },
  { id:"m36", sportKey:"soccer_epl",              sportTitle:"Premier League",      league:"Premier League",     homeTeam:"Aston Villa",         awayTeam:"Everton",                commenceTime:h(6),  isLive:false, homeOdds:1.55, awayOdds:6.00, drawOdds:4.20, bookmaker:"Bet365",    totalMarkets:46 },
  { id:"m37", sportKey:"soccer_epl",              sportTitle:"Premier League",      league:"Premier League",     homeTeam:"Brighton",            awayTeam:"Fulham",                 commenceTime:h(8),  isLive:false, homeOdds:1.85, awayOdds:4.50, drawOdds:3.60, bookmaker:"Pinnacle",  totalMarkets:44 },
  { id:"m38", sportKey:"soccer_epl",              sportTitle:"Premier League",      league:"Premier League",     homeTeam:"Wolves",              awayTeam:"Crystal Palace",         commenceTime:h(10), isLive:false, homeOdds:2.10, awayOdds:3.50, drawOdds:3.30, bookmaker:"Betfair",   totalMarkets:40 },
  { id:"m39", sportKey:"cricket_ipl",             sportTitle:"IPL",                 league:"IPL 2024",           homeTeam:"Rajasthan Royals",    awayTeam:"Sunrisers Hyderabad",    commenceTime:h(-0.8),isLive:true, homeOdds:1.75, awayOdds:2.20, drawOdds:null, bookmaker:"Bet365",    totalMarkets:35 },
  { id:"m40", sportKey:"basketball_nba",          sportTitle:"NBA",                 league:"NBA Playoffs",       homeTeam:"Denver Nuggets",      awayTeam:"Dallas Mavericks",       commenceTime:h(-2), isLive:true,  homeOdds:1.70, awayOdds:2.25, drawOdds:null, bookmaker:"Pinnacle",  totalMarkets:42 },
];

export function getMockMatchesBySport(sportKey: string): NormalizedMatch[] {
  const filtered = MOCK_MATCHES.filter(m => m.sportKey === sportKey);
  // If no matches for this sport, return a generic set
  if (filtered.length === 0) return MOCK_MATCHES.slice(0, 6);
  return filtered;
}

export function getLiveMockMatches(): NormalizedMatch[] {
  return MOCK_MATCHES.filter(m => m.isLive);
}

export function getAllMockMatches(): NormalizedMatch[] {
  return MOCK_MATCHES;
}
