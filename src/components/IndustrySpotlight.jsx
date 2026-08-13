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
  { name: "Crypto & Web3", icon: Gem, gradient: "from-[#005bf8] to-[#3b82f6]", count: "420 Hubs" },
  { name: "Trading & Forex", icon: TrendingUp, gradient: "from-[#10b981] to-[#059669]", count: "290 Hubs" },
  { name: "Tech & Software Engineering", icon: Code2, gradient: "from-[#06b6d4] to-[#0284c7]", count: "380 Hubs" },
  { name: "AI & Machine Learning", icon: Bot, gradient: "from-[#8b5cf6] to-[#6366f1]", count: "310 Hubs" },
  { name: "Design & Creative Tools", icon: PenTool, gradient: "from-[#ec4899] to-[#d946ef]", count: "160 Hubs" },
  { name: "Business & Startups", icon: Megaphone, gradient: "from-[#f59e0b] to-[#d97706]", count: "190 Hubs" },
  { name: "Education & Careers", icon: GraduationCap, gradient: "from-[#0284c7] to-[#1d4ed8]", count: "210 Hubs" },
  { name: "Movies & Entertainment", icon: PlayCircle, gradient: "from-[#f43f5e] to-[#e11d48]", count: "340 Hubs" }
];

export default function IndustrySpotlight({ 
  selectedIndustry, 
  onSelectIndustry,
  onOpenCategoriesModal 
}) {
  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 pt-12 pb-8">
      <div className="flex flex-col gap-6">
        
        {/* Header Row */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-[#1b2045] tracking-tight">Explore Categories</h2>
              <span className="bg-[#005bf8]/10 text-[#005bf8] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="size-3" />
                Curated
              </span>
            </div>
            <p className="text-xs text-[#787878] font-normal mt-0.5">Filter verified Telegram communities by industry focus</p>
          </div>
          
          <div className="flex items-center gap-3">
            {selectedIndustry && (
              <button
                onClick={() => onSelectIndustry(null)}
                className="text-xs font-bold text-red-500 hover:underline uppercase tracking-wider transition-colors"
              >
                Clear Filter
              </button>
            )}

            {/* Launch Categories Directory Explorer Modal */}
            <button 
              onClick={onOpenCategoriesModal}
              className="text-xs font-extrabold text-[#005bf8] hover:underline flex items-center gap-1 bg-[#f0f4ff] hover:bg-[#e0ebff] px-4 py-2 rounded-full transition-all cursor-pointer shadow-2xs"
            >
              <span>View all 10+ categories</span>
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>

        {/* 3D Glass Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3.5">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedIndustry === cat.name;

            return (
              <button
                key={cat.name}
                onClick={() => onSelectIndustry(isActive ? null : cat.name)}
                className={`bg-white rounded-[24px] p-4 border flex flex-col items-center justify-between text-center gap-3 transition-all duration-300 cursor-pointer shadow-sm ${
                  isActive 
                    ? 'border-[#005bf8] bg-gradient-to-b from-[#eef4ff] to-white shadow-lg -translate-y-1.5 ring-2 ring-[#005bf8]/20' 
                    : 'border-[#e9e9e9] hover:border-[#005bf8] hover:shadow-xl hover:-translate-y-1.5'
                }`}
              >
                {/* 3D Gradient Icon Roundel */}
                <div className={`size-11 rounded-2xl bg-gradient-to-br ${cat.gradient} text-white flex items-center justify-center shadow-md transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="size-5" />
                </div>
                
                {/* Text & Count */}
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-xs font-extrabold text-[#1b2045] leading-tight line-clamp-2">
                    {cat.name}
                  </span>
                  <span className="text-[10px] font-semibold text-[#787878]">
                    {cat.count}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
