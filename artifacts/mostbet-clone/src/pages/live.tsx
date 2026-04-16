import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BetslipPanel from "@/components/BetslipPanel";
import RealMatchCard from "@/components/RealMatchCard";
import { useGetScores, useGetOdds } from "@workspace/api-client-react";
import { normalizeEvent, getSportIcon, POPULAR_SPORTS } from "@/lib/sportsData";
import { getLiveMockMatches, getMockMatchesBySport } from "@/lib/mockMatches";
import type { ScoreEvent } from "@workspace/api-client-react";
import { RefreshCw } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const LIVE_SPORTS = POPULAR_SPORTS.slice(0, 8);

function getLiveScore(scores: ScoreEvent[], eventId: string, homeTeam: string, awayTeam: string) {
  const score = scores.find((s) => s.id === eventId);
  if (!score || !score.scores) return null;
  const home = score.scores.find((s) => s.name === homeTeam);
  const away = score.scores.find((s) => s.name === awayTeam);
  if (!home || !away) return null;
  return { home: home.score, away: away.score };
}

function MatchSkeleton() {
  return (
    <div className="bg-card border border-card-border rounded-lg overflow-hidden p-3 space-y-2 animate-pulse">
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

export default function LivePage() {
  const [selectedSport, setSelectedSport] = useState(LIVE_SPORTS[0]);

  const { data: oddsData, isLoading: oddsLoading, isFetching, refetch } = useGetOdds(
    { sport: selectedSport.key, regions: "us,uk,eu", markets: "h2h" },
    { query: { retry: 1, staleTime: 30_000, refetchInterval: 60_000 } }
  );

  const { data: scoresData, isLoading: scoresLoading } = useGetScores(
    { sport: selectedSport.key, daysFrom: 1 },
    { query: { retry: 1, staleTime: 30_000, refetchInterval: 30_000 } }
  );

  const apiMatches = (oddsData ?? []).map(normalizeEvent);
  // Fallback to rich mock data when API unavailable
  const allMatches = apiMatches.length > 0 ? apiMatches : getMockMatchesBySport(selectedSport.key);

  const liveMatches = allMatches.length > 0 ? allMatches.filter((m) => m.isLive) : getLiveMockMatches();
  const upcomingMatches = allMatches.filter((m) => !m.isLive).slice(0, 6);
  const scores = scoresData ?? [];

  const liveCount = liveMatches.length;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Header */}
        <div className="bg-[hsl(210_65%_10%)] border-b border-[hsl(210_40%_18%)] px-4 py-4">
          <div className="max-w-full mx-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 live-dot" />
                  <h1 className="text-2xl font-bold text-white">Live Betting</h1>
                </div>
                {liveCount > 0 && (
                  <span className="px-2 py-0.5 text-sm font-bold rounded bg-red-500 text-white" data-testid="live-count-badge">
                    {liveCount} LIVE
                  </span>
                )}
              </div>
              <button
                onClick={() => refetch()}
                className={`p-2 rounded bg-[hsl(210_50%_18%)] text-muted-foreground hover:text-white border border-[hsl(210_40%_22%)] transition-colors ${isFetching ? "animate-spin" : ""}`}
                data-testid="button-refresh-live"
                title="Refresh live data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Sport tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {LIVE_SPORTS.map((sport) => (
                <button
                  key={sport.key}
                  onClick={() => setSelectedSport(sport)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-base font-medium transition-colors ${
                    selectedSport.key === sport.key
                      ? "bg-red-500 text-white"
                      : "bg-[hsl(210_50%_18%)] text-muted-foreground hover:text-white"
                  }`}
                  data-testid={`live-sport-${sport.key}`}
                >
                  {sport.icon} {sport.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-full mx-auto px-3 sm:px-4 py-4">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_240px] gap-4">
            <div className="space-y-5">
              {/* Live now */}
              <section>
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-2 h-2 rounded-full bg-red-500 live-dot" />
                  <h2 className="text-base font-bold text-white uppercase tracking-wide">In-Play Now</h2>
                  {liveCount > 0 && (
                    <span className="text-sm px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 font-semibold">
                      {liveCount}
                    </span>
                  )}
                </div>
                {oddsLoading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {Array.from({ length: 4 }).map((_, i) => <MatchSkeleton key={i} />)}
                  </div>
                ) : liveMatches.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {liveMatches.map((match) => (
                      <RealMatchCard
                        key={match.id}
                        match={match}
                        liveScore={getLiveScore(scores, match.id, match.homeTeam, match.awayTeam)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="bg-card border border-card-border rounded-lg p-8 text-center">
                    <div className="text-3xl mb-2">{getSportIcon(selectedSport.key)}</div>
                    <p className="text-white font-semibold">No live matches right now</p>
                    <p className="text-sm text-muted-foreground mt-1">Check upcoming matches below</p>
                  </div>
                )}
              </section>

              {/* Starting soon */}
              {upcomingMatches.length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-base font-bold text-white uppercase tracking-wide">Starting Soon</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {upcomingMatches.map((match) => (
                      <RealMatchCard key={match.id} match={match} />
                    ))}
                  </div>
                </section>
              )}

              {/* Scores from API */}
              {!scoresLoading && scores.filter((s) => s.completed).length > 0 && (
                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <h2 className="text-base font-bold text-muted-foreground uppercase tracking-wide">Recent Results</h2>
                  </div>
                  <div className="space-y-1.5">
                    {scores
                      .filter((s) => s.completed && s.scores)
                      .slice(0, 5)
                      .map((event) => {
                        const homeScore = event.scores?.find((s) => s.name === event.home_team);
                        const awayScore = event.scores?.find((s) => s.name === event.away_team);
                        return (
                          <div
                            key={event.id}
                            className="bg-card border border-card-border rounded-lg px-3 py-2.5 flex items-center justify-between"
                            data-testid={`result-${event.id}`}
                          >
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-muted-foreground mb-1">{event.sport_title}</p>
                              <div className="flex items-center justify-between gap-4">
                                <span className="text-base font-medium text-white truncate">{event.home_team}</span>
                                <span className="text-base font-bold text-white tabular-nums">
                                  {homeScore?.score ?? "—"} – {awayScore?.score ?? "—"}
                                </span>
                                <span className="text-base font-medium text-white truncate text-right">{event.away_team}</span>
                              </div>
                            </div>
                            <span className="ml-3 px-2 py-0.5 text-[13px] font-bold rounded bg-[hsl(210_50%_18%)] text-muted-foreground shrink-0">
                              FT
                            </span>
                          </div>
                        );
                      })}
                  </div>
                </section>
              )}
            </div>

            <aside className="hidden lg:block">
              <BetslipPanel />
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
