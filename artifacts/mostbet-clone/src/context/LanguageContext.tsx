import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type LangCode = "en" | "bn" | "hi" | "ar" | "fr" | "tr" | "ru" | "pt";

export interface LangOption {
  code: LangCode;
  label: string;
  flag: string;
  nativeName: string;
  dir?: "rtl";
}

export const LANGUAGES: LangOption[] = [
  { code: "en", label: "EN", flag: "🇬🇧", nativeName: "English" },
  { code: "bn", label: "বাং", flag: "🇧🇩", nativeName: "বাংলা" },
  { code: "hi", label: "हिं", flag: "🇮🇳", nativeName: "हिन्दी" },
  { code: "ar", label: "عر", flag: "🇸🇦", nativeName: "العربية", dir: "rtl" },
  { code: "fr", label: "FR", flag: "🇫🇷", nativeName: "Français" },
  { code: "tr", label: "TR", flag: "🇹🇷", nativeName: "Türkçe" },
  { code: "ru", label: "RU", flag: "🇷🇺", nativeName: "Русский" },
  { code: "pt", label: "PT", flag: "🇧🇷", nativeName: "Português" },
];

export interface Translations {
  nav: {
    sports: string;
    live: string;
    fastGames: string;
    casino: string;
    liveCasino: string;
    aviator: string;
    esports: string;
    fantasySport: string;
    virtualSports: string;
    poker: string;
    toto: string;
    tournaments: string;
    promotions: string;
  };
  common: {
    login: string;
    register: string;
    deposit: string;
    betNow: string;
    claimNow: string;
    placeBet: string;
    potentialWin: string;
    betSlip: string;
    odds: string;
    live: string;
    upcoming: string;
    viewAll: string;
    search: string;
    support: string;
    stake: string;
    singles: string;
    combo: string;
  };
  home: {
    liveOdds: string;
    topCasino: string;
    promotions: string;
    welcome: string;
  };
  chat: {
    title: string;
    subtitle: string;
    placeholder: string;
    send: string;
    greeting: string;
  };
}

const translations: Record<LangCode, Translations> = {
  en: {
    nav: { sports: "Sports", live: "Live", fastGames: "Fast Games", casino: "Casino", liveCasino: "Live Casino", aviator: "Aviator", esports: "eSports", fantasySport: "Fantasy Sport", virtualSports: "Virtual Sports", poker: "Poker", toto: "Toto", tournaments: "Tournaments", promotions: "Promotions" },
    common: { login: "Log In", register: "Register", deposit: "+ Deposit", betNow: "Bet Now", claimNow: "Claim Now", placeBet: "Place Bet", potentialWin: "Potential Win", betSlip: "Bet Slip", odds: "Odds", live: "Live", upcoming: "Upcoming", viewAll: "View All", search: "Search", support: "Support", stake: "Stake", singles: "Singles", combo: "Combo" },
    home: { liveOdds: "Live Odds", topCasino: "Top Casino Games", promotions: "Promotions", welcome: "Welcome to XBetZone" },
    chat: { title: "Support Chat", subtitle: "We're here to help 24/7", placeholder: "Type your message...", send: "Send", greeting: "Hi! Welcome to XBetZone Support. How can I help you today?" },
  },
  bn: {
    nav: { sports: "স্পোর্টস", live: "লাইভ", fastGames: "ফাস্ট গেমস", casino: "ক্যাসিনো", liveCasino: "লাইভ ক্যাসিনো", aviator: "এভিয়েটর", esports: "ই-স্পোর্টস", fantasySport: "ফ্যান্টাসি স্পোর্ট", virtualSports: "ভার্চুয়াল স্পোর্টস", poker: "পোকার", toto: "টোটো", tournaments: "টুর্নামেন্ট", promotions: "অফার" },
    common: { login: "লগইন", register: "নিবন্ধন", deposit: "+ জমা", betNow: "বেট করুন", claimNow: "দাবি করুন", placeBet: "বেট রাখুন", potentialWin: "সম্ভাব্য জয়", betSlip: "বেট স্লিপ", odds: "অডস", live: "লাইভ", upcoming: "আসন্ন", viewAll: "সব দেখুন", search: "খুঁজুন", support: "সহায়তা", stake: "বাজি", singles: "সিঙ্গেল", combo: "কম্বো" },
    home: { liveOdds: "লাইভ অডস", topCasino: "শীর্ষ ক্যাসিনো গেম", promotions: "অফার", welcome: "XBetZone-এ স্বাগতম" },
    chat: { title: "সাপোর্ট চ্যাট", subtitle: "আমরা ২৪/৭ সাহায্য করতে প্রস্তুত", placeholder: "আপনার বার্তা লিখুন...", send: "পাঠান", greeting: "হ্যালো! XBetZone সাপোর্টে স্বাগতম। আজ আমি কীভাবে সাহায্য করতে পারি?" },
  },
  hi: {
    nav: { sports: "खेल", live: "लाइव", fastGames: "फास्ट गेम्स", casino: "कैसीनो", liveCasino: "लाइव कैसीनो", aviator: "एविएटर", esports: "ई-स्पोर्ट्स", fantasySport: "फैंटेसी स्पोर्ट", virtualSports: "वर्चुअल स्पोर्ट्स", poker: "पोकर", toto: "टोटो", tournaments: "टूर्नामेंट", promotions: "ऑफ़र" },
    common: { login: "लॉग इन", register: "रजिस्टर", deposit: "+ जमा", betNow: "बेट करें", claimNow: "दावा करें", placeBet: "बेट लगाएं", potentialWin: "संभावित जीत", betSlip: "बेट स्लिप", odds: "ऑड्स", live: "लाइव", upcoming: "आगामी", viewAll: "सब देखें", search: "खोजें", support: "सहायता", stake: "दांव", singles: "सिंगल", combo: "कॉम्बो" },
    home: { liveOdds: "लाइव ऑड्स", topCasino: "शीर्ष कैसीनो गेम्स", promotions: "ऑफ़र", welcome: "XBetZone में स्वागत है" },
    chat: { title: "सपोर्ट चैट", subtitle: "हम 24/7 मदद के लिए यहाँ हैं", placeholder: "अपना संदेश लिखें...", send: "भेजें", greeting: "नमस्ते! XBetZone सपोर्ट में आपका स्वागत है। मैं आज आपकी कैसे मदद कर सकता हूँ?" },
  },
  ar: {
    nav: { sports: "رياضة", live: "مباشر", fastGames: "ألعاب سريعة", casino: "كازينو", liveCasino: "كازينو مباشر", aviator: "أفياتور", esports: "رياضة إلكترونية", fantasySport: "الرياضة الخيالية", virtualSports: "رياضة افتراضية", poker: "بوكر", toto: "توتو", tournaments: "بطولات", promotions: "عروض" },
    common: { login: "تسجيل الدخول", register: "تسجيل", deposit: "+ إيداع", betNow: "راهن الآن", claimNow: "احصل عليه", placeBet: "ضع الرهان", potentialWin: "الربح المحتمل", betSlip: "قسيمة الرهان", odds: "احتمالات", live: "مباشر", upcoming: "قادم", viewAll: "عرض الكل", search: "بحث", support: "دعم", stake: "رهان", singles: "مفرد", combo: "مركّب" },
    home: { liveOdds: "احتمالات مباشرة", topCasino: "أفضل ألعاب الكازينو", promotions: "عروض", welcome: "مرحباً بك في XBetZone" },
    chat: { title: "دردشة الدعم", subtitle: "نحن هنا للمساعدة 24/7", placeholder: "اكتب رسالتك...", send: "إرسال", greeting: "مرحباً! أهلاً بك في دعم XBetZone. كيف يمكنني مساعدتك اليوم؟" },
  },
  fr: {
    nav: { sports: "Sports", live: "En direct", fastGames: "Jeux Rapides", casino: "Casino", liveCasino: "Casino Live", aviator: "Aviator", esports: "eSports", fantasySport: "Sport Fantasy", virtualSports: "Sports Virtuels", poker: "Poker", toto: "Toto", tournaments: "Tournois", promotions: "Promotions" },
    common: { login: "Connexion", register: "S'inscrire", deposit: "+ Dépôt", betNow: "Parier", claimNow: "Réclamer", placeBet: "Placer le pari", potentialWin: "Gain potentiel", betSlip: "Coupon de paris", odds: "Cotes", live: "En direct", upcoming: "À venir", viewAll: "Tout voir", search: "Rechercher", support: "Support", stake: "Mise", singles: "Simples", combo: "Combiné" },
    home: { liveOdds: "Cotes en direct", topCasino: "Meilleurs jeux casino", promotions: "Promotions", welcome: "Bienvenue sur XBetZone" },
    chat: { title: "Chat Support", subtitle: "Nous sommes là 24h/24", placeholder: "Écrivez votre message...", send: "Envoyer", greeting: "Bonjour! Bienvenue sur le support XBetZone. Comment puis-je vous aider aujourd'hui?" },
  },
  tr: {
    nav: { sports: "Spor", live: "Canlı", fastGames: "Hızlı Oyunlar", casino: "Casino", liveCasino: "Canlı Casino", aviator: "Aviator", esports: "eSporlar", fantasySport: "Fantezi Spor", virtualSports: "Sanal Spor", poker: "Poker", toto: "Toto", tournaments: "Turnuvalar", promotions: "Promosyonlar" },
    common: { login: "Giriş Yap", register: "Kayıt Ol", deposit: "+ Para Yatır", betNow: "Bahis Yap", claimNow: "Talep Et", placeBet: "Bahis Oyna", potentialWin: "Potansiyel Kazanç", betSlip: "Bahis Kuponu", odds: "Oran", live: "Canlı", upcoming: "Yaklaşan", viewAll: "Tümünü Gör", search: "Ara", support: "Destek", stake: "Bahis", singles: "Tekli", combo: "Kombine" },
    home: { liveOdds: "Canlı Oranlar", topCasino: "En İyi Casino Oyunları", promotions: "Promosyonlar", welcome: "XBetZone'a Hoş Geldiniz" },
    chat: { title: "Destek Sohbeti", subtitle: "7/24 yardıma hazırız", placeholder: "Mesajınızı yazın...", send: "Gönder", greeting: "Merhaba! XBetZone Desteğe hoş geldiniz. Bugün size nasıl yardımcı olabilirim?" },
  },
  ru: {
    nav: { sports: "Спорт", live: "Лайв", fastGames: "Быстрые игры", casino: "Казино", liveCasino: "Лайв Казино", aviator: "Авиатор", esports: "Киберспорт", fantasySport: "Фэнтези спорт", virtualSports: "Виртуальный спорт", poker: "Покер", toto: "Тото", tournaments: "Турниры", promotions: "Акции" },
    common: { login: "Войти", register: "Регистрация", deposit: "+ Пополнить", betNow: "Ставить", claimNow: "Получить", placeBet: "Поставить", potentialWin: "Потенциальный выигрыш", betSlip: "Купон", odds: "Коэффициент", live: "Лайв", upcoming: "Предстоящие", viewAll: "Смотреть все", search: "Поиск", support: "Поддержка", stake: "Ставка", singles: "Одиночные", combo: "Экспресс" },
    home: { liveOdds: "Лайв коэффициенты", topCasino: "Лучшие игры казино", promotions: "Акции", welcome: "Добро пожаловать в XBetZone" },
    chat: { title: "Чат поддержки", subtitle: "Мы здесь 24/7", placeholder: "Введите сообщение...", send: "Отправить", greeting: "Привет! Добро пожаловать в поддержку XBetZone. Чем могу помочь?" },
  },
  pt: {
    nav: { sports: "Esportes", live: "Ao Vivo", fastGames: "Jogos Rápidos", casino: "Cassino", liveCasino: "Cassino Ao Vivo", aviator: "Aviator", esports: "eSports", fantasySport: "Fantasy Sport", virtualSports: "Esportes Virtuais", poker: "Poker", toto: "Toto", tournaments: "Torneios", promotions: "Promoções" },
    common: { login: "Entrar", register: "Registrar", deposit: "+ Depósito", betNow: "Apostar", claimNow: "Resgatar", placeBet: "Fazer Aposta", potentialWin: "Ganho Potencial", betSlip: "Cupom de Aposta", odds: "Odds", live: "Ao Vivo", upcoming: "Em Breve", viewAll: "Ver Tudo", search: "Buscar", support: "Suporte", stake: "Valor", singles: "Simples", combo: "Múltipla" },
    home: { liveOdds: "Odds Ao Vivo", topCasino: "Melhores Jogos de Cassino", promotions: "Promoções", welcome: "Bem-vindo ao XBetZone" },
    chat: { title: "Chat de Suporte", subtitle: "Estamos aqui 24/7", placeholder: "Digite sua mensagem...", send: "Enviar", greeting: "Olá! Bem-vindo ao Suporte XBetZone. Como posso ajudar você hoje?" },
  },
};

interface LanguageContextValue {
  lang: LangCode;
  langOption: LangOption;
  setLang: (code: LangCode) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>(() => {
    return (localStorage.getItem("xbz-lang") as LangCode) || "en";
  });

  const setLang = (code: LangCode) => {
    setLangState(code);
    localStorage.setItem("xbz-lang", code);
  };

  const langOption = LANGUAGES.find(l => l.code === lang)!;

  useEffect(() => {
    document.documentElement.dir = langOption.dir ?? "ltr";
    document.documentElement.lang = lang;
  }, [lang, langOption]);

  return (
    <LanguageContext.Provider value={{ lang, langOption, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}
