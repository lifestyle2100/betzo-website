import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Minimize2, ChevronDown } from "lucide-react";
import { useLang } from "@/context/LanguageContext";

interface Message {
  id: string;
  text: string;
  from: "user" | "agent";
  ts: Date;
}

const BOT_RESPONSES: { keywords: string[]; reply: (t: ReturnType<typeof useLang>["t"]) => string }[] = [
  {
    keywords: ["deposit", "money", "fund", "payment", "pay", "জমা", "টাকা", "depósito", "dépôt", "пополнить", "إيداع"],
    reply: () => "We accept deposits via Bank Transfer, bKash, Nagad, Rocket, Visa, Mastercard, and Crypto. Minimum deposit is ৳500. Your funds are credited instantly!"
  },
  {
    keywords: ["withdraw", "cashout", "cash out", "withdrawal", "উত্তোলন", "retirar", "retrait", "вывод", "سحب"],
    reply: () => "Withdrawals are processed within 2–24 hours. Go to My Account → Withdraw. Minimum withdrawal is ৳1,000. Bank transfer may take 1–3 business days."
  },
  {
    keywords: ["bonus", "promo", "promotion", "offer", "বোনাস", "অফার", "bônus", "бонус", "مكافأة"],
    reply: () => "🎁 Welcome Bonus: 125% up to ৳30,000 on first deposit!\n\nOther offers:\n• Weekly 10% Cashback\n• Accumulator Boost up to 100%\n• 50 Free Spins every Friday\n\nVisit the Promotions page for full details."
  },
  {
    keywords: ["register", "sign up", "account", "নিবন্ধন", "registrar", "registrer", "регистрация", "تسجيل"],
    reply: () => "Creating an account is quick and free! Click 'Register' in the top bar, fill in your details, and you'll be ready in under 2 minutes. You must be 18+ to register."
  },
  {
    keywords: ["odds", "bet", "betting", "wager", "অডস", "বেট", "apostar", "parier", "ставка", "رهان"],
    reply: () => "We offer the best odds in the market across 30+ sports! Click any odds button to add it to your bet slip, enter your stake, and place your bet. You can also build accumulators for bigger wins."
  },
  {
    keywords: ["casino", "slot", "game", "ক্যাসিনো", "cassino", "казино", "كازينو"],
    reply: () => "🎰 We have 5,000+ casino games including Slots, Live Roulette, Blackjack, Baccarat, Crash Games & more! Powered by Pragmatic Play, Evolution Gaming, NetEnt, and other top providers."
  },
  {
    keywords: ["live", "live bet", "লাইভ"],
    reply: () => "🔴 Our Live Betting section has 847+ active events! You can bet in real-time with constantly updating odds. Supports in-play cash out feature too!"
  },
  {
    keywords: ["password", "forgot", "reset", "পাসওয়ার্ড"],
    reply: () => "Forgot your password? Click 'Log In' → 'Forgot Password' and we'll send a reset link to your registered email. If you need further help, let us know your username!"
  },
  {
    keywords: ["kyc", "verify", "verification", "id", "document"],
    reply: () => "Account verification requires a valid ID (NID/Passport), a selfie, and proof of address. Documents are usually verified within 24 hours. This is required before withdrawals above ৳10,000."
  },
  {
    keywords: ["hello", "hi", "hey", "help", "হ্যালো", "হেলো", "salut", "hola", "привет", "مرحبا"],
    reply: (t) => t.chat.greeting
  },
];

const AUTO_REPLIES = [
  "Thanks for reaching out! Let me look into that for you... 🔍",
  "Great question! Our team is checking that right now.",
  "I understand your concern. Here's what you need to know:",
  "Of course! Happy to help with that.",
];

function getBotReply(text: string, t: ReturnType<typeof useLang>["t"]): string {
  const lower = text.toLowerCase();
  for (const rule of BOT_RESPONSES) {
    if (rule.keywords.some(kw => lower.includes(kw.toLowerCase()))) {
      return rule.reply(t);
    }
  }
  return `Thank you for your message! A support agent will respond shortly. For urgent queries, you can also reach us at support@xbetzone.com or via our 24/7 hotline. ⚡`;
}

export default function SupportChat() {
  const { t } = useLang();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: "greeting",
        text: t.chat.greeting,
        from: "agent",
        ts: new Date(),
      }]);
    }
  }, []);

  useEffect(() => {
    if (open && !minimized) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, minimized, messages]);

  const handleOpen = () => {
    setOpen(true);
    setMinimized(false);
    setUnread(0);
  };

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = { id: Date.now().toString(), text, from: "user", ts: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    const delay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      const reply = getBotReply(text, t);
      setTyping(false);
      const agentMsg: Message = { id: (Date.now() + 1).toString(), text: reply, from: "agent", ts: new Date() };
      setMessages(prev => [...prev, agentMsg]);
      if (minimized) setUnread(u => u + 1);
    }, delay);
  };

  const formatTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={handleOpen}
          className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
          style={{ background: "linear-gradient(135deg, #ffba00, #ff8c00)" }}
          data-testid="support-chat-open"
          aria-label="Open support chat"
        >
          <MessageCircle className="w-6 h-6 text-white" />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[13px] font-bold rounded-full flex items-center justify-center">
              {unread}
            </span>
          )}
        </button>
      )}

      {/* Chat window */}
      {open && (
        <div
          className={`fixed bottom-6 right-6 z-[100] w-80 sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${minimized ? "h-14" : "h-[500px]"}`}
          style={{ background: "hsl(214 42% 9%)", border: "1px solid hsl(214 28% 20%)" }}
          data-testid="support-chat-window"
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3 shrink-0 cursor-pointer"
            style={{ background: "linear-gradient(135deg, hsl(214 55% 18%), hsl(214 42% 12%))", borderBottom: "1px solid hsl(214 28% 18%)" }}
            onClick={() => setMinimized(v => !v)}
          >
            <div className="relative shrink-0">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-xl" style={{ background: "linear-gradient(135deg, #ffba00, #ff8c00)" }}>
                🎰
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-[hsl(214_42%_12%)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-white truncate">{t.chat.title}</p>
              <p className="text-[14px] text-green-400 truncate">{t.chat.subtitle}</p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={(e) => { e.stopPropagation(); setMinimized(v => !v); }}
                className="p-1 rounded hover:bg-white/10 text-[hsl(214_15%_55%)] hover:text-white transition-colors"
                data-testid="support-chat-minimize"
              >
                {minimized ? <ChevronDown className="w-4 h-4 rotate-180" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                className="p-1 rounded hover:bg-white/10 text-[hsl(214_15%_55%)] hover:text-white transition-colors"
                data-testid="support-chat-close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {!minimized && (
            <>
              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 scroll-smooth">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 ${msg.from === "user" ? "flex-row-reverse" : "flex-row"}`}>
                    {msg.from === "agent" && (
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-base shrink-0 mt-1" style={{ background: "linear-gradient(135deg, #ffba00, #ff8c00)" }}>
                        🎰
                      </div>
                    )}
                    <div className={`max-w-[75%] ${msg.from === "user" ? "items-end" : "items-start"} flex flex-col gap-0.5`}>
                      <div
                        className={`px-3 py-2 rounded-2xl text-base whitespace-pre-wrap leading-relaxed ${
                          msg.from === "user"
                            ? "rounded-tr-sm text-[hsl(214_42%_9%)] font-medium"
                            : "rounded-tl-sm text-white"
                        }`}
                        style={msg.from === "user"
                          ? { background: "#ffba00" }
                          : { background: "hsl(214 36% 18%)", border: "1px solid hsl(214 28% 24%)" }
                        }
                      >
                        {msg.text}
                      </div>
                      <span className="text-[13px] text-[hsl(214_15%_40%)] px-1">{formatTime(msg.ts)}</span>
                    </div>
                  </div>
                ))}

                {typing && (
                  <div className="flex gap-2 items-end">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-base shrink-0" style={{ background: "linear-gradient(135deg, #ffba00, #ff8c00)" }}>
                      🎰
                    </div>
                    <div className="px-3 py-2.5 rounded-2xl rounded-tl-sm flex gap-1" style={{ background: "hsl(214 36% 18%)", border: "1px solid hsl(214 28% 24%)" }}>
                      {[0, 1, 2].map(i => (
                        <span key={i} className="w-1.5 h-1.5 bg-[hsl(214_15%_55%)] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick replies */}
              <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto shrink-0">
                {["Bonus info", "Deposit help", "Withdrawal", "Live betting"].map(qr => (
                  <button
                    key={qr}
                    onClick={() => { setInput(qr); setTimeout(() => inputRef.current?.focus(), 50); }}
                    className="shrink-0 px-2.5 py-1 rounded-full text-[14px] font-medium text-[hsl(214_8%_72%)] hover:text-white transition-colors whitespace-nowrap"
                    style={{ background: "hsl(214 36% 18%)", border: "1px solid hsl(214 28% 24%)" }}
                  >
                    {qr}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="px-3 pb-3 shrink-0">
                <div
                  className="flex items-center gap-2 rounded-xl px-3 py-2"
                  style={{ background: "hsl(214 36% 16%)", border: "1px solid hsl(214 28% 24%)" }}
                >
                  <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage()}
                    placeholder={t.chat.placeholder}
                    className="flex-1 bg-transparent text-base text-white placeholder-[hsl(214_15%_40%)] outline-none min-w-0"
                    data-testid="support-chat-input"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim()}
                    className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all disabled:opacity-40"
                    style={{ background: "#ffba00" }}
                    data-testid="support-chat-send"
                  >
                    <Send className="w-3.5 h-3.5 text-[hsl(214_42%_9%)]" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
