import { Router, type IRouter } from "express";

const router: IRouter = Router();

export interface CasinoGame {
  id: string;
  name: string;
  provider: string;
  category: "slots" | "live" | "roulette" | "blackjack" | "baccarat" | "poker" | "crash" | "jackpot" | "table";
  subCategory?: string;
  rtp?: string;
  isHot?: boolean;
  isNew?: boolean;
  isLive?: boolean;
  minBet?: string;
  maxBet?: string;
  players?: number;
  thumbnail: string;
  demoUrl?: string;
  tags?: string[];
}

function picsum(seed: string): string {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/300/200`;
}

function ppDemo(symbol: string): string {
  return `https://demogames.pragmaticplay.net/gs2c/openGame.do?gameSymbol=${symbol}&websiteUrl=https://demogames.pragmaticplay.net&jurisdiction=99&lang=en&lobbyUrl=https://demogames.pragmaticplay.net&mobile=0&demo=1`;
}

function bgDemo(slug: string): string {
  return `https://bgaming.com/play/${slug}/demo`;
}

const GAMES: CasinoGame[] = [
  // ── SLOTS ───────────────────────────────────────────────────────────────────
  { id: "pp-olymp", name: "Gates of Olympus", provider: "Pragmatic Play", category: "slots", rtp: "96.50%", isHot: true, thumbnail: picsum("gates-olympus"), demoUrl: ppDemo("vs20olympgate"), tags: ["popular", "megaways"] },
  { id: "pp-sweet", name: "Sweet Bonanza", provider: "Pragmatic Play", category: "slots", rtp: "96.48%", isHot: true, thumbnail: picsum("sweet-bonanza"), demoUrl: ppDemo("vs20fruitsw"), tags: ["popular", "candy"] },
  { id: "pp-wolf", name: "Wolf Gold", provider: "Pragmatic Play", category: "slots", rtp: "96.01%", thumbnail: picsum("wolf-gold"), demoUrl: ppDemo("vs25wolfgold"), tags: ["jackpot"] },
  { id: "pp-bigbass", name: "Big Bass Bonanza", provider: "Pragmatic Play", category: "slots", rtp: "96.71%", isNew: true, thumbnail: picsum("big-bass-bonanza"), demoUrl: ppDemo("vs10bbbonanza"), tags: ["fishing"] },
  { id: "pp-starlight", name: "Starlight Princess", provider: "Pragmatic Play", category: "slots", rtp: "96.50%", isHot: true, thumbnail: picsum("starlight-princess"), demoUrl: ppDemo("vs20starlight"), tags: ["anime"] },
  { id: "pp-pirate", name: "Pirate Gold Deluxe", provider: "Pragmatic Play", category: "slots", rtp: "96.51%", thumbnail: picsum("pirate-gold-deluxe"), demoUrl: ppDemo("vs40piratemaxx"), tags: ["pirate"] },
  { id: "pp-aztec", name: "Aztec Bonanza", provider: "Pragmatic Play", category: "slots", rtp: "96.53%", thumbnail: picsum("aztec-bonanza"), demoUrl: ppDemo("vs25aztecbns") },
  { id: "pp-buffalo", name: "Great Rhino Megaways", provider: "Pragmatic Play", category: "slots", rtp: "96.58%", isHot: true, thumbnail: picsum("great-rhino-megaways"), demoUrl: ppDemo("vs20rhino"), tags: ["megaways"] },
  { id: "net-star", name: "Starburst", provider: "NetEnt", category: "slots", rtp: "96.09%", isHot: true, thumbnail: picsum("starburst-netent"), tags: ["classic"] },
  { id: "net-gonzo", name: "Gonzo's Quest", provider: "NetEnt", category: "slots", rtp: "95.97%", thumbnail: picsum("gonzos-quest"), tags: ["avalanche"] },
  { id: "net-twin", name: "Twin Spin", provider: "NetEnt", category: "slots", rtp: "96.60%", thumbnail: picsum("twin-spin") },
  { id: "net-blood", name: "Blood Suckers", provider: "NetEnt", category: "slots", rtp: "98.00%", thumbnail: picsum("blood-suckers"), tags: ["high-rtp"] },
  { id: "net-fruit", name: "Fruit Shop", provider: "NetEnt", category: "slots", rtp: "96.76%", thumbnail: picsum("fruit-shop-slot") },
  { id: "png-book", name: "Book of Dead", provider: "Play'n GO", category: "slots", rtp: "96.21%", isHot: true, thumbnail: picsum("book-of-dead"), tags: ["egypt", "popular"] },
  { id: "png-reactoonz", name: "Reactoonz", provider: "Play'n GO", category: "slots", rtp: "96.51%", isHot: true, thumbnail: picsum("reactoonz-png"), tags: ["grid"] },
  { id: "png-legacy", name: "Legacy of Dead", provider: "Play'n GO", category: "slots", rtp: "96.58%", thumbnail: picsum("legacy-of-dead"), tags: ["egypt"] },
  { id: "png-moon", name: "Moon Princess", provider: "Play'n GO", category: "slots", rtp: "96.51%", isNew: true, thumbnail: picsum("moon-princess") },
  { id: "png-fire", name: "Fire Joker", provider: "Play'n GO", category: "slots", rtp: "96.15%", thumbnail: picsum("fire-joker-slot") },
  { id: "mg-mega", name: "Mega Moolah", provider: "Microgaming", category: "jackpot", rtp: "88.12%", isHot: true, thumbnail: picsum("mega-moolah-jackpot"), tags: ["progressive", "jackpot"] },
  { id: "mg-immortal", name: "Immortal Romance", provider: "Microgaming", category: "slots", rtp: "96.86%", isHot: true, thumbnail: picsum("immortal-romance"), tags: ["vampire"] },
  { id: "mg-thunderstruck", name: "Thunderstruck II", provider: "Microgaming", category: "slots", rtp: "96.65%", thumbnail: picsum("thunderstruck-2") },
  { id: "mg-avalon", name: "Avalon II", provider: "Microgaming", category: "slots", rtp: "97.12%", thumbnail: picsum("avalon-2-slot") },
  { id: "nl-tombstone", name: "Tombstone No Mercy", provider: "NoLimit City", category: "slots", rtp: "96.12%", isNew: true, thumbnail: picsum("tombstone-no-mercy"), tags: ["volatile"] },
  { id: "nl-xways", name: "Xways Hoarder", provider: "NoLimit City", category: "slots", rtp: "96.00%", thumbnail: picsum("xways-hoarder") },
  { id: "nl-beast", name: "Beast Mode", provider: "NoLimit City", category: "slots", rtp: "96.08%", isNew: true, thumbnail: picsum("beast-mode-slot") },
  { id: "hg-chaos", name: "Chaos Crew", provider: "Hacksaw Gaming", category: "slots", rtp: "96.11%", isNew: true, thumbnail: picsum("chaos-crew"), tags: ["buy-bonus"] },
  { id: "hg-wanted", name: "Wanted Dead or a Wild", provider: "Hacksaw Gaming", category: "slots", rtp: "96.38%", isHot: true, thumbnail: picsum("wanted-dead-wild"), tags: ["buy-bonus"] },
  { id: "rg-money", name: "Money Train 3", provider: "Relax Gaming", category: "slots", rtp: "96.40%", isHot: true, thumbnail: picsum("money-train-3"), tags: ["buy-bonus"] },
  { id: "rg-temple", name: "Temple Tumble Megaways", provider: "Relax Gaming", category: "slots", rtp: "96.70%", thumbnail: picsum("temple-tumble") },
  { id: "bg-book", name: "Book of Cats", provider: "BGaming", category: "slots", rtp: "96.00%", isNew: true, thumbnail: picsum("book-of-cats-bg"), demoUrl: bgDemo("BookOfCats") },
  { id: "bg-elvis", name: "Elvis Frog", provider: "BGaming", category: "slots", rtp: "96.10%", isHot: true, thumbnail: picsum("elvis-frog-bg"), demoUrl: bgDemo("ElvisFrog") },
  { id: "push-razor", name: "Razor Shark", provider: "Push Gaming", category: "slots", rtp: "96.70%", thumbnail: picsum("razor-shark") },
  { id: "push-jammin", name: "Jammin' Jars 2", provider: "Push Gaming", category: "slots", rtp: "96.50%", isHot: true, thumbnail: picsum("jammin-jars-2") },
  { id: "wms-zeus", name: "Zeus Ancient Fortunes", provider: "WMS", category: "slots", rtp: "96.01%", thumbnail: picsum("zeus-ancient-fortunes") },
  { id: "igt-cleopatra", name: "Cleopatra Plus", provider: "IGT", category: "slots", rtp: "95.71%", thumbnail: picsum("cleopatra-igt") },

  // ── JACKPOT ─────────────────────────────────────────────────────────────────
  { id: "pp-money", name: "Money Train 2", provider: "Relax Gaming", category: "jackpot", rtp: "96.40%", thumbnail: picsum("money-train-2") },
  { id: "mg-divine", name: "Divine Fortune", provider: "NetEnt", category: "jackpot", rtp: "96.59%", isHot: true, thumbnail: picsum("divine-fortune"), tags: ["progressive"] },
  { id: "pp-fireblaze", name: "Fire Blaze Jackpots", provider: "Playtech", category: "jackpot", rtp: "95.17%", thumbnail: picsum("fire-blaze-jackpot") },

  // ── CRASH GAMES ─────────────────────────────────────────────────────────────
  { id: "sp-aviator", name: "Aviator", provider: "Spribe", category: "crash", isHot: true, thumbnail: picsum("aviator-spribe"), minBet: "৳10", maxBet: "৳1,00,000", tags: ["multiplier", "provably-fair"] },
  { id: "sm-jetx", name: "JetX", provider: "SmartSoft Gaming", category: "crash", isNew: true, thumbnail: picsum("jetx-smartsoft"), minBet: "৳10", maxBet: "৳50,000" },
  { id: "sp-miniroulette", name: "Mini Roulette", provider: "Spribe", category: "crash", thumbnail: picsum("mini-roulette-spribe") },
  { id: "sp-dice", name: "Dice", provider: "Spribe", category: "crash", thumbnail: picsum("dice-spribe"), tags: ["provably-fair"] },
  { id: "sp-plinko", name: "Plinko", provider: "Spribe", category: "crash", isNew: true, thumbnail: picsum("plinko-spribe") },
  { id: "sm-balloonx", name: "Balloon X", provider: "SmartSoft Gaming", category: "crash", thumbnail: picsum("balloon-x-smartsoft") },

  // ── LIVE CASINO ─────────────────────────────────────────────────────────────
  { id: "evo-lroul", name: "Lightning Roulette", provider: "Evolution Gaming", category: "live", subCategory: "roulette", rtp: "97.30%", isHot: true, isLive: true, players: 142, thumbnail: picsum("lightning-roulette-evo"), tags: ["multiplier"] },
  { id: "evo-crazy", name: "Crazy Time", provider: "Evolution Gaming", category: "live", subCategory: "game-shows", isHot: true, isLive: true, players: 873, thumbnail: picsum("crazy-time-evolution"), tags: ["game-show"] },
  { id: "evo-monopoly", name: "Monopoly Live", provider: "Evolution Gaming", category: "live", subCategory: "game-shows", isHot: true, isLive: true, players: 421, thumbnail: picsum("monopoly-live-evo"), tags: ["game-show"] },
  { id: "evo-megaball", name: "Mega Ball", provider: "Evolution Gaming", category: "live", subCategory: "game-shows", isNew: true, isLive: true, players: 512, thumbnail: picsum("mega-ball-evolution") },
  { id: "evo-baccvip", name: "Speed Baccarat A", provider: "Evolution Gaming", category: "live", subCategory: "baccarat", isHot: true, isLive: true, players: 67, thumbnail: picsum("speed-baccarat-a-evo") },
  { id: "evo-bjoklahoma", name: "Blackjack VIP A", provider: "Evolution Gaming", category: "live", subCategory: "blackjack", isLive: true, players: 7, minBet: "৳5,000", maxBet: "৳50,00,000", thumbnail: picsum("blackjack-vip-a-evo") },
  { id: "evo-imm", name: "Immersive Roulette", provider: "Evolution Gaming", category: "live", subCategory: "roulette", isHot: true, isLive: true, players: 210, thumbnail: picsum("immersive-roulette-evo") },
  { id: "evo-dragontiger", name: "Dragon Tiger", provider: "Evolution Gaming", category: "live", subCategory: "baccarat", isLive: true, players: 88, thumbnail: picsum("dragon-tiger-evo") },
  { id: "evo-powbj", name: "Power Blackjack", provider: "Evolution Gaming", category: "live", subCategory: "blackjack", isNew: true, isLive: true, players: 14, thumbnail: picsum("power-blackjack-evo") },
  { id: "evo-xxxlightning", name: "XXXtreme Lightning Roulette", provider: "Evolution Gaming", category: "live", subCategory: "roulette", isLive: true, players: 65, thumbnail: picsum("xxxtreme-lightning-evo") },
  { id: "evo-sic", name: "Sic Bo", provider: "Evolution Gaming", category: "live", subCategory: "table", isLive: true, players: 33, thumbnail: picsum("sic-bo-evolution") },
  { id: "evo-holdem", name: "Casino Hold'em", provider: "Evolution Gaming", category: "live", subCategory: "poker", isLive: true, players: 22, thumbnail: picsum("casino-holdem-evo") },
  { id: "evo-football", name: "Football Studio", provider: "Evolution Gaming", category: "live", subCategory: "game-shows", isLive: true, players: 156, thumbnail: picsum("football-studio-evo") },
  { id: "evo-caribbean", name: "Caribbean Stud Poker", provider: "Evolution Gaming", category: "live", subCategory: "poker", isLive: true, players: 11, thumbnail: picsum("caribbean-stud-evo") },
  { id: "pt-quantum", name: "Quantum Roulette", provider: "Playtech", category: "live", subCategory: "roulette", isHot: true, isLive: true, players: 95, thumbnail: picsum("quantum-roulette-pt") },
  { id: "pt-age-gods", name: "Age of the Gods Roulette", provider: "Playtech", category: "live", subCategory: "roulette", isLive: true, players: 44, thumbnail: picsum("age-gods-roulette") },
  { id: "ez-roulette", name: "Ezugi Roulette", provider: "Ezugi", category: "live", subCategory: "roulette", isLive: true, players: 77, thumbnail: picsum("ezugi-roulette") },
  { id: "ez-oneday", name: "One Day Teen Patti", provider: "Ezugi", category: "live", subCategory: "table", isNew: true, isLive: true, players: 203, thumbnail: picsum("teen-patti-ezugi"), tags: ["teen-patti"] },
  { id: "pp-live-roul", name: "Roulette", provider: "Pragmatic Play Live", category: "live", subCategory: "roulette", isLive: true, players: 131, thumbnail: picsum("pp-live-roulette") },
  { id: "pp-live-bac", name: "Speed Baccarat", provider: "Pragmatic Play Live", category: "live", subCategory: "baccarat", isLive: true, players: 89, thumbnail: picsum("pp-live-baccarat") },

  // ── TABLE GAMES ─────────────────────────────────────────────────────────────
  { id: "tbl-eur-roul", name: "European Roulette", provider: "NetEnt", category: "roulette", rtp: "97.30%", thumbnail: picsum("european-roulette-net") },
  { id: "tbl-fr-roul", name: "French Roulette", provider: "NetEnt", category: "roulette", rtp: "98.65%", thumbnail: picsum("french-roulette-net"), tags: ["high-rtp"] },
  { id: "tbl-am-roul", name: "American Roulette", provider: "Playtech", category: "roulette", rtp: "94.74%", thumbnail: picsum("american-roulette-pt") },
  { id: "tbl-bj", name: "Classic Blackjack", provider: "Microgaming", category: "blackjack", rtp: "99.50%", thumbnail: picsum("classic-blackjack-mg") },
  { id: "tbl-bj-vip", name: "Blackjack VIP", provider: "Playtech", category: "blackjack", rtp: "99.60%", thumbnail: picsum("blackjack-vip-playtech") },
  { id: "tbl-bj-atlantic", name: "Atlantic City Blackjack", provider: "Microgaming", category: "blackjack", rtp: "99.65%", thumbnail: picsum("atlantic-city-blackjack"), tags: ["high-rtp"] },
  { id: "tbl-bac", name: "Punto Banco Baccarat", provider: "NetEnt", category: "baccarat", rtp: "98.94%", thumbnail: picsum("punto-banco-net") },
  { id: "tbl-poker-3c", name: "3 Card Poker", provider: "Playtech", category: "poker", rtp: "97.99%", thumbnail: picsum("3-card-poker-pt") },
  { id: "tbl-casino-holdem", name: "Casino Hold'em", provider: "Playtech", category: "poker", rtp: "99.18%", thumbnail: picsum("casino-holdem-pt") },
  { id: "tbl-war", name: "Casino War", provider: "Playtech", category: "table", rtp: "97.05%", thumbnail: picsum("casino-war-pt") },
];

router.get("/casino/games", (req, res) => {
  const { category, provider, search, isLive, isHot, isNew, page = "1", limit = "40" } = req.query as Record<string, string>;

  let result = [...GAMES];

  if (category && category !== "all") {
    result = result.filter(g => g.category === category);
  }
  if (provider && provider !== "all") {
    result = result.filter(g => g.provider.toLowerCase().includes(provider.toLowerCase()));
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(g =>
      g.name.toLowerCase().includes(q) ||
      g.provider.toLowerCase().includes(q) ||
      (g.tags || []).some(t => t.includes(q))
    );
  }
  if (isLive === "true") result = result.filter(g => g.isLive);
  if (isHot === "true") result = result.filter(g => g.isHot);
  if (isNew === "true") result = result.filter(g => g.isNew);

  const pageNum = Math.max(1, parseInt(page));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
  const total = result.length;
  const paginated = result.slice((pageNum - 1) * limitNum, pageNum * limitNum);

  const providers = [...new Set(GAMES.map(g => g.provider))].sort();
  const categories = [...new Set(GAMES.map(g => g.category))];

  res.json({
    games: paginated,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      pages: Math.ceil(total / limitNum),
      providers,
      categories,
    },
  });
});

router.get("/casino/games/:id", (req, res) => {
  const game = GAMES.find(g => g.id === req.params.id);
  if (!game) return res.status(404).json({ error: "Game not found" });
  res.json(game);
});

export default router;
