import React from 'react';
import { 
  Gem, 
  TrendingUp, 
  Code2, 
  Bot, 
  PenTool, 
  Megaphone, 
  GraduationCap, 
  PlayCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

const CATEGORIES = [
  { name: "Crypto & Web3", icon: Gem, gradient: "from-[#005bf8] to-[#3b82f6]", defaultCount: "420 Hubs" },
  { name: "Trading & Forex", icon: TrendingUp, gradient: "from-[#10b981] to-[#059669]", defaultCount: "290 Hubs" },
  { name: "Tech & Software Engineering", icon: Code2, gradient: "from-[#06b6d4] to-[#0284c7]", defaultCount: "380 Hubs" },
  { name: "AI & Machine Learning", icon: Bot, gradient: "from-[#8b5cf6] to-[#6366f1]", defaultCount: "310 Hubs" },
  { name: "Design & Creative Tools", icon: PenTool, gradient: "from-[#ec4899] to-[#d946ef]", defaultCount: "160 Hubs" },
  { name: "Business & Startups", icon: Megaphone, gradient: "from-[#f59e0b] to-[#d97706]", defaultCount: "190 Hubs" },
  { name: "Education & Careers", icon: GraduationCap, gradient: "from-[#0284c7] to-[#1d4ed8]", defaultCount: "210 Hubs" },
  { name: "Movies & Entertainment", icon: PlayCircle, gradient: "from-[#f43f5e] to-[#e11d48]", defaultCount: "340 Hubs" }
];

export default function IndustrySpotlight({ 
  selectedIndustry, 
  onSelectIndustry,
  onOpenCategoriesModal 
}) {
  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 pt-10 sm:pt-12 pb-8">
      <div className="flex flex-col gap-5 sm:gap-6">
        
        {/* Header Row: Responsive Stack on Mobile */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left">
          
          {/* Heading & Subtitle */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-[#1b2045] tracking-tight">Explore Categories</h2>
              <span className="bg-[#005bf8]/10 text-[#005bf8] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-[#005bf8]/20">
                <Sparkles className="size-3" />
                Curated
              </span>

              {selectedIndustry && (
                <button
                  onClick={() => onSelectIndustry(null)}
                  className="text-xs font-bold text-red-500 hover:underline uppercase tracking-wider transition-colors ml-auto sm:ml-2 cursor-pointer"
                >
                  Clear Filter
                </button>
              )}
            </div>
            <p className="text-xs text-[#787878] font-medium mt-1">Filter verified Telegram communities by industry focus</p>
          </div>
          
          {/* Desktop "View all 10+ categories" Button */}
          <button 
            onClick={onOpenCategoriesModal}
            className="hidden sm:flex items-center gap-1.5 bg-[#f0f4ff] hover:bg-[#e0ebff] text-[#005bf8] text-xs font-extrabold px-4 py-2 rounded-full transition-all cursor-pointer shadow-2xs border border-[#dbe6fe] active:scale-95 whitespace-nowrap self-start sm:self-auto"
          >
            <span>View all 10+ categories</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>

        {/* 3D Glass Category Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 sm:gap-3.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedIndustry === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => onSelectIndustry(isActive ? null : cat.name)}
                className={`bg-white rounded-[24px] p-3.5 sm:p-4 border flex flex-col items-center justify-between text-center gap-2.5 sm:gap-3 transition-all duration-300 cursor-pointer shadow-2xs ${
                  isActive 
                    ? 'border-[#005bf8] bg-gradient-to-b from-[#eef4ff] to-white shadow-md -translate-y-1 ring-2 ring-[#005bf8]/20' 
                    : 'border-[#e9e9e9] hover:border-[#005bf8] hover:shadow-md hover:-translate-y-1'
                }`}
              >
                {/* 3D Gradient Icon Roundel */}
                <div className={`size-10 sm:size-11 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110 flex-shrink-0`}>
                  <Icon className="size-4 sm:size-5" />
                </div>
                
                {/* Text & Count */}
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xs font-extrabold text-[#1b2045] leading-tight line-clamp-2">
                    {cat.name}
                  </span>
                  <span className="text-[10px] font-semibold text-[#787878]">
                    {cat.defaultCount}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Mobile View All Categories CTA (Positioned below grid for clean mobile UX) */}
        <div className="sm:hidden w-full pt-1">
          <button 
            onClick={onOpenCategoriesModal}
            className="w-full bg-[#f0f4ff] hover:bg-[#e0ebff] text-[#005bf8] text-xs font-extrabold py-3 px-5 rounded-2xl transition-all cursor-pointer border border-[#dbe6fe] flex items-center justify-center gap-2 active:scale-95 shadow-xs"
          >
            <span>View all 10+ categories</span>
            <ArrowRight className="size-4" />
          </button>
        </div>

      </div>
    </section>
  );
}
