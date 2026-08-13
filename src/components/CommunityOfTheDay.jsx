import React, { useState } from 'react';
import { Award, TrendingUp, Users, Star, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import Badge from './ui/Badge';
import VerifiedBadge from './ui/VerifiedBadge';
import goldVerifyIcon from '../assets/gold-verify.png';

// Reusable avatar with blue initials fallback
function AvatarImg({ src, title, className }) {
  const [failed, setFailed] = useState(!src || src === 'null' || src.trim() === '');
  const initials = title
    ? title.split(' ').map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
    : 'TG';

  if (failed) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-[#005bf8] text-white font-black text-sm tracking-wider`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      className={`${className} object-cover`}
      onError={() => setFailed(true)}
    />
  );
}

export default function CommunityOfTheDay({ 
  communityOfDay, 
  trendingList, 
  onOpenPreview 
}) {
  const formatMembers = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'K';
    return num;
  };

  const featured = communityOfDay || {
    title: "Telegram News",
    username: "telegram",
    subscribers: 11400000,
    rating: 5.0,
    safetyScore: 100,
    description: "Official Telegram updates, feature releases, and announcements.",
    avatar: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Telegram_logo.svg/1024px-Telegram_logo.svg.png"
  };

  return (
    <section className="w-full max-w-[1200px] mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Block: Community of the Day (6 cols) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#f0f5ff] via-[#f8fafc] to-[#eef4ff] border border-[#dbe6fe] rounded-[32px] p-6 flex flex-col justify-between relative shadow-md">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-[#005bf8] text-white shadow-md">
                <Award className="size-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-base font-black text-[#1b2045] tracking-tight">Community of the Day</span>
                <span className="text-[11px] font-semibold text-[#787878]">Handpicked top-rated community</span>
              </div>
            </div>
            
            {/* Shimmering Golden Ribbon Trophy Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-white font-extrabold text-xs shadow-md border border-amber-300">
              <Zap className="size-3.5 fill-current" />
              <span>FEATURED</span>
            </div>
          </div>

          {/* Featured Inner Card */}
          <div className="bg-white rounded-[24px] p-6 border border-[#e2e8f5] shadow-sm flex flex-col justify-between flex-1 hover:border-[#005bf8]/50 transition-all duration-300">
            
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
              {/* Profile Avatar DP */}
              <div className="size-20 rounded-[20px] overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                <AvatarImg src={featured.avatar} title={featured.title} className="size-full" />
              </div>

              {/* Title, Badges & Bio */}
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-black text-[#1b2045] tracking-tight">
                    {featured.title}
                  </h3>
                  
                  {/* Golden Star Verified Badge for Community of the Day */}
                  <img 
                    src={goldVerifyIcon} 
                    alt="Gold Verified" 
                    className="size-6 object-contain flex-shrink-0 drop-shadow-sm" 
                    title="Community of the Day Gold Verified"
                  />
                </div>
                
                <div className="flex items-center gap-1.5 mb-2.5">
                  <Badge variant="glacial" size="sm">Official</Badge>
                  <Badge variant="emerald" size="sm" icon={ShieldCheck}>Verified</Badge>
                </div>

                <p className="text-xs text-[#555555] font-normal leading-relaxed">
                  {featured.description}
                </p>
              </div>
            </div>

            {/* Metrics Footer & CTA Button */}
            <div className="flex items-center justify-between border-t border-[#f0f0f0] pt-4 mt-2">
              <div className="flex items-center gap-4 text-xs font-bold text-[#1b2045]">
                <span className="flex items-center gap-1 text-[#4f4f4f]">
                  <Users className="size-4 text-[#005bf8]" />
                  {formatMembers(featured.subscribers)} Members
                </span>
                <span className="flex items-center gap-1 text-amber-500">
                  <Star className="size-4 fill-current" />
                  {featured.rating || 5.0} Safety
                </span>
              </div>

              <button
                onClick={() => onOpenPreview(featured)}
                className="bg-[#005bf8] hover:bg-[#0047c9] text-white text-xs font-extrabold px-5 py-2.5 rounded-full shadow-md transition-all active:scale-95 whitespace-nowrap cursor-pointer"
              >
                View Community
              </button>
            </div>

          </div>

        </div>

        {/* Right Block: Trending Communities Leaderboard (6 cols) */}
        <div className="lg:col-span-6 bg-gradient-to-br from-[#f0f5ff] via-[#f8fafc] to-[#eef4ff] border border-[#dbe6fe] rounded-[32px] p-6 flex flex-col justify-between shadow-md">
          
          {/* Header Bar */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-purple-600 text-white shadow-md">
                <TrendingUp className="size-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-base font-black text-[#1b2045] tracking-tight">Trending Communities</span>
                <span className="text-[11px] font-semibold text-[#787878]">Real-time engagement leaderboard</span>
              </div>
            </div>
            
            <a href="#explore" className="text-xs font-bold text-[#005bf8] hover:underline flex items-center gap-1">
              <span>View all</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>

          {/* 3 Ranked Floating Cards */}
          <div className="flex flex-col gap-3 flex-1 justify-center">
            {trendingList.map((item, idx) => {
              const rankGradients = [
                "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-md",
                "bg-gradient-to-br from-slate-400 to-slate-600 text-white shadow-sm",
                "bg-gradient-to-br from-amber-700 to-amber-900 text-white shadow-sm"
              ];

              return (
                <div 
                  key={item.id} 
                  onClick={() => onOpenPreview(item)}
                  className="bg-white rounded-[20px] p-3.5 border border-[#e2e8f5] flex items-center justify-between hover:border-[#005bf8] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5">
                    {/* Rank Badge */}
                    <div className={`size-8 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 ${rankGradients[idx]}`}>
                      #{idx + 1}
                    </div>

                    {/* Avatar DP */}
                    <div className="size-11 rounded-xl overflow-hidden border border-[#e9e9e9] flex-shrink-0">
                      <AvatarImg src={item.avatar} title={item.title} className="size-full" />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col text-left">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-extrabold text-[#1b2045] leading-tight group-hover:text-[#005bf8] transition-colors">
                          {item.title}
                        </span>
                        {item.verified && (
                          <VerifiedBadge size={15} />
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-[#787878] mt-0.5">
                        {formatMembers(item.subscribers)} Members
                      </span>
                    </div>
                  </div>

                  {/* Join Action Button */}
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="px-4 py-1.5 rounded-full border border-[#e2e8f5] bg-[#f8fafc] hover:border-[#005bf8] hover:bg-[#005bf8] hover:text-white text-[#1b2045] text-xs font-bold transition-all shadow-sm active:scale-95"
                  >
                    Join
                  </a>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
