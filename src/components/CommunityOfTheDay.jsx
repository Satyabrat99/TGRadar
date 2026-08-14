import React, { useState } from 'react';
import { Award, TrendingUp, Users, Star, ArrowRight, ShieldCheck, Zap, Crown, Medal, Trophy } from 'lucide-react';
import Badge from './ui/Badge';
import VerifiedBadge from './ui/VerifiedBadge';
import goldVerifyIcon from '../assets/gold-verify.png';

// Reusable avatar with blue initials fallback
function AvatarImg({ src, title, className }) {
  const [failed, setFailed] = React.useState(!src || src === 'null' || !src || !src.trim());

  React.useEffect(() => {
    setFailed(!src || src === 'null' || !src || !src.trim());
  }, [src]);

  const cleanTitle = title ? title.replace(/[^a-zA-Z0-9 ]/g, '').trim() : '';
  const initials = cleanTitle
    ? cleanTitle.split(/\s+/).map(n => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase()
    : 'TG';

  if (failed || !src || src === 'null' || !src || !src.trim()) {
    return (
      <div
        className={`${className} flex items-center justify-center bg-[#005bf8] text-white font-black text-lg tracking-wider flex-shrink-0 select-none`}
      >
        {initials || 'TG'}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title || 'Avatar'}
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
                <AvatarImg key={featured.avatar || featured.username || featured.id} src={featured.avatar} title={featured.title} className="size-full" />
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
              const rankConfigs = [
                {
                  badgeClass: "bg-gradient-to-br from-[#fef08a] via-[#f59e0b] to-[#d97706] text-[#451a03] border-2 border-[#fffbeb] shadow-[0_4px_14px_rgba(245,158,11,0.35)] ring-2 ring-[#fef3c7]/60",
                  icon: Crown,
                  iconColor: "text-[#78350f]",
                  accentBg: "bg-amber-500/10"
                },
                {
                  badgeClass: "bg-gradient-to-br from-[#ffffff] via-[#cbd5e1] to-[#94a3b8] text-[#0f172a] border-2 border-white shadow-[0_4px_12px_rgba(100,116,139,0.3)] ring-2 ring-[#f1f5f9]/80",
                  icon: Medal,
                  iconColor: "text-[#334155]",
                  accentBg: "bg-slate-500/10"
                },
                {
                  badgeClass: "bg-gradient-to-br from-[#ffedd5] via-[#fb923c] to-[#c2410c] text-[#431407] border-2 border-[#fff7ed] shadow-[0_4px_12px_rgba(217,119,6,0.3)] ring-2 ring-[#ffedd5]/80",
                  icon: Trophy,
                  iconColor: "text-[#7c2d12]",
                  accentBg: "bg-orange-500/10"
                }
              ];

              const currentRank = rankConfigs[idx] || rankConfigs[0];
              const RankIcon = currentRank.icon;

              return (
                <div 
                  key={item.id} 
                  onClick={() => onOpenPreview(item)}
                  className="bg-white rounded-[22px] p-3.5 border border-[#e2e8f5] flex items-center justify-between hover:border-[#005bf8] hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* Prestigious Podium Rank Badge */}
                    <div className={`size-9 rounded-2xl flex items-center justify-center font-black text-xs flex-shrink-0 shadow-sm transition-transform group-hover:scale-105 ${currentRank.badgeClass}`}>
                      <div className="flex items-center gap-0.5">
                        <RankIcon className={`size-3.5 ${currentRank.iconColor} fill-current/20`} />
                        <span className="font-black tracking-tight">{idx + 1}</span>
                      </div>
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
