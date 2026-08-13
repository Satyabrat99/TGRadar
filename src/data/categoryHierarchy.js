import { 
  Gem, 
  Cpu, 
  TrendingUp, 
  Zap, 
  Newspaper, 
  Briefcase, 
  PenTool, 
  GraduationCap, 
  PlayCircle, 
  HeartHandshake,
  Flame
} from 'lucide-react';

export const CATEGORY_HIERARCHY = [
  {
    id: "crypto-web3",
    name: "Crypto & Web3",
    icon: Gem,
    gradient: "from-[#005bf8] to-[#3b82f6]",
    totalCommunities: 420,
    subCategories: [
      { id: "defi", name: "DeFi & Yield Farming", count: 86, tags: ["solana", "ethereum", "staking", "yield", "dex"] },
      { id: "airdrops", name: "Airdrops & Retroactives", count: 120, tags: ["testnet", "faucet", "retroactive", "alpha"] },
      { id: "ton-eco", name: "TON Ecosystem & Jettons", count: 95, tags: ["jettons", "ton-coin", "notcoin", "dogs"] },
      { id: "nfts", name: "NFTs & Digital Art", count: 52, tags: ["mints", "ordinals", "solana-nfts", "whitelist"] },
      { id: "memecoins", name: "Memecoins & Degens", count: 67, tags: ["pepe", "wif", "pumpfun", "moonshots"] }
    ]
  },
  {
    id: "tech-ai",
    name: "Technology & AI",
    icon: Cpu,
    gradient: "from-[#8b5cf6] to-[#6366f1]",
    totalCommunities: 380,
    subCategories: [
      { id: "chatgpt", name: "ChatGPT & Prompting", count: 110, tags: ["gpt-4o", "prompts", "midjourney", "claude"] },
      { id: "software-eng", name: "Software Engineering", count: 145, tags: ["python", "react", "golang", "devops", "rust"] },
      { id: "cybersecurity", name: "Cybersecurity & Hacking", count: 75, tags: ["pentesting", "infosec", "bugbounty", "ctf"] },
      { id: "ai-tools", name: "AI Tools & Automation", count: 50, tags: ["n8n", "langchain", "agents", "automation"] }
    ]
  },
  {
    id: "trading-forex",
    name: "Trading & Forex",
    icon: TrendingUp,
    gradient: "from-[#10b981] to-[#059669]",
    totalCommunities: 290,
    subCategories: [
      { id: "forex-signals", name: "Forex & Currency Signals", count: 98, tags: ["eurusd", "xauusd", "scalping", "gold"] },
      { id: "stock-market", name: "Stock Market & Equities", count: 82, tags: ["sp500", "nasdaq", "daytrading", "options"] },
      { id: "crypto-trading", name: "Crypto Futures & Technicals", count: 110, tags: ["leverage", "binance", "bybit", "ta"] }
    ]
  },
  {
    id: "mini-apps",
    name: "Telegram Mini Apps",
    icon: Zap,
    gradient: "from-[#f59e0b] to-[#d97706]",
    totalCommunities: 510,
    subCategories: [
      { id: "tap-to-earn", name: "Tap-to-Earn & Clickers", count: 210, tags: ["notcoin", "hamster", "dogs", "blum"] },
      { id: "play-to-earn", name: "P2E Web3 Gaming", count: 180, tags: ["catizen", "pixels", "guilds", "quests"] },
      { id: "utility-bots", name: "Utility & Trading Bots", count: 120, tags: ["trojan", "bonkbot", "wallet", "dEX-bot"] }
    ]
  },
  {
    id: "nsfw-adult",
    name: "NSFW & 18+ Content",
    icon: Flame,
    gradient: "from-[#ef4444] to-[#dc2626]",
    totalCommunities: 650,
    isNsfwDomain: true,
    subCategories: [
      { id: "18-adult-channels", name: "18+ Adult Channels", count: 240, tags: ["nsfw", "adult", "18+", "uncensored"] },
      { id: "onlyfans-hubs", name: "OnlyFans & Model Hubs", count: 180, tags: ["onlyfans", "models", "leaks", "vip"] },
      { id: "dating-hookups", name: "Dating & Hookup Groups", count: 130, tags: ["dating", "single", "hookups", "chat18"] },
      { id: "nsfw-memes", name: "NSFW Memes & Humor", count: 100, tags: ["dark-humor", "nsfw-memes", "spicy"] }
    ]
  },
  {
    id: "news-media",
    name: "News & World Affairs",
    icon: Newspaper,
    gradient: "from-[#0284c7] to-[#1d4ed8]",
    totalCommunities: 230,
    subCategories: [
      { id: "world-news", name: "Breaking World News", count: 95, tags: ["global", "geopolitics", "conflict", "election"] },
      { id: "tech-news", name: "Tech & Venture News", count: 70, tags: ["startups", "silicon-valley", "ai-news"] },
      { id: "finance-news", name: "Global Financial Media", count: 65, tags: ["bloomberg", "reuters", "fed", "macro"] }
    ]
  },
  {
    id: "business-startups",
    name: "Business & Startups",
    icon: Briefcase,
    gradient: "from-[#ea580c] to-[#c2410c]",
    totalCommunities: 190,
    subCategories: [
      { id: "entrepreneurship", name: "SaaS & Founders", count: 72, tags: ["indie-hackers", "saas", "mrr", "bootstrap"] },
      { id: "venture-capital", name: "VC & Angel Investing", count: 58, tags: ["pitch decks", "fundraising", "angels"] },
      { id: "growth-marketing", name: "Growth & SEO Marketing", count: 60, tags: ["seo", "cold-email", "ads", "funnels"] }
    ]
  },
  {
    id: "design-tools",
    name: "Design & Creative",
    icon: PenTool,
    gradient: "from-[#ec4899] to-[#d946ef]",
    totalCommunities: 160,
    subCategories: [
      { id: "figma-ui", name: "Figma & UI/UX Systems", count: 68, tags: ["figma", "tokens", "design-system", "uikit"] },
      { id: "3d-motion", name: "3D Art & Motion Graphics", count: 48, tags: ["blender", "after-effects", "cinema4d"] },
      { id: "ai-art", name: "AI Art & Midjourney Prompts", count: 44, tags: ["midjourney", "stable-diffusion", "lora"] }
    ]
  },
  {
    id: "education-careers",
    name: "Education & Careers",
    icon: GraduationCap,
    gradient: "from-[#0891b2] to-[#0284c7]",
    totalCommunities: 210,
    subCategories: [
      { id: "remote-jobs", name: "Remote Jobs & Freelancing", count: 90, tags: ["remote", "tech-jobs", "freelance", "upwork"] },
      { id: "languages", name: "Languages & Linguistics", count: 65, tags: ["english", "spanish", "polyglot", "ielts"] },
      { id: "book-summaries", name: "Books & Audiobooks", count: 55, tags: ["ebooks", "summaries", "audiobooks", "kindle"] }
    ]
  },
  {
    id: "entertainment-movies",
    name: "Movies & Entertainment",
    icon: PlayCircle,
    gradient: "from-[#f43f5e] to-[#e11d48]",
    totalCommunities: 340,
    subCategories: [
      { id: "movies-series", name: "HD Movies & Series", count: 150, tags: ["netflix", "marvel", "4k", "series"] },
      { id: "anime", name: "Anime & Manga", count: 110, tags: ["crunchyroll", "subbed", "manga", "ost"] },
      { id: "music-podcasts", name: "Music & Podcasts", count: 80, tags: ["playlists", "hiphop", "dj-mixes", "spotify"] }
    ]
  },
  {
    id: "lifestyle-health",
    name: "Lifestyle & Fitness",
    icon: HeartHandshake,
    gradient: "from-[#10b981] to-[#047857]",
    totalCommunities: 150,
    subCategories: [
      { id: "fitness-workout", name: "Gym, Fitness & Workouts", count: 55, tags: ["calisthenics", "bodybuilding", "diet"] },
      { id: "mental-health", name: "Psychology & Self-Care", count: 50, tags: ["mindfulness", "habits", "stoicism"] },
      { id: "travel-nomads", name: "Travel & Digital Nomads", count: 45, tags: ["visas", "bali", "flights", "co-living"] }
    ]
  }
];
