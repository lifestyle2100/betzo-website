import { useState } from "react";
import { X, Trash2, Plus, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useBetslip } from "@/context/BetslipContext";
import { useLang } from "@/context/LanguageContext";

export default function BetslipPanel() {
  const { bets, removeBet, clearAll } = useBetslip();
  const { t } = useLang();
  const [stake, setStake] = useState("500");
  const [tab, setTab] = useState<"single" | "combo">("single");

  const totalOdds = bets.reduce((acc, b) => acc * b.odds, 1);
  const stakeNum = parseFloat(stake) || 0;
  const potentialWin = (stakeNum * totalOdds).toFixed(2);

  return (
    <div
      className="rounded-sm overflow-hidden"
      style={{ background: "hsl(214 38% 10%)", border: "1px solid hsl(214 28% 16%)" }}
      data-testid="betslip-panel"
    >
      {/* Header */}
      <div
        className="px-3 py-2.5 flex items-center justify-between border-b"
        style={{ background: "hsl(214 42% 8%)", borderColor: "hsl(214 28% 14%)" }}
      >
        <h3 className="text-[14px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
          {t.common.betSlip}
          {bets.length > 0 && (
            <span
              className="px-1.5 py-0.5 text-[13px] rounded-full font-bold text-[hsl(214_42%_9%)]"
              style={{ background: "#ffba00" }}
            >
              {bets.length}
            </span>
          )}
        </h3>
        {bets.length > 0 && (
          <button
            onClick={clearAll}
            className="text-[hsl(214_15%_45%)] hover:text-red-400 transition-colors"
            data-testid="betslip-clear-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b" style={{ borderColor: "hsl(214 28% 14%)" }}>
        {(["single", "combo"] as const).map((tabKey) => (
          <button
            key={tabKey}
            onClick={() => setTab(tabKey)}
            className={`flex-1 py-2 text-[14px] font-semibold capitalize transition-colors relative ${
              tab === tabKey
                ? "text-white"
                : "text-[hsl(214_15%_48%)] hover:text-white"
            }`}
            data-testid={`betslip-tab-${tabKey}`}
          >
            {tabKey === "combo" ? t.common.combo : t.common.singles}
            {tab === tabKey && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t" style={{ background: "#ffba00" }} />
            )}
          </button>
        ))}
      </div>

      {bets.length === 0 ? (
        <div className="px-4 py-8 text-center">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
            style={{ background: "hsl(214 30% 16%)" }}
          >
            <span className="text-xl">🎯</span>
          </div>
          <p className="text-base text-[hsl(214_15%_50%)]">Your bet slip is empty.</p>
          <p className="text-sm text-[hsl(214_15%_40%)] mt-1">Click odds to add selections.</p>
        </div>
      ) : (
        <div className="p-2.5 space-y-2">
          {bets.map((bet) => (
            <div
              key={bet.id}
              className="rounded-sm p-2.5"
              style={{ background: "hsl(214 32% 14%)", border: "1px solid hsl(214 28% 18%)" }}
              data-testid={`betslip-item-${bet.id}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-[14px] font-semibold text-white truncate">{bet.selection}</p>
                  <p className="text-[13px] text-[hsl(214_15%_48%)] truncate mt-0.5">{bet.match}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-[15px] font-bold" style={{ color: "#ffba00" }}>{bet.odds.toFixed(2)}</span>
                  <button
                    onClick={() => removeBet(bet.id)}
                    className="text-[hsl(214_15%_40%)] hover:text-red-400 transition-colors"
                    data-testid={`betslip-remove-${bet.id}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
              {tab === "single" && (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[13px] text-[hsl(214_15%_45%)]">{t.common.stake}:</span>
                  <div className="flex items-center gap-1 flex-1">
                    <button
                      className="p-1 rounded transition-colors"
                      style={{ background: "hsl(214 28% 18%)" }}
                      onClick={() => setStake(String(Math.max(0, stakeNum - 100)))}
                    >
                      <Minus className="w-2.5 h-2.5 text-[hsl(214_15%_55%)]" />
                    </button>
                    <Input
                      value={stake}
                      onChange={(e) => setStake(e.target.value)}
                      className="h-6 text-sm text-center"
                      style={{ background: "hsl(214 38% 10%)", borderColor: "hsl(214 28% 22%)" }}
                    />
                    <button
                      className="p-1 rounded transition-colors"
                      style={{ background: "hsl(214 28% 18%)" }}
                      onClick={() => setStake(String(stakeNum + 100))}
                    >
                      <Plus className="w-2.5 h-2.5 text-[hsl(214_15%_55%)]" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Quick stake */}
          <div className="flex gap-1">
            {[200, 500, 1000, 2500, 5000].map((amount) => (
              <button
                key={amount}
                onClick={() => setStake(String(amount))}
                className="flex-1 py-1.5 text-[13px] rounded-sm font-semibold transition-colors text-[hsl(214_15%_55%)] hover:text-white"
                style={{ background: "hsl(214 30% 16%)", border: "1px solid hsl(214 28% 20%)" }}
                data-testid={`stake-preset-${amount}`}
              >
                ৳{amount >= 1000 ? `${amount / 1000}k` : amount}
              </button>
            ))}
          </div>

          {tab === "combo" && (
            <div className="rounded-sm p-2.5" style={{ background: "hsl(214 32% 14%)", border: "1px solid hsl(214 28% 18%)" }}>
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-[hsl(214_15%_48%)]">{t.common.odds}</span>
                <span className="font-bold" style={{ color: "#ffba00" }}>{totalOdds.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[13px] text-[hsl(214_15%_45%)]">{t.common.stake}:</span>
                <Input
                  value={stake}
                  onChange={(e) => setStake(e.target.value)}
                  className="h-6 text-sm"
                  style={{ background: "hsl(214 38% 10%)", borderColor: "hsl(214 28% 22%)" }}
                />
              </div>
            </div>
          )}

          {/* Potential win */}
          <div
            className="rounded-sm p-2.5 flex items-center justify-between"
            style={{ background: "hsl(214 32% 14%)", border: "1px solid hsl(214 28% 18%)" }}
          >
            <span className="text-[14px] text-[hsl(214_15%_48%)]">{t.common.potentialWin}</span>
            <span className="text-[15px] font-bold text-green-400">৳{potentialWin}</span>
          </div>

          <button
            className="w-full py-2.5 rounded-sm text-[15px] font-bold text-[hsl(214_42%_9%)] transition-colors"
            style={{ background: "#ffba00" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#ffc933")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#ffba00")}
            data-testid="betslip-place-bet"
          >
            {t.common.placeBet} — ৳{stakeNum.toFixed(2)}
          </button>
        </div>
      )}
    </div>
  );
}
