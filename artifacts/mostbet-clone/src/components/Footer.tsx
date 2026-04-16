import { Link } from "wouter";
import logo from "@/assets/xbetzone-logo.png";
import { Twitter, Instagram, Youtube, MessageCircle, Send } from "lucide-react";

const sportLinks = [
  { label: "Football", href: "/sportsbook?sport=soccer_epl" },
  { label: "Cricket / IPL", href: "/sportsbook?sport=cricket_ipl" },
  { label: "Basketball", href: "/sportsbook?sport=basketball_nba" },
  { label: "Tennis", href: "/sportsbook?sport=tennis_atp_french_open" },
  { label: "Ice Hockey", href: "/sportsbook?sport=icehockey_nhl" },
  { label: "Baseball", href: "/sportsbook?sport=baseball_mlb" },
  { label: "MMA / UFC", href: "/sportsbook?sport=mma_mixed_martial_arts" },
  { label: "T20 International", href: "/sportsbook?sport=cricket_international_t20" },
  { label: "Live Betting", href: "/live" },
  { label: "Virtual Sports", href: "/virtual-sports" },
  { label: "eSports", href: "/esports" },
];

const casinoLinks = [
  { label: "All Casino Games", href: "/casino" },
  { label: "Slots", href: "/casino" },
  { label: "Live Casino", href: "/live-casino" },
  { label: "Roulette", href: "/live-casino" },
  { label: "Blackjack", href: "/live-casino" },
  { label: "Baccarat", href: "/live-casino" },
  { label: "Poker", href: "/live-casino" },
  { label: "Game Shows", href: "/live-casino" },
  { label: "Crash Games", href: "/casino" },
  { label: "Promotions", href: "/promotions" },
];

const companyLinks = [
  { label: "About XBetZone", href: "#about" },
  { label: "Press & Media", href: "#press" },
  { label: "Careers", href: "#careers" },
  { label: "Blog", href: "#blog" },
  { label: "Affiliate Program", href: "#affiliates" },
  { label: "Partnership", href: "#partnership" },
];

const supportLinks = [
  { label: "Help Center", href: "#help" },
  { label: "Live Chat", href: "#chat" },
  { label: "Contact Us", href: "#contact" },
  { label: "Responsible Gaming", href: "#responsible" },
  { label: "Self-Exclusion", href: "#self-exclusion" },
  { label: "Deposit Limits", href: "#limits" },
  { label: "Complaints", href: "#complaints" },
];

const legalLinks = [
  { label: "Terms & Conditions", href: "#terms" },
  { label: "Privacy Policy", href: "#privacy" },
  { label: "Cookie Policy", href: "#cookies" },
  { label: "AML Policy", href: "#aml" },
  { label: "KYC Policy", href: "#kyc" },
  { label: "Bonus Terms", href: "#bonus-terms" },
  { label: "Responsible Gambling Policy", href: "#rg-policy" },
];

const paymentMethods = [
  { name: "VISA", bg: "#1A1F71", color: "#fff", borderColor: "#1A1F71" },
  { name: "Mastercard", bg: "#EB001B", color: "#fff", borderColor: "#EB001B", secondary: "#F79E1B" },
  { name: "bKash", bg: "#E2136E", color: "#fff", borderColor: "#E2136E" },
  { name: "Nagad", bg: "#F6891F", color: "#fff", borderColor: "#F6891F" },
  { name: "Rocket", bg: "#8b3fc9", color: "#fff", borderColor: "#8b3fc9" },
  { name: "Bitcoin", bg: "#F7931A", color: "#fff", borderColor: "#F7931A" },
  { name: "Ethereum", bg: "#3C3C3D", color: "#fff", borderColor: "#627EEA" },
  { name: "USDT", bg: "#26A17B", color: "#fff", borderColor: "#26A17B" },
  { name: "Skrill", bg: "#862165", color: "#fff", borderColor: "#862165" },
  { name: "Neteller", bg: "#000000", color: "#8dc63f", borderColor: "#8dc63f" },
  { name: "Bank Transfer", bg: "hsl(214 36% 14%)", color: "#ccc", borderColor: "hsl(214 28% 24%)" },
];

const socialLinks = [
  { icon: Twitter, label: "Twitter / X", href: "#twitter", hoverColor: "#1DA1F2" },
  { icon: Instagram, label: "Instagram", href: "#instagram", hoverColor: "#E1306C" },
  { icon: Youtube, label: "YouTube", href: "#youtube", hoverColor: "#FF0000" },
  { icon: MessageCircle, label: "Telegram", href: "#telegram", hoverColor: "#2CA5E0" },
  { icon: Send, label: "WhatsApp", href: "#whatsapp", hoverColor: "#25D366" },
];

function FooterLinkSection({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <h4 className="text-white font-bold text-[15px] mb-3 pb-1.5 border-b" style={{ borderColor: "hsl(214 28% 16%)" }}>{title}</h4>
      <ul className="space-y-1.5">
        {links.map((link) => (
          <li key={link.label}>
            {link.href.startsWith("/") ? (
              <Link href={link.href}>
                <span
                  className="text-[14px] text-[hsl(214_10%_50%)] hover:text-[#ffba00] transition-colors cursor-pointer"
                  data-testid={`footer-link-${link.label.toLowerCase().replace(/[\s/&]/g, "-")}`}
                >
                  {link.label}
                </span>
              </Link>
            ) : (
              <a
                href={link.href}
                className="text-[14px] text-[hsl(214_10%_50%)] hover:text-[#ffba00] transition-colors"
                data-testid={`footer-link-${link.label.toLowerCase().replace(/[\s/&]/g, "-")}`}
              >
                {link.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="mt-12" style={{ background: "hsl(214 44% 7%)", borderTop: "1px solid hsl(214 28% 12%)" }}>

      {/* ── Responsible Gaming Bar ── */}
      <div className="py-2.5 px-4" style={{ background: "#ffba00" }}>
        <div className="max-w-full mx-auto flex flex-wrap items-center justify-center gap-6 text-[14px] font-bold text-[hsl(214_42%_9%)]">
          <span>🔞 18+ Only</span>
          <span className="hidden sm:inline opacity-40">|</span>
          <span>🏛️ Licensed & Regulated</span>
          <span className="hidden sm:inline opacity-40">|</span>
          <span>🔒 SSL Encrypted</span>
          <span className="hidden sm:inline opacity-40">|</span>
          <span>⚡ 24/7 Live Support</span>
          <span className="hidden sm:inline opacity-40">|</span>
          <span>🎲 Play Responsibly</span>
        </div>
      </div>

      {/* ── App Download Banner ── */}
      <div className="border-b py-3 px-4" style={{ background: "hsl(214 40% 9%)", borderColor: "hsl(214 28% 13%)" }}>
        <div className="max-w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📱</span>
            <div>
              <p className="text-[15px] font-bold text-white">Download the XBetZone App</p>
              <p className="text-[14px] text-[hsl(214_15%_45%)]">Bet anywhere, anytime — iOS & Android</p>
            </div>
          </div>
          <div className="flex gap-2">
            <a href="#app-store"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded text-[14px] text-white font-semibold hover:brightness-110 transition-all border"
              style={{ background: "#111", borderColor: "hsl(214 28% 24%)" }}
              data-testid="footer-app-store"
            >
              🍎 <span>App Store</span>
            </a>
            <a href="#play-store"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded text-[14px] text-white font-semibold hover:brightness-110 transition-all border"
              style={{ background: "#111", borderColor: "hsl(214 28% 24%)" }}
              data-testid="footer-play-store"
            >
              🤖 <span>Google Play</span>
            </a>
            <a href="#apk"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded text-[14px] text-white font-semibold hover:brightness-110 transition-all"
              style={{ background: "#e05a00" }}
              data-testid="footer-apk"
            >
              ⬇ APK
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 py-8">

        {/* ── Logo + Social ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 mb-8 pb-6 border-b" style={{ borderColor: "hsl(214 28% 13%)" }}>
          <div className="flex items-start gap-4">
            <img src={logo} alt="XBetZone" className="h-10 w-auto object-contain" style={{ maxWidth: 160 }} />
            <p className="text-[14px] text-[hsl(214_10%_42%)] leading-relaxed max-w-[260px] mt-1">
              A leading international sports betting and online casino platform offering competitive odds and a premium gaming experience.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-[13px] font-bold text-[hsl(214_15%_38%)] uppercase tracking-wider">Follow Us</p>
            <div className="flex items-center gap-1.5">
              {socialLinks.map(({ icon: Icon, label, href, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  title={label}
                  className="p-2 rounded transition-colors group"
                  style={{ background: "hsl(214 36% 12%)", border: "1px solid hsl(214 28% 18%)" }}
                  data-testid={`social-${label.toLowerCase().replace(/\s|\/|\./g, "-")}`}
                >
                  <Icon className="w-4 h-4 text-[hsl(214_10%_50%)] group-hover:text-white transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Link grid: 5 columns ── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
          <FooterLinkSection title="Sports" links={sportLinks} />
          <FooterLinkSection title="Casino" links={casinoLinks} />
          <FooterLinkSection title="Company" links={companyLinks} />
          <FooterLinkSection title="Support" links={supportLinks} />
          <FooterLinkSection title="Legal" links={legalLinks} />
        </div>

        {/* ── Payment methods ── */}
        <div className="mb-7">
          <h4 className="text-[14px] font-bold text-[hsl(214_15%_45%)] uppercase tracking-wider mb-3">Payment Methods</h4>
          <div className="flex flex-wrap gap-2">
            {paymentMethods.map(({ name, bg, color, borderColor }) => (
              <div
                key={name}
                className="flex items-center justify-center px-3 py-1.5 rounded text-[14px] font-black cursor-pointer hover:brightness-110 transition-all"
                style={{
                  background: bg,
                  color,
                  border: `1px solid ${borderColor}`,
                  minWidth: 64,
                  letterSpacing: "0.02em",
                }}
                data-testid={`payment-${name.toLowerCase().replace(/\s/g, "-")}`}
              >
                {name}
              </div>
            ))}
          </div>
        </div>

        {/* ── Responsible gambling logos ── */}
        <div className="mb-7 flex flex-wrap items-center gap-3">
          <h4 className="text-[14px] font-bold text-[hsl(214_15%_38%)] uppercase tracking-wider w-full sm:w-auto">Responsible Gambling</h4>
          {[
            { name: "BeGambleAware", bg: "#4c1d95", border: "#7c3aed", text: "#c4b5fd" },
            { name: "GamCare", bg: "#1e3a5f", border: "#3b82f6", text: "#93c5fd" },
            { name: "GamblingTherapy", bg: "#14532d", border: "#16a34a", text: "#86efac" },
            { name: "18+", bg: "#7f1d1d", border: "#dc2626", text: "#fca5a5" },
            { name: "GamStop", bg: "#431407", border: "#ea580c", text: "#fdba74" },
          ].map(({ name, bg, border, text }) => (
            <a
              key={name}
              href="#"
              className="px-3 py-1 border rounded text-[14px] font-bold hover:opacity-80 transition-opacity"
              style={{ background: bg, borderColor: border, color: text }}
              data-testid={`rg-logo-${name.toLowerCase()}`}
            >
              {name}
            </a>
          ))}
        </div>

        {/* ── Disclaimer ── */}
        <div className="mb-5 p-3.5 rounded" style={{ background: "hsl(214 40% 9%)", border: "1px solid hsl(214 28% 15%)" }}>
          <p className="text-[14px] text-[hsl(214_10%_42%)] leading-relaxed">
            <strong className="text-[hsl(214_10%_60%)]">Disclaimer:</strong> XBetZone is operated by XBetZone Ltd. This website is for entertainment purposes only. Gambling involves risk. You must be 18 years or older to use this website. XBetZone supports responsible gambling. If you feel you may have a gambling problem, please seek help at{" "}
            <a href="https://www.begambleaware.org" target="_blank" rel="noopener noreferrer" className="text-[#ffba00] hover:underline">BeGambleAware.org</a> or{" "}
            <a href="https://www.gamcare.org.uk" target="_blank" rel="noopener noreferrer" className="text-[#ffba00] hover:underline">GamCare.org.uk</a>.
          </p>
        </div>

        {/* ── Bottom bar ── */}
        <div className="border-t pt-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-[14px] text-[hsl(214_10%_40%)]" style={{ borderColor: "hsl(214 28% 13%)" }}>
          <p>© 2025 XBetZone Ltd. All rights reserved. Gambling can be addictive — please play responsibly.</p>
          <div className="flex items-center gap-3">
            <span className="px-1.5 py-0.5 bg-red-900/60 border border-red-700 rounded font-black text-red-400 text-[14px]">18+</span>
            <a href="#" className="hover:text-[#ffba00] transition-colors">GamblingTherapy.org</a>
            <a href="#" className="hover:text-[#ffba00] transition-colors">BeGambleAware.org</a>
          </div>
        </div>

      </div>
    </footer>
  );
}
