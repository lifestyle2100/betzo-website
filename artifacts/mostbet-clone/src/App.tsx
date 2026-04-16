import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/context/AuthContext";
import { BetslipProvider } from "@/context/BetslipContext";
import { LanguageProvider } from "@/context/LanguageContext";
import SupportChat from "@/components/SupportChat";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import SportsbookPage from "@/pages/sportsbook";
import AllSportsPage from "@/pages/all-sports";
import CasinoPage from "@/pages/casino";
import LivePage from "@/pages/live";
import LiveCasinoPage from "@/pages/live-casino";
import VirtualSportsPage from "@/pages/virtual-sports";
import ESportsPage from "@/pages/esports";
import PromotionsPage from "@/pages/promotions";
import TournamentsPage from "@/pages/tournaments";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import AdminPage from "@/pages/admin";
import ProfilePage from "@/pages/profile";
import DepositPage from "@/pages/deposit";
import WithdrawPage from "@/pages/withdraw";
import MyBetsPage from "@/pages/my-bets";
import TransactionsPage from "@/pages/transactions";
import BonusesPage from "@/pages/bonuses";
import NotificationsPage from "@/pages/notifications";
import SecurityPage from "@/pages/security";
import AviatorPage from "@/pages/aviator";
import FastGamesPage from "@/pages/fast-games";
import PokerPage from "@/pages/poker";
import TotoPage from "@/pages/toto";
import FantasySportPage from "@/pages/fantasy-sport";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/sportsbook" component={SportsbookPage} />
      <Route path="/sportsbook/:sport" component={SportsbookPage} />
      <Route path="/all-sports" component={AllSportsPage} />
      <Route path="/casino" component={CasinoPage} />
      <Route path="/live" component={LivePage} />
      <Route path="/live-casino" component={LiveCasinoPage} />
      <Route path="/virtual-sports" component={VirtualSportsPage} />
      <Route path="/esports" component={ESportsPage} />
      <Route path="/promotions" component={PromotionsPage} />
      <Route path="/tournaments" component={TournamentsPage} />
      <Route path="/aviator" component={AviatorPage} />
      <Route path="/fast-games" component={FastGamesPage} />
      <Route path="/poker" component={PokerPage} />
      <Route path="/toto" component={TotoPage} />
      <Route path="/fantasy-sport" component={FantasySportPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/profile" component={ProfilePage} />
      <Route path="/deposit" component={DepositPage} />
      <Route path="/withdraw" component={WithdrawPage} />
      <Route path="/my-bets" component={MyBetsPage} />
      <Route path="/transactions" component={TransactionsPage} />
      <Route path="/bonuses" component={BonusesPage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/security" component={SecurityPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <AuthProvider>
            <BetslipProvider>
              <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
                <Router />
              </WouterRouter>
              <SupportChat />
              <Toaster />
            </BetslipProvider>
          </AuthProvider>
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
