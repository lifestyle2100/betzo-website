import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";

const promoCategories = [
  { id: "all", label: "All Promos" },
  { id: "sports", label: "⚽ Sports" },
  { id: "casino", label: "🎰 Casino" },
  { id: "welcome", label: "🎉 Welcome" },
];

const promotions = [
  {
    id: "p1",
    category: "welcome",
    title: "Welcome Sports Bonus",
    subtitle: "125% up to ৳30,000",
    description: "Join XBetZone and claim your welcome bonus of 125% on your first deposit, up to ৳30,000. Min deposit ৳1,000.",
    requirements: "18+ | Wagering requirements: 5x | Min odds: 1.70",
    icon: "🎉",
    gradient: "from-[hsl(210_100%_30%)] to-[hsl(210_100%_15%)]",
    accentColor: "hsl(210 100% 56%)",
    badge: "NEW PLAYERS",
    badgeColor: "bg-[hsl(210_100%_56%)]",
    expires: "Ongoing",
    actionLabel: "Sign Up & Claim",
    guestOnly: true,
  },
  {
    id: "p2",
    category: "casino",
    title: "Casino Welcome Bonus",
    subtitle: "100% up to ৳50,000 + 250 Free Spins",
    description: "Start your casino journey with a 100% deposit match up to ৳50,000 plus 250 free spins on selected slots.",
    requirements: "18+ | Wagering requirements: 35x | Spins valid 7 days",
    icon: "🎰",
    gradient: "from-[hsl(270_60%_30%)] to-[hsl(270_60%_15%)]",
    accentColor: "hsl(270 80% 65%)",
    badge: "CASINO",
    badgeColor: "bg-[hsl(270_60%_45%)]",
    expires: "Ongoing",
    actionLabel: "Claim Now",
    guestOnly: false,
  },
  {
    id: "p3",
    category: "sports",
    title: "Weekly Cashback",
    subtitle: "10% Cashback Every Week",
    description: "Receive 10% cashback on your weekly sports losses, credited every Monday. No cap on eligible bets.",
    requirements: "18+ | Min loss: ৳2,000 | Max cashback: ৳20,000",
    icon: "💰",
    gradient: "from-[hsl(120_50%_22%)] to-[hsl(120_50%_12%)]",
    accentColor: "hsl(120 60% 45%)",
    badge: "WEEKLY",
    badgeColor: "bg-green-600",
    expires: "Every Monday",
    actionLabel: "Claim Now",
    guestOnly: false,
  },
  {
    id: "p4",
    category: "sports",
    title: "Accumulator Boost",
    subtitle: "Up to 100% Profit Boost",
    description: "Boost your acca winnings! Add 5+ selections to earn a profit boost up to 100% on your accumulator bet.",
    requirements: "18+ | Min 5 selections | Min odds: 1.40 per selection",
    icon: "🚀",
    gradient: "from-[hsl(30_80%_28%)] to-[hsl(30_80%_14%)]",
    accentColor: "hsl(30 100% 55%)",
    badge: "SPORTS",
    badgeColor: "bg-orange-500",
    expires: "Daily",
    actionLabel: "Bet Now",
    guestOnly: false,
  },
  {
    id: "p5",
    category: "casino",
    title: "Free Spins Friday",
    subtitle: "50 Free Spins Every Friday",
    description: "Deposit ৳2,000+ every Friday and receive 50 free spins on the game of the week, no wagering required!",
    requirements: "18+ | Min deposit: ৳2,000 | Valid on specified game only",
    icon: "🎡",
    gradient: "from-[hsl(350_60%_28%)] to-[hsl(350_60%_14%)]",
    accentColor: "hsl(350 70% 55%)",
    badge: "WEEKLY",
    badgeColor: "bg-red-500",
    expires: "Every Friday",
    actionLabel: "Claim Now",
    guestOnly: false,
  },
  {
    id: "p6",
    category: "sports",
    title: "Refer a Friend",
    subtitle: "৳2,500 for You + ৳2,500 for Your Friend",
    description: "Invite your friends to XBetZone and earn ৳2,500 for every friend who signs up and makes their first deposit.",
    requirements: "18+ | Friend must deposit min ৳2,000 | Max 10 referrals/month",
    icon: "👥",
    gradient: "from-[hsl(200_60%_28%)] to-[hsl(200_60%_14%)]",
    accentColor: "hsl(200 80% 55%)",
    badge: "REFERRAL",
    badgeColor: "bg-cyan-600",
    expires: "Ongoing",
    actionLabel: "Invite Friends",
    guestOnly: false,
  },
];

export default function PromotionsPage() {
  const [category, setCategory] = useState("all");
  const [, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  const filtered = category === "all" ? promotions : promotions.filter((p) => p.category === category);

  const handleClaim = (promo: typeof promotions[0]) => {
    if (!user) {
      navigate("/register");
      return;
    }
    toast({
      title: "Bonus Activated!",
      description: `${promo.title} has been added to your account. Check your wallet for details.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Page header */}
        <div className="bg-gradient-to-r from-[hsl(210_100%_20%)] via-[hsl(210_80%_15%)] to-[hsl(210_70%_11%)] border-b border-[hsl(210_40%_18%)] px-4 py-8 text-center">
          <div className="max-w-2xl mx-auto">
            <h1 className="text-3xl font-black text-white mb-2">🎁 Promotions</h1>
            <p className="text-muted-foreground">Exclusive bonuses and offers for sports and casino players</p>
          </div>
        </div>

        <div className="max-w-full mx-auto px-3 sm:px-4 py-6">
          {/* Category filter */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {promoCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.id)}
                className={`shrink-0 px-4 py-2 rounded-lg text-base font-semibold transition-colors ${
                  category === cat.id
                    ? "bg-[#ffba00] text-[hsl(214_42%_9%)]"
                    : "bg-card border border-card-border text-muted-foreground hover:text-white hover:border-[#ffba00]"
                }`}
                data-testid={`promo-filter-${cat.id}`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Promos grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((promo) => (
              <div
                key={promo.id}
                className="bg-card border border-card-border rounded-xl overflow-hidden hover:border-[#ffba00] transition-all"
                data-testid={`promo-card-${promo.id}`}
              >
                {/* Header */}
                <div className={`bg-gradient-to-r ${promo.gradient} p-5 relative overflow-hidden`}>
                  <div
                    className="absolute -right-8 -top-8 w-32 h-32 rounded-full opacity-20"
                    style={{ backgroundColor: promo.accentColor }}
                  />
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`inline-block text-[13px] font-bold px-2 py-0.5 rounded text-white mb-2 ${promo.badgeColor}`}>
                        {promo.badge}
                      </span>
                      <h3 className="text-xl font-bold text-white">{promo.title}</h3>
                      <p className="text-2xl font-black mt-1" style={{ color: promo.accentColor }}>
                        {promo.subtitle}
                      </p>
                    </div>
                    <span className="text-4xl shrink-0">{promo.icon}</span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4">
                  <p className="text-base text-muted-foreground mb-3">{promo.description}</p>
                  <div className="bg-[hsl(210_50%_16%)] border border-[hsl(210_40%_22%)] rounded p-2.5 mb-4">
                    <p className="text-[14px] text-muted-foreground">{promo.requirements}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Expires: <span className="text-white">{promo.expires}</span>
                    </span>
                    <Button
                      size="sm"
                      className="font-bold text-white"
                      style={{ backgroundColor: promo.accentColor }}
                      onClick={() => handleClaim(promo)}
                      data-testid={`promo-claim-${promo.id}`}
                    >
                      {!user && promo.guestOnly ? "Sign Up & Claim" : promo.actionLabel}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
