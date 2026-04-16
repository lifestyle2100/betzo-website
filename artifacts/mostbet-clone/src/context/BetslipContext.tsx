import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface BetItem {
  id: string;
  match: string;
  selection: string;
  odds: number;
}

interface BetslipContextValue {
  bets: BetItem[];
  addBet: (bet: BetItem) => void;
  removeBet: (id: string) => void;
  clearAll: () => void;
  hasBet: (id: string) => boolean;
}

const BetslipContext = createContext<BetslipContextValue | null>(null);

export function BetslipProvider({ children }: { children: ReactNode }) {
  const [bets, setBets] = useState<BetItem[]>([
    { id: "default-1", match: "Man City vs Arsenal", selection: "Man City Win", odds: 1.85 },
    { id: "default-2", match: "Lakers vs Celtics", selection: "Over 220.5", odds: 1.92 },
  ]);

  const addBet = useCallback((bet: BetItem) => {
    setBets((prev) => {
      if (prev.find((b) => b.id === bet.id)) return prev;
      return [...prev, bet];
    });
  }, []);

  const removeBet = useCallback((id: string) => {
    setBets((prev) => prev.filter((b) => b.id !== id));
  }, []);

  const clearAll = useCallback(() => setBets([]), []);

  const hasBet = useCallback((id: string) => bets.some((b) => b.id === id), [bets]);

  return (
    <BetslipContext.Provider value={{ bets, addBet, removeBet, clearAll, hasBet }}>
      {children}
    </BetslipContext.Provider>
  );
}

export function useBetslip() {
  const ctx = useContext(BetslipContext);
  if (!ctx) throw new Error("useBetslip must be used inside BetslipProvider");
  return ctx;
}
