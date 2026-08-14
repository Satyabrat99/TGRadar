import React, { useState, useEffect, useRef } from 'react';
import { UserCheck, LayoutGrid, ShieldCheck } from 'lucide-react';
import Navbar from './Navbar';
import SearchWithSuggestions from './SearchWithSuggestions';

export default function Hero({ 
  searchVal, 
  onSearchChange, 
  totalMembers, 
  totalCount,
  communities,
  bookmarksCount, 
  onOpenBookmarks, 
  onOpenSubmit,
  onOpenPreview 
}) {
  // Mouse parallax state
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  function handleMouseMove(e) {
    const rect = heroRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    setMouse({
      x: ((e.clientX - rect.left) - cx) / cx, // -1 to 1
      y: ((e.clientY - rect.top)  - cy) / cy,
    });
  }

  function handleMouseLeave() { setMouse({ x: 0, y: 0 }); }

  const px = (factor) => `translateX(${mouse.x * factor}px) translateY(${mouse.y * factor}px)`;

  // Dynamically compute live metrics from communities dataset
  const totalReachableMembers = React.useMemo(() => {
    if (!communities || communities.length === 0) return '52.8M+';
    const total = communities.reduce((acc, c) => acc + (parseInt(c.subscribers, 10) || 0), 0);
    if (total >= 1000000000) return (total / 1000000000).toFixed(1) + 'B+';
    if (total >= 1000000) return (total / 1000000).toFixed(1) + 'M+';
    if (total >= 1000) return (total / 1000).toFixed(0) + 'K+';
    return total.toLocaleString() + '+';
  }, [communities]);

  const totalDomainsCount = React.useMemo(() => {
    if (!communities || communities.length === 0) return 10;
    const uniqueCategories = new Set(communities.map(c => c.category?.split(' ')[0]).filter(Boolean));
    return Math.max(uniqueCategories.size, 10);
  }, [communities]);

  const averageSafety = React.useMemo(() => {
    if (!communities || communities.length === 0) return '98% Average';
    const total = communities.reduce((acc, c) => acc + (parseInt(c.safetyScore, 10) || 98), 0);
    const avg = Math.round(total / communities.length);
    return `${avg}% Average`;
  }, [communities]);


  return (
    <>
      {/* ── Keyframe Animations ─────────────────────────────────── */}
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes heroPop {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes floatA {
          0%,100% { transform: translateY(0px);   }
          50%      { transform: translateY(-10px); }
        }
        @keyframes floatB {
          0%,100% { transform: translateY(0px);  }
          50%      { transform: translateY(8px);  }
        }
        @keyframes pulseGlow {
          0%,100% { opacity: 0.10; }
          50%      { opacity: 0.20; }
        }
        @keyframes rotateRing {
          from { transform: rotate(0deg);   }
          to   { transform: rotate(360deg); }
        }
        @keyframes waveDrift {
          0%,100% { transform: translateX(0px);  }
          50%      { transform: translateX(12px); }
        }
        .hero-badge    { animation: heroPop   0.6s cubic-bezier(0.34,1.56,0.64,1) 0.1s both; }
        .hero-h1       { animation: heroFadeUp 0.7s ease                           0.25s both; }
        .hero-sub      { animation: heroFadeUp 0.7s ease                           0.4s  both; }
        .hero-search   { animation: heroPop   0.7s cubic-bezier(0.34,1.56,0.64,1) 0.5s  both; }
        .hero-stat-0   { animation: heroPop   0.6s cubic-bezier(0.34,1.56,0.64,1) 0.62s both; }
        .hero-stat-1   { animation: heroPop   0.6s cubic-bezier(0.34,1.56,0.64,1) 0.72s both; }
        .hero-stat-2   { animation: heroPop   0.6s cubic-bezier(0.34,1.56,0.64,1) 0.82s both; }
        .deco-float-a  { animation: floatA    5s ease-in-out infinite; }
        .deco-float-b  { animation: floatB    7s ease-in-out infinite; }
        .deco-float-c  { animation: floatA    9s ease-in-out 1s infinite; }
        .deco-glow     { animation: pulseGlow 4s ease-in-out infinite; }
        .deco-ring     { animation: rotateRing 30s linear infinite; transform-origin: 200px 200px; }
        .deco-wave     { animation: waveDrift  8s ease-in-out infinite; }
      `}</style>

      <div
        ref={heroRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-full bg-gradient-to-b from-[#005bf8] via-[#0066ff] to-[#0055ee] rounded-b-[40px] text-white relative overflow-hidden pb-14 shadow-xl"
      >
        {/* Floating Navbar */}
        <Navbar 
          bookmarksCount={bookmarksCount} 
          onOpenBookmarks={onOpenBookmarks} 
          onOpenSubmit={onOpenSubmit} 
        />

        {/* ── Decorative Background Layer (parallax & animations) ── */}
        


        {/* Ambient Glowing Blobs */}
        <div className="deco-glow absolute top-1/4 left-1/4 size-80 bg-white/20 rounded-full blur-3xl pointer-events-none" />
        <div 
          className="deco-glow absolute bottom-10 right-16 size-96 bg-blue-300/25 rounded-full blur-3xl pointer-events-none"
          style={{ animationDelay: '2s' }} 
        />

        {/* Bottom-left: concentric arc waves — drifts slowly */}
        <svg
          className="absolute bottom-0 left-0 pointer-events-none deco-wave"
          style={{ opacity: 0.22, transform: px(6) + ' translateX(0)' }}
          width="360" height="300" viewBox="0 0 340 280" fill="none"
        >
          <path d="M-40 280 Q60 180 180 200 Q280 220 340 140" stroke="white" strokeWidth="2" fill="none"/>
          <path d="M-60 280 Q50 160 190 185 Q300 210 360 110" stroke="white" strokeWidth="2" fill="none"/>
          <path d="M-80 280 Q40 140 200 170 Q320 200 380 80"  stroke="white" strokeWidth="2" fill="none"/>
          <path d="M-100 280 Q30 120 210 155 Q340 190 400 50" stroke="white" strokeWidth="2" fill="none"/>
          <path d="M-120 280 Q20 100 220 140 Q360 180 420 20" stroke="white" strokeWidth="2" fill="none"/>
          <path d="M-140 280 Q10 80 230 125 Q380 170 440 -10" stroke="white" strokeWidth="2" fill="none"/>
        </svg>

        {/* Bottom-right: rotating dashed radar ring + floating satellite dot */}
        <svg
          className="absolute bottom-[-50px] right-[-50px] pointer-events-none"
          style={{ opacity: 0.25, transform: px(-8) }}
          width="320" height="320" viewBox="0 0 300 300" fill="none"
        >
          <circle className="deco-ring" cx="200" cy="200" r="140" stroke="white" strokeWidth="2" strokeDasharray="8 6"/>
          <circle cx="200" cy="200" r="90" stroke="white" strokeWidth="1.5"/>
          <circle className="deco-float-a" cx="136" cy="118" r="18" fill="white" opacity="0.8"/>
        </svg>

        {/* Top-right: sparkle crosshairs & floating particles */}
        <svg
          className="absolute top-12 right-16 pointer-events-none deco-float-b"
          style={{ opacity: 0.35, transform: px(-5) }}
          width="130" height="90" viewBox="0 0 120 80" fill="none"
        >
          <circle cx="10"  cy="10"  r="3" fill="white"/>
          <circle cx="60"  cy="6"   r="2.5" fill="white"/>
          <circle cx="108" cy="18"  r="3.5" fill="white"/>
          <circle cx="30"  cy="55"  r="2.5" fill="white"/>
          <circle cx="90"  cy="62"  r="3" fill="white"/>
          <line x1="75" y1="28" x2="75" y2="38" stroke="white" strokeWidth="2"/>
          <line x1="70" y1="33" x2="80" y2="33" stroke="white" strokeWidth="2"/>
          <line x1="112" y1="44" x2="112" y2="52" stroke="white" strokeWidth="2"/>
          <line x1="108" y1="48" x2="116" y2="48" stroke="white" strokeWidth="2"/>
        </svg>

        {/* Top-left: crosshair sparkles & floating stars */}
        <svg
          className="absolute top-16 left-12 pointer-events-none deco-float-c"
          style={{ opacity: 0.32, transform: px(5) }}
          width="110" height="100" viewBox="0 0 100 90" fill="none"
        >
          <circle cx="8"  cy="8"  r="3" fill="white"/>
          <circle cx="55" cy="4"  r="2.5" fill="white"/>
          <circle cx="22" cy="60" r="2.5" fill="white"/>
          <circle cx="80" cy="70" r="3.5" fill="white"/>
          <line x1="42" y1="28" x2="42" y2="38" stroke="white" strokeWidth="2"/>
          <line x1="37" y1="33" x2="47" y2="33" stroke="white" strokeWidth="2"/>
        </svg>

        {/* Middle-left: floating orb */}
        <svg
          className="absolute top-[48%] left-10 pointer-events-none deco-float-a"
          style={{ opacity: 0.25, transform: px(10) }}
          width="44" height="44" viewBox="0 0 40 40" fill="none"
        >
          <circle cx="20" cy="20" r="14" fill="white"/>
        </svg>

        {/* Middle-right: hollow radar ring */}
        <svg
          className="absolute top-[32%] right-20 pointer-events-none"
          style={{ opacity: 0.22, transform: px(-12) }}
          width="80" height="80" viewBox="0 0 70 70" fill="none"
        >
          <circle cx="35" cy="35" r="30" stroke="white" strokeWidth="2"/>
        </svg>

        {/* Dynamic Foreground Content with Generous Navbar Spacing */}
        <div className="relative z-10 flex flex-col items-center text-center pt-8 sm:pt-14">
          
          {/* Live Badge */}
          <div className="hero-badge inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider text-white mb-6 sm:mb-8 border border-white/25 shadow-md hover:bg-white/25 hover:scale-105 transition-all cursor-default mx-auto">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full size-2 bg-emerald-400"></span>
            </span>
            <strong className="text-emerald-300">{totalCount || communities.length}+ Communities Indexed</strong>
            <span className="opacity-40">·</span>
            <span className="text-[10px] font-semibold text-white/80">Live Sync</span>
          </div>

          {/* Headline */}
          <h1 className="hero-h1 text-3xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight max-w-4xl mb-4 !text-white drop-shadow-sm px-4 text-center mx-auto">
            The Verified Multiverse of <br />
            Telegram Communities
          </h1>

          {/* Subtext */}
          <p className="hero-sub !text-white/90 text-sm md:text-base max-w-2xl mx-auto font-normal leading-relaxed mb-8 px-4 text-center">
            Discover top-tier channels, automation bots, interactive supergroups, and Web3 mini apps curated across {totalDomainsCount} major domains.
          </p>

          {/* Search */}
          <div className="hero-search w-full max-w-2xl mx-auto mb-10">
            <SearchWithSuggestions
              searchVal={searchVal}
              onSearchChange={onSearchChange}
              communities={communities}
              onOpenPreview={onOpenPreview}
            />
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
            {[
              { icon: <UserCheck className="size-5" />, value: totalReachableMembers, label: 'Reachable Members', cls: 'hero-stat-0' },
              { icon: <LayoutGrid className="size-5"/>, value: `${totalDomainsCount} Domains`, label: 'Curated Hubs',       cls: 'hero-stat-1' },
              { icon: <ShieldCheck className="size-5"/>,value: averageSafety, label: 'Safety Rating',      cls: 'hero-stat-2' },
            ].map(({ icon, value, label, cls }) => (
              <div
                key={label}
                className={`${cls} group bg-white/10 backdrop-blur-md border border-white/20 rounded-[20px] p-4 flex items-center justify-center gap-3
                  hover:bg-white/20 hover:border-white/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 cursor-default`}
              >
                <div className="p-2.5 rounded-full bg-white/15 text-white group-hover:bg-white/25 group-hover:scale-110 transition-all duration-300">
                  {icon}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xl font-bold leading-none !text-white">{value}</span>
                  <span className="text-[11px] font-medium !text-white/80 uppercase tracking-wider mt-1">{label}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
