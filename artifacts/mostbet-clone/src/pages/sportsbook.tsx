import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BetslipPanel from "@/components/BetslipPanel";
import SportsSidebar from "@/components/SportsSidebar";
import RealMatchCard from "@/components/RealMatchCard";
import { useGetOdds, useListSports } from "@workspace/api-client-react";
import { normalizeEvent, getSportIcon, POPULAR_SPORTS } from "@/lib/sportsData";
import { getMockMatchesBySport } from "@/lib/mockMatches";
import { Search, RefreshCw, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

function MatchSkeleton() {
  return (
    <div className="rounded-sm p-3 space-y-2" style={{ background: "hsl(214 32% 15%)", border: "1px solid hsl(214 28% 18%)" }}>
      <Skeleton className="h-3 w-3/4 bg-[hsl(214_28%_20%)]" />
      <Skeleton className="h-4 w-1/2 bg-[hsl(214_28%_20%)]" />
      <Skeleton className="h-4 w-1/2 bg-[hsl(214_28%_20%)]" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-9 flex-1 bg-[hsl(214_28%_20%)]" />
        <Skeleton className="h-9 flex-1 bg-[hsl(214_28%_20%)]" />
        <Skeleton className="h-9 flex-1 bg-[hsl(214_28%_20%)]" />
      </div>
    </div>
  );
}

export default function SportsbookPage() {
  const [selectedSport, setSelectedSport] = useState(POPULAR_SPORTS[0]);
  const [search, setSearch] = useState("");

  const { data: sports } = useListSports();

  const { data: oddsData, isLoading: oddsLoading, isFetching, refetch } = useGetOdds(
    { sport: selectedSport.key, regions: "us,uk,eu", markets: "h2h" },
    { query: { retry: 1, staleTime: 60_000 } }
  );

  const apiMatches = (oddsData ?? []).map(normalizeEvent);
  // Fallback to rich mock data when API is unavailable
  const allMatches = apiMatches.length > 0 ? apiMatches : getMockMatchesBySport(selectedSport.key);

  const filtered = allMatches.filter(
    (m) =>
      m.homeTeam.toLowerCase().includes(search.toLowerCase()) ||
      m.awayTeam.toLowerCase().includes(search.toLowerCase())
  );

  const apiSports = sports?.filter((s) => s.active && !s.has_outrights) ?? [];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "hsl(214 36% 12%)" }}>
      <Header />

      <main className="flex-1">
        <div className="max-w-full mx-auto px-3 sm:px-4 py-3">
          <div className="flex gap-3">
            {/* Left sidebar */}
            <SportsSidebar />

            {/* Center content */}
            <div className="flex-1 min-w-0">
              {/* Sport selector breadcrumb */}
              <div
                className="rounded-sm p-2.5 mb-3 flex items-center gap-2 text-[14px]"
                style={{ background: "hsl(214 38% 10%)", border: "1px solid hsl(214 28% 16%)" }}
              >
                <span className="text-[hsl(214_15%_45%)]">Sports</span>
                <ChevronRight className="w-3 h-3 text-[hsl(214_15%_35%)]" />
                <span className="text-[#ffba00] font-semibold">
                  {getSportIcon(selectedSport.key)} {selectedSport.label}
                </span>
                <span className="ml-auto text-[hsl(214_15%_40%)]">
                  {oddsLoading ? "Loading..." : `${filtered.length} matches`}
                </span>
              </div>

              {/* Sport tabs */}
              <div
                className="rounded-sm p-2 mb-3"
                style={{ background: "hsl(214 38% 10%)", border: "1px solid hsl(214 28% 16%)" }}
              >
                <div className="flex flex-wrap gap-1">
                  {POPULAR_SPORTS.slice(0, 10).map((sport) => (
                    <button
                      key={sport.key}
                      onClick={() => { setSelectedSport(sport); setSearch(""); }}
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-[14px] font-medium transition-all"
                      style={
                        selectedSport.key === sport.key
                          ? { background: "#ffba00", color: "hsl(214 42% 9%)", fontWeight: 700 }
                          : { background: "hsl(214 30% 16%)", color: "hsl(214 10% 68%)" }
                      }
                      data-testid={`sport-tab-${sport.key}`}
                    >
                      {sport.icon} {sport.label}
                    </button>
                  ))}
                  {apiSports
                    .filter((s) => !POPULAR_SPORTS.find((p) => p.key === s.key))
                    .slice(0, 5)
                    .map((sport) => (
                      <button
                        key={sport.key}
                        onClick={() => {
                          setSelectedSport({ key: sport.key, label: sport.title, icon: getSportIcon(sport.key), group: sport.group });
                          setSearch("");
                        }}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-sm text-[14px] font-medium transition-all"
                        style={
                          selectedSport.key === sport.key
                            ? { background: "#ffba00", color: "hsl(214 42% 9%)", fontWeight: 700 }
                            : { background: "hsl(214 30% 16%)", color: "hsl(214 10% 68%)" }
                        }
                        data-testid={`sport-tab-api-${sport.key}`}
                      >
                        {getSportIcon(sport.key)} {sport.title}
                      </button>
                    ))}
                </div>
              </div>

              {/* Search + controls */}
              <div className="flex items-center gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[hsl(214_15%_45%)]" />
                  <Input
                    placeholder="Search teams or leagues..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 text-[14px] h-8"
                    style={{ background: "hsl(214 38% 10%)", borderColor: "hsl(214 28% 18%)" }}
                    data-testid="input-search-sports"
                  />
                </div>
                <button
                  onClick={() => refetch()}
                  className="p-2 rounded-sm text-[hsl(214_15%_48%)] hover:text-white transition-colors"
                  style={{ background: "hsl(214 38% 10%)", border: "1px solid hsl(214 28% 18%)" }}
                  data-testid="button-refresh-odds"
                  title="Refresh odds"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
                </button>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                  <span className="text-[14px] text-green-400">Live odds</span>
                </div>
              </div>

              {/* Matches grid */}
              {oddsLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => <MatchSkeleton key={i} />)}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filtered.map((match) => (
                    <RealMatchCard key={match.id} match={match} />
                  ))}
                  {filtered.length === 0 && (
                    <div
                      className="col-span-2 text-center py-16 rounded-sm"
                      style={{ background: "hsl(214 32% 15%)", border: "1px solid hsl(214 28% 18%)" }}
                    >
                      <div className="text-4xl mb-3">{getSportIcon(selectedSport.key)}</div>
                      <p className="font-semibold text-white text-[16px]">No matches found</p>
                      <p className="text-[14px] text-[hsl(214_15%_45%)] mt-1">
                        {search ? "Try a different search term" : "Check back soon for upcoming fixtures"}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right betslip */}
            <aside className="w-[230px] shrink-0 hidden lg:block">
              <div className="sticky top-[109px]">
                <BetslipPanel />
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
