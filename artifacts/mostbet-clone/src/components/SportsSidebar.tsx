import { Link, useLocation } from "wouter";
import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";

interface SportItem {
  key: string;
  label: string;
  icon: string;
  href: string;
  count: number;
}

const SPORTS: SportItem[] = [
  { key: "soccer", label: "Football", icon: "⚽", href: "/sportsbook/soccer_epl", count: 284 },
  { key: "cricket", label: "Cricket", icon: "🏏", href: "/sportsbook/cricket_ipl", count: 47 },
  { key: "basketball", label: "Basketball", icon: "🏀", href: "/sportsbook/basketball_nba", count: 62 },
  { key: "tennis", label: "Tennis", icon: "🎾", href: "/sportsbook/tennis_atp_french_open", count: 38 },
  { key: "icehockey", label: "Ice Hockey", icon: "🏒", href: "/sportsbook/icehockey_nhl", count: 24 },
  { key: "baseball", label: "Baseball", icon: "⚾", href: "/sportsbook/baseball_mlb", count: 18 },
  { key: "americanfootball", label: "Amer. Football", icon: "🏈", href: "/sportsbook/americanfootball_nfl", count: 12 },
  { key: "mma", label: "MMA / UFC", icon: "🥊", href: "/sportsbook/mma_mixed_martial_arts", count: 9 },
  { key: "rugby", label: "Rugby", icon: "🏉", href: "/sportsbook/rugbyleague_uk_super_league", count: 14 },
  { key: "volleyball", label: "Volleyball", icon: "🏐", href: "/sportsbook/volleyball", count: 22 },
  { key: "esports", label: "eSports", icon: "🎮", href: "/esports", count: 31 },
  { key: "boxing", label: "Boxing", icon: "🥋", href: "/sportsbook/boxing", count: 6 },
  { key: "golf", label: "Golf", icon: "⛳", href: "/sportsbook/golf", count: 8 },
  { key: "tabletennis", label: "Table Tennis", icon: "🏓", href: "/sportsbook/tabletennis", count: 55 },
  { key: "handball", label: "Handball", icon: "🤾", href: "/sportsbook/handball", count: 29 },
  { key: "cycling", label: "Cycling", icon: "🚴", href: "/sportsbook/cycling", count: 4 },
  { key: "darts", label: "Darts", icon: "🎯", href: "/sportsbook/darts", count: 7 },
  { key: "snooker", label: "Snooker", icon: "🎱", href: "/sportsbook/snooker", count: 5 },
];

export default function SportsSidebar() {
  const [location] = useLocation();
  const [showAll, setShowAll] = useState(false);

  const displayed = showAll ? SPORTS : SPORTS.slice(0, 10);

  const isActive = (key: string) =>
    location.includes(key) || (key === "soccer" && location.includes("soccer"));

  return (
    <aside className="w-[196px] shrink-0 hidden lg:flex flex-col">
      <div className="sticky top-[109px]">
        {/* Sports section */}
        <div className="bg-[hsl(214_38%_10%)] border border-[hsl(214_28%_16%)] rounded-sm overflow-hidden mb-1">
          <div className="px-3 py-2 bg-[hsl(214_42%_8%)] border-b border-[hsl(214_28%_14%)] flex items-center justify-between">
            <span className="text-[13px] font-bold text-[hsl(214_15%_48%)] uppercase tracking-widest">Sports</span>
          </div>
          <nav>
            {displayed.map((sport) => {
              const active = isActive(sport.key);
              return (
                <Link key={sport.key} href={sport.href}>
                  <div
                    data-testid={`sidebar-sport-${sport.key}`}
                    className={`flex items-center gap-2 px-2.5 py-[7px] cursor-pointer transition-all group relative ${
                      active
                        ? "bg-[rgba(255,186,0,0.1)]"
                        : "hover:bg-[hsl(214_30%_15%)]"
                    }`}
                  >
                    {active && (
                      <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#ffba00] rounded-r" />
                    )}
                    <span className="text-[17px] leading-none shrink-0 ml-1">{sport.icon}</span>
                    <span
                      className={`flex-1 text-[15px] font-medium truncate ${
                        active ? "text-[#ffba00]" : "text-[hsl(214_8%_78%)] group-hover:text-white"
                      }`}
                    >
                      {sport.label}
                    </span>
                    <span
                      className={`text-[14px] font-semibold tabular-nums shrink-0 ${
                        active ? "text-[#ffba00]" : "text-[hsl(214_15%_42%)]"
                      }`}
                    >
                      {sport.count}
                    </span>
                  </div>
                </Link>
              );
            })}
          </nav>
          <button
            onClick={() => setShowAll(!showAll)}
            className="flex items-center gap-1.5 w-full px-3 py-2 text-[14px] text-[hsl(214_15%_48%)] hover:text-[#ffba00] transition-colors border-t border-[hsl(214_28%_14%)]"
          >
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAll ? "rotate-180" : ""}`} />
            {showAll ? "Show less" : `All sports (${SPORTS.length})`}
          </button>
        </div>

        {/* Quick access */}
        <div className="bg-[hsl(214_38%_10%)] border border-[hsl(214_28%_16%)] rounded-sm overflow-hidden">
          {[
            { label: "Live Betting", icon: "🔴", href: "/live" },
            { label: "Virtual Sports", icon: "🕹️", href: "/virtual-sports" },
            { label: "Casino", icon: "🎰", href: "/casino" },
            { label: "Live Casino", icon: "🃏", href: "/live-casino" },
            { label: "Promotions", icon: "🎁", href: "/promotions" },
          ].map((item) => {
            const active = location === item.href;
            return (
              <Link key={item.label} href={item.href}>
                <div
                  className={`flex items-center gap-2 px-2.5 py-[7px] cursor-pointer transition-all group relative ${
                    active ? "bg-[rgba(255,186,0,0.1)]" : "hover:bg-[hsl(214_30%_15%)]"
                  }`}
                >
                  {active && (
                    <span className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#ffba00] rounded-r" />
                  )}
                  <span className="text-[17px] leading-none shrink-0 ml-1">{item.icon}</span>
                  <span className={`text-[15px] font-medium ${active ? "text-[#ffba00]" : "text-[hsl(214_8%_78%)] group-hover:text-white"}`}>
                    {item.label}
                  </span>
                  {item.label === "Live Betting" && (
                    <span className="ml-auto text-[12px] font-bold px-1 py-0.5 bg-red-500 text-white rounded animate-pulse">LIVE</span>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
