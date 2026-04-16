import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BetslipPanel from "@/components/BetslipPanel";
import SportsSidebar from "@/components/SportsSidebar";
import RealMatchCard from "@/components/RealMatchCard";
import { normalizeEvent } from "@/lib/sportsData";
import { Search, RefreshCw, ChevronDown, ChevronUp, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface SportGroup {
  icon: string;
  sports: {
    sportKey: string;
    sportTitle: string;
    events: any[];
  }[];
}

async function fetchAllOdds(): Promise<Record<string, SportGroup>> {
  const BASE = import.meta.env.BASE_URL?.replace(/\/$/, "") ?? "";
  const res = await fetch(`${BASE}/api/odds/all?regions=us,uk,eu&markets=h2h`);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const msg = body?.error ?? "Failed to fetch odds";
    const code = body?.error_code ?? "";
    const err: any = new Error(msg);
    err.error_code = code;
    err.status = res.status;
    throw err;
  }
  return res.json();
}

function MatchSkeleton() {
  return (
    <div className="bg-card border border-card-border rounded-lg p-3 space-y-2 animate-pulse">
      <Skeleton className="h-3 w-1/2 bg-muted" />
      <Skeleton className="h-4 w-3/4 bg-muted" />
      <Skeleton className="h-4 w-2/3 bg-muted" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-10 flex-1 bg-muted" />
        <Skeleton className="h-10 flex-1 bg-muted" />
      </div>
    </div>
  );
}

const GROUP_ORDER = ["Cricket", "Soccer", "Basketball", "Ice Hockey", "Tennis", "Baseball", "MMA", "Rugby", "American Football", "Other"];

export default function AllSportsPage() {
  const [search, setSearch] = useState("");
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(["Cricket", "Soccer"]));

  const { data, isLoading, isFetching, isError, error, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["odds-all"],
    queryFn: fetchAllOdds,
    staleTime: 3 * 60 * 1000,
    retry: 1,
  });

  const toggleGroup = (group: string) => {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      next.has(group) ? next.delete(group) : next.add(group);
      return next;
    });
  };

  const totalMatches = useMemo(() => {
    if (!data) return 0;
    return Object.values(data).flatMap((g) => g.sports).reduce((acc, s) => acc + s.events.length, 0);
  }, [data]);

  const sortedGroups = useMemo(() => {
    if (!data) return [];
    return GROUP_ORDER.filter((g) => g in data).concat(Object.keys(data).filter((g) => !GROUP_ORDER.includes(g)));
  }, [data]);

  const filteredData = useMemo(() => {
    if (!data || !search.trim()) return data;
    const q = search.toLowerCase();
    const result: Record<string, SportGroup> = {};
    for (const [group, g] of Object.entries(data)) {
      const filtered = g.sports.map((s) => ({
        ...s,
        events: s.events.filter(
          (e: any) =>
            e.home_team?.toLowerCase().includes(q) ||
            e.away_team?.toLowerCase().includes(q) ||
            s.sportTitle?.toLowerCase().includes(q)
        ),
      })).filter((s) => s.events.length > 0);
      if (filtered.length > 0) result[group] = { ...g, sports: filtered };
    }
    return result;
  }, [data, search]);

  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Page header */}
        <div className="bg-[hsl(210_65%_10%)] border-b border-[hsl(210_40%_18%)] px-4 py-4">
          <div className="max-w-full mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-[hsl(210_100%_56%)]" />
                <div>
                  <h1 className="text-2xl font-black text-white">All Sports — Live Odds</h1>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {isLoading
                      ? "Loading all markets..."
                      : `${totalMatches} matches across ${sortedGroups.length} sports · cached 3 min`}
                    {lastUpdated && !isLoading && (
                      <span className="ml-2 text-green-400">Updated {lastUpdated}</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search teams or leagues..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 bg-[hsl(210_60%_14%)] border-[hsl(210_40%_22%)] text-base"
                    data-testid="input-search-all-sports"
                  />
                </div>
                <button
                  onClick={() => refetch()}
                  className={`p-2 rounded bg-[hsl(210_50%_18%)] text-muted-foreground hover:text-white border border-[hsl(210_40%_22%)] transition-colors ${isFetching ? "animate-spin" : ""}`}
                  data-testid="button-refresh-all"
                  title="Refresh all odds"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick expand/collapse all */}
            {!isLoading && data && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <button
                  onClick={() => setOpenGroups(new Set(sortedGroups))}
                  className="hover:text-white transition-colors"
                  data-testid="button-expand-all"
                >
                  Expand all
                </button>
                <span>·</span>
                <button
                  onClick={() => setOpenGroups(new Set())}
                  className="hover:text-white transition-colors"
                  data-testid="button-collapse-all"
                >
                  Collapse all
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="max-w-full mx-auto px-3 sm:px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
            <div className="space-y-3">
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {Array.from({ length: 8 }).map((_, i) => <MatchSkeleton key={i} />)}
                </div>
              ) : isError ? (
                <div className="text-center py-16 text-muted-foreground bg-card border border-card-border rounded-lg">
                  <Globe className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold text-white mb-1">Odds unavailable</p>
                  {(error as any)?.error_code === "OUT_OF_USAGE_CREDITS" ? (
                    <p className="text-base max-w-xs mx-auto">
                      The odds API quota has been reached. Please update the <code className="text-[#ffba00]">ODDS_API_KEY</code> with a fresh key from{" "}
                      <a href="https://the-odds-api.com" target="_blank" rel="noreferrer" className="text-[#ffba00] underline">the-odds-api.com</a>.
                    </p>
                  ) : (
                    <p className="text-base">{(error as any)?.message ?? "Could not load odds. Please try again."}</p>
                  )}
                  <button
                    onClick={() => refetch()}
                    className="mt-4 px-4 py-2 rounded text-base font-bold text-[hsl(214_42%_9%)] transition-colors"
                    style={{ background: "#ffba00" }}
                  >
                    Retry
                  </button>
                </div>
              ) : !filteredData || Object.keys(filteredData).length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Globe className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-semibold text-white">
                    {search ? "No matches found" : "No live odds right now"}
                  </p>
                  <p className="text-base mt-1">
                    {search ? "Try a different search term" : "Check back soon"}
                  </p>
                </div>
              ) : (
                sortedGroups
                  .filter((g) => filteredData && g in filteredData)
                  .map((group) => {
                    const groupData = filteredData![group];
                    const groupMatches = groupData.sports.flatMap((s) => s.events);
                    const isOpen = openGroups.has(group) || !!search.trim();

                    return (
                      <div key={group} className="bg-card border border-card-border rounded-lg overflow-hidden" data-testid={`sport-group-${group.toLowerCase().replace(/\s/g, "-")}`}>
                        {/* Group header */}
                        <button
                          onClick={() => toggleGroup(group)}
                          className="w-full flex items-center justify-between px-4 py-3 bg-[hsl(210_60%_12%)] hover:bg-[hsl(210_55%_14%)] transition-colors"
                          data-testid={`group-toggle-${group.toLowerCase().replace(/\s/g, "-")}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{groupData.icon}</span>
                            <div className="text-left">
                              <span className="text-base font-bold text-white">{group}</span>
                              <span className="ml-2 text-sm text-muted-foreground">
                                {groupMatches.length} match{groupMatches.length !== 1 ? "es" : ""}
                                {" · "}
                                {groupData.sports.length} league{groupData.sports.length !== 1 ? "s" : ""}
                              </span>
                            </div>
                          </div>
                          {isOpen && !search.trim()
                            ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
                            : <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          }
                        </button>

                        {/* Matches */}
                        {isOpen && (
                          <div className="p-3 space-y-4">
                            {groupData.sports.map((sport) => (
                              <div key={sport.sportKey}>
                                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-0.5">
                                  {groupData.icon} {sport.sportTitle}
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                  {sport.events.map((event: any) => (
                                    <RealMatchCard key={event.id} match={normalizeEvent(event)} />
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
              )}
            </div>

            <aside className="hidden lg:block">
              <div className="sticky top-20">
                <BetslipPanel />

                {/* Live quota indicator */}
                <div className="mt-3 bg-card border border-card-border rounded-lg p-3">
                  <p className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    API Status
                  </p>
                  <p className="text-sm text-muted-foreground">Odds refresh every 3 minutes server-side. Results are cached to preserve API quota.</p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
