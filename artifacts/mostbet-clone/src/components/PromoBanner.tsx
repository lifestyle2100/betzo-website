import { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";

const slides = [
  {
    id: 1,
    badge: "NEW PLAYERS",
    badgeBg: "#ffba00",
    badgeColor: "#14202e",
    title: "Welcome Bonus",
    highlight: "125% up to ৳30,000",
    desc: "On your first deposit. Min deposit ৳1,000.",
    cta: "Get Bonus",
    ctaHref: "/register",
    bg: "linear-gradient(105deg, #071628 0%, #0c2244 45%, rgba(7,22,40,0.55) 100%)",
    accentColor: "#ffba00",
    photo: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=1200&q=75",
    photoBg: "rgba(7,22,40,0.55)",
    decorBg: "radial-gradient(ellipse at 75% 50%, rgba(255,186,0,0.12) 0%, transparent 60%)",
  },
  {
    id: 2,
    badge: "CASINO",
    badgeBg: "#c026d3",
    badgeColor: "#fff",
    title: "Casino Welcome",
    highlight: "100% up to ৳50,000 + 250 Free Spins",
    desc: "Start your casino journey today. First deposit only.",
    cta: "Play Casino",
    ctaHref: "/casino",
    bg: "linear-gradient(105deg, #0e0820 0%, #1a0d38 45%, rgba(14,8,32,0.55) 100%)",
    accentColor: "#c026d3",
    photo: "https://images.unsplash.com/photo-1596838132731-3301c3fd4317?auto=format&fit=crop&w=1200&q=75",
    photoBg: "rgba(14,8,32,0.60)",
    decorBg: "radial-gradient(ellipse at 75% 50%, rgba(192,38,211,0.18) 0%, transparent 60%)",
  },
  {
    id: 3,
    badge: "SPORTS",
    badgeBg: "#16a34a",
    badgeColor: "#fff",
    title: "Weekly Cashback",
    highlight: "10% Back Every Week",
    desc: "Get cashback on all your weekly sports losses, credited every Monday.",
    cta: "Bet Now",
    ctaHref: "/sportsbook",
    bg: "linear-gradient(105deg, #051510 0%, #0a2418 45%, rgba(5,21,16,0.55) 100%)",
    accentColor: "#22c55e",
    photo: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1200&q=75",
    photoBg: "rgba(5,21,16,0.62)",
    decorBg: "radial-gradient(ellipse at 75% 50%, rgba(34,197,94,0.15) 0%, transparent 60%)",
  },
  {
    id: 4,
    badge: "ESPORTS",
    badgeBg: "#2563eb",
    badgeColor: "#fff",
    title: "eSports Betting",
    highlight: "CS2 • DOTA 2 • League of Legends",
    desc: "Live eSports odds updated every second. Best markets available.",
    cta: "Bet eSports",
    ctaHref: "/esports",
    bg: "linear-gradient(105deg, #06080e 0%, #0c1422 45%, rgba(6,8,14,0.55) 100%)",
    accentColor: "#3b82f6",
    photo: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=75",
    photoBg: "rgba(6,8,14,0.65)",
    decorBg: "radial-gradient(ellipse at 75% 50%, rgba(59,130,246,0.16) 0%, transparent 60%)",
  },
  {
    id: 5,
    badge: "LIVE CASINO",
    badgeBg: "#dc2626",
    badgeColor: "#fff",
    title: "Live Dealer Tables",
    highlight: "24/7 Roulette & Blackjack",
    desc: "Join thousands of players at real dealer tables — live, right now.",
    cta: "Go Live",
    ctaHref: "/live-casino",
    bg: "linear-gradient(105deg, #130606 0%, #240808 45%, rgba(19,6,6,0.55) 100%)",
    accentColor: "#ef4444",
    photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1200&q=75",
    photoBg: "rgba(19,6,6,0.60)",
    decorBg: "radial-gradient(ellipse at 75% 50%, rgba(239,68,68,0.16) 0%, transparent 60%)",
  },
];

const AUTO_PLAY_MS = 4000;

export default function PromoBanner() {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [animating, setAnimating] = useState(false);
  const [dir, setDir] = useState<"next" | "prev">("next");

  const goTo = useCallback((idx: number, direction: "next" | "prev" = "next") => {
    if (animating) return;
    setDir(direction);
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 340);
    setProgress(0);
  }, [animating]);

  const next = useCallback(() => {
    goTo((current + 1) % slides.length, "next");
  }, [current, goTo]);

  const prev = useCallback(() => {
    goTo((current - 1 + slides.length) % slides.length, "prev");
  }, [current, goTo]);

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    setProgress(0);

    const tick = 50;
    progressRef.current = setInterval(() => {
      setProgress(p => Math.min(p + (tick / AUTO_PLAY_MS) * 100, 100));
    }, tick);

    intervalRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length);
      setProgress(0);
    }, AUTO_PLAY_MS);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [startTimer]);

  const handleManualNav = (cb: () => void) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);
    cb();
    startTimer();
  };

  const slide = slides[current];

  return (
    <div
      className="relative overflow-hidden rounded-sm select-none"
      style={{ height: 290 }}
      data-testid="promo-banner"
    >
      {/* Background */}
      <div
        className="absolute inset-0 transition-all duration-500"
        style={{ background: slide.bg }}
      />
      {/* Accent glow */}
      <div className="absolute inset-0 transition-all duration-500" style={{ background: slide.decorBg }} />

      {/* Grid lines overlay for depth */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* Right-side photo */}
      <div
        className="absolute right-0 top-0 bottom-0 pointer-events-none overflow-hidden"
        style={{ width: "52%" }}
        aria-hidden
      >
        <img
          src={slide.photo}
          alt=""
          className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-500"
          style={{ opacity: 0.55 }}
          loading="eager"
          draggable={false}
        />
        {/* Left fade to blend with text area */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to right, ${slide.photoBg} 0%, transparent 55%)`,
          }}
        />
      </div>

      {/* Accent line top */}
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: slide.accentColor }} />

      {/* Slide counter top-right */}
      <div className="absolute top-3 right-4 flex items-center gap-1 text-[14px] font-bold text-white/40 tabular-nums z-10">
        <span style={{ color: slide.accentColor }}>{String(current + 1).padStart(2, "0")}</span>
        <span>/</span>
        <span>{String(slides.length).padStart(2, "0")}</span>
      </div>

      {/* Content */}
      <div
        className="relative z-10 h-full flex flex-col justify-center px-8 sm:px-12"
        style={{
          maxWidth: "62%",
          transform: `translateX(${animating ? (dir === "next" ? "-24px" : "24px") : "0"})`,
          opacity: animating ? 0 : 1,
          transition: "transform 0.34s cubic-bezier(0.4,0,0.2,1), opacity 0.34s",
        }}
      >
        {/* Badge */}
        <span
          className="self-start inline-block text-[13px] font-black px-2.5 py-0.5 rounded-sm mb-3 tracking-widest uppercase"
          style={{ background: slide.badgeBg, color: slide.badgeColor }}
        >
          {slide.badge}
        </span>

        {/* Title */}
        <h2 className="text-[17px] font-bold text-white/75 leading-none mb-1">{slide.title}</h2>

        {/* Highlight */}
        <p
          className="text-[30px] sm:text-[34px] font-black leading-tight mb-2"
          style={{ color: slide.accentColor, textShadow: `0 0 40px ${slide.accentColor}55` }}
        >
          {slide.highlight}
        </p>

        {/* Description */}
        <p className="text-[14px] text-white/50 mb-4 leading-relaxed">{slide.desc}</p>

        {/* CTA */}
        <Link href={slide.ctaHref}>
          <button
            className="inline-flex items-center px-6 py-2 rounded-sm text-[15px] font-black transition-all hover:scale-105 active:scale-95"
            style={{
              background: slide.accentColor,
              color: slide.accentColor === "#ffba00" ? "#14202e" : "#fff",
              boxShadow: `0 4px 20px ${slide.accentColor}55`,
            }}
            data-testid={`banner-cta-${current}`}
          >
            {slide.cta}
          </button>
        </Link>
      </div>

      {/* Left arrow */}
      <button
        onClick={() => handleManualNav(prev)}
        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110 z-20"
        data-testid="banner-prev"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => handleManualNav(next)}
        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm flex items-center justify-center text-white transition-all hover:scale-110 z-20"
        data-testid="banner-next"
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Bottom: progress bar + dots */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        {/* Thumbnail dots row */}
        <div className="flex items-center justify-center gap-1.5 pb-3">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => handleManualNav(() => goTo(i, i > current ? "next" : "prev"))}
              data-testid={`banner-dot-${i}`}
              className="relative overflow-hidden rounded-full transition-all duration-300"
              style={{
                height: 4,
                width: i === current ? 28 : 7,
                background: i === current ? slide.accentColor : "rgba(255,255,255,0.25)",
              }}
              aria-label={`Go to slide ${i + 1}`}
            >
              {i === current && (
                <span
                  className="absolute left-0 top-0 h-full rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: "rgba(255,255,255,0.45)",
                    transition: "width 50ms linear",
                  }}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
