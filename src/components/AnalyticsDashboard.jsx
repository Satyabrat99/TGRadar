import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  BarChart3, 
  Users, 
  Eye, 
  Send, 
  Search, 
  Smartphone, 
  Laptop, 
  Activity, 
  RefreshCw,
  TrendingUp,
  Globe,
  Sparkles,
  MousePointerClick,
  Clock
} from 'lucide-react';
import { fetchAnalyticsData } from '../lib/analytics';

export default function AnalyticsDashboard({ onBackToApp }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAnalyticsData();
    setStats(data);
    setLoading(false);
    setLastRefreshed(new Date());
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatRelativeTime = (isoString) => {
    if (!isoString) return 'Just now';
    const diffMs = Date.now() - new Date(isoString).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    if (diffSec < 60) return `${diffSec}s ago`;
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHrs = Math.floor(diffMin / 60);
    if (diffHrs < 24) return `${diffHrs}h ago`;
    return `${Math.floor(diffHrs / 24)}d ago`;
  };

  // 7-Day Chart SVG Math (Shadcn Recharts Style)
  const days = stats?.last7Days || [];
  const maxVal = Math.max(...days.map(d => Math.max(d.views, d.joins)), 5);

  const svgW = 760;
  const svgH = 220;
  const padX = 40;
  const padY = 30;
  const graphW = svgW - padX * 2;
  const graphH = svgH - padY * 2;

  const ptsViews = days.map((d, i) => ({
    x: padX + (i / Math.max(days.length - 1, 1)) * graphW,
    y: padY + graphH - (d.views / maxVal) * graphH,
    val: d.views,
    date: d.date
  }));

  const ptsJoins = days.map((d, i) => ({
    x: padX + (i / Math.max(days.length - 1, 1)) * graphW,
    y: padY + graphH - (d.joins / maxVal) * graphH,
    val: d.joins,
    date: d.date
  }));

  // Smooth Monotone Catmull-Rom / Bezier Curve for Shadcn Spline
  const createSplinePath = (pts) => {
    if (!pts || pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x},${pts[0].y}`;

    let d = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) * 0.45;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) * 0.55;
      const cpY2 = p1.y;
      d += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${p1.x},${p1.y}`;
    }
    return d;
  };

  const pathViewsD = createSplinePath(ptsViews);
  const pathJoinsD = createSplinePath(ptsJoins);

  const areaViewsD = ptsViews.length > 0 
    ? `${pathViewsD} L ${ptsViews[ptsViews.length - 1].x},${svgH - padY} L ${ptsViews[0].x},${svgH - padY} Z`
    : '';

  const areaJoinsD = ptsJoins.length > 0 
    ? `${pathJoinsD} L ${ptsJoins[ptsJoins.length - 1].x},${svgH - padY} L ${ptsJoins[0].x},${svgH - padY} Z`
    : '';

  const activeDay = hoveredIdx !== null ? days[hoveredIdx] : null;
  const activePtView = hoveredIdx !== null ? ptsViews[hoveredIdx] : null;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col font-sans antialiased selection:bg-[#005bf8] selection:text-white">
      
      {/* Top Floating Glass Header */}
      <header className="w-full bg-white/95 backdrop-blur-md border-b border-[#e2e8f0] sticky top-0 z-40">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToApp}
              className="flex items-center gap-1.5 text-xs font-extrabold text-[#005bf8] bg-[#f0f4ff] hover:bg-[#e0ebff] px-3.5 py-1.5 rounded-full border border-[#dbe6fe] transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back</span>
            </button>
            
            <div className="h-4 w-px bg-[#e2e8f0]"></div>
            
            <h1 className="text-base font-black text-[#0f172a] tracking-tight">Analytics</h1>
          </div>

          <div className="flex items-center gap-3 text-xs text-[#64748b]">
            <span className="hidden sm:inline-block font-semibold">
              Updated {formatRelativeTime(lastRefreshed)}
            </span>
            <button
              onClick={loadData}
              disabled={loading}
              className="p-2 rounded-full hover:bg-[#f1f5f9] text-[#0f172a] transition-all cursor-pointer border border-[#e2e8f0] active:scale-95 disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw className={`size-3.5 ${loading ? 'animate-spin text-[#005bf8]' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Analytics Container */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto p-4 sm:p-8 flex flex-col gap-6 text-left">
        
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Views Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-[26px] p-5 flex flex-col gap-3 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-center justify-between text-[#64748b]">
              <span className="text-xs font-extrabold uppercase tracking-wider">Total Page Views</span>
              <div className="p-2.5 rounded-2xl bg-[#005bf8]/10 text-[#005bf8] group-hover:scale-110 transition-transform">
                <Eye className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0f172a]">{stats?.totalViews || 0}</span>
              <span className="text-xs font-extrabold text-[#005bf8] bg-[#f0f4ff] border border-[#dbe6fe] px-2.5 py-0.5 rounded-full">
                +{stats?.todayViews || 0} Today
              </span>
            </div>
            <p className="text-xs text-[#64748b] font-medium">7-Day Total: {stats?.weekViews || 0} visits</p>
          </div>

          {/* Unique Visitors Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-[26px] p-5 flex flex-col gap-3 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-center justify-between text-[#64748b]">
              <span className="text-xs font-extrabold uppercase tracking-wider">Unique Visitors</span>
              <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-600 group-hover:scale-110 transition-transform">
                <Users className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0f172a]">{stats?.uniqueVisitors || 0}</span>
              <span className="text-xs font-extrabold text-purple-700 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
                Distinct Devices
              </span>
            </div>
            <p className="text-xs text-[#64748b] font-medium">Anonymous device sessions</p>
          </div>

          {/* Telegram Outbound Joins Card */}
          <div className="bg-white border border-[#e2e8f0] rounded-[26px] p-5 flex flex-col gap-3 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-center justify-between text-[#64748b]">
              <span className="text-xs font-extrabold uppercase tracking-wider">Telegram Redirects</span>
              <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 group-hover:scale-110 transition-transform">
                <Send className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0f172a]">{stats?.totalJoins || 0}</span>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                +{stats?.todayJoins || 0} Today
              </span>
            </div>
            <p className="text-xs text-[#64748b] font-medium">
              Conversion Rate: {stats?.totalViews ? ((stats.totalJoins / stats.totalViews) * 100).toFixed(1) : '0'}%
            </p>
          </div>

          {/* Total Logged Interactions */}
          <div className="bg-white border border-[#e2e8f0] rounded-[26px] p-5 flex flex-col gap-3 shadow-xs hover:shadow-md transition-all duration-300 relative overflow-hidden group">
            <div className="flex items-center justify-between text-[#64748b]">
              <span className="text-xs font-extrabold uppercase tracking-wider">Total Interactions</span>
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 group-hover:scale-110 transition-transform">
                <Activity className="size-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#0f172a]">{stats?.totalEvents || 0}</span>
              <span className="text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                Actions Logged
              </span>
            </div>
            <p className="text-xs text-[#64748b] font-medium">Searches, Clicks & Views</p>
          </div>

        </div>

        {/* SHADCN-STYLE 7-DAY TRAFFIC LINE CHART */}
        <div className="bg-white border border-[#e2e8f0] rounded-[32px] p-6 flex flex-col gap-4 shadow-xs relative">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f1f5f9] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#005bf8]/10 text-[#005bf8]">
                <TrendingUp className="size-5" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-base font-black text-[#0f172a]">7-Day Traffic Volume</h2>
                <span className="text-xs text-[#64748b] font-medium">Page views vs. Telegram outbound clicks over the last 7 days</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-extrabold bg-[#f8fafc] px-3.5 py-1.5 rounded-full border border-[#e2e8f0]">
              <span className="flex items-center gap-1.5 text-[#005bf8]">
                <span className="size-2 rounded-full bg-[#005bf8]"></span>
                Page Views
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="size-2 rounded-full bg-emerald-500"></span>
                Telegram Joins
              </span>
            </div>
          </div>

          {/* Shadcn Chart Canvas */}
          <div 
            className="relative w-full overflow-hidden select-none pt-2"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#005bf8" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#005bf8" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Reference Gridlines */}
              {[0, 0.33, 0.66, 1].map((ratio, idx) => {
                const y = padY + ratio * graphH;
                return (
                  <line 
                    key={idx} 
                    x1={padX} 
                    y1={y} 
                    x2={svgW - padX} 
                    y2={y} 
                    stroke="#f1f5f9" 
                    strokeDasharray="3 3"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Translucent Area Fills */}
              {areaViewsD && <path d={areaViewsD} fill="url(#blueGradient)" />}
              {areaJoinsD && <path d={areaJoinsD} fill="url(#emeraldGradient)" />}

              {/* Active Hover Vertical Cursor Line (Shadcn Style) */}
              {hoveredIdx !== null && activePtView && (
                <line
                  x1={activePtView.x}
                  y1={padY}
                  x2={activePtView.x}
                  y2={svgH - padY}
                  stroke="#cbd5e1"
                  strokeDasharray="3 3"
                  strokeWidth="1.5"
                />
              )}

              {/* Smooth Spline Paths */}
              {pathViewsD && (
                <path d={pathViewsD} fill="none" stroke="#005bf8" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              )}
              {pathJoinsD && (
                <path d={pathJoinsD} fill="none" stroke="#10b981" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
              )}

              {/* Node Dots: Page Views (Electric Blue) */}
              {ptsViews.map((pt, idx) => {
                const isHovered = hoveredIdx === idx;
                return (
                  <g key={`v-${idx}`} className="cursor-pointer">
                    {isHovered && (
                      <circle cx={pt.x} cy={pt.y} r="8" fill="#005bf8" fillOpacity="0.18" />
                    )}
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={isHovered ? "4.5" : "3.5"} 
                      fill="#ffffff" 
                      stroke="#005bf8" 
                      strokeWidth="2.5" 
                    />
                  </g>
                );
              })}

              {/* Node Dots: Telegram Joins (Emerald Green) */}
              {ptsJoins.map((pt, idx) => {
                const isHovered = hoveredIdx === idx;
                return (
                  <g key={`j-${idx}`} className="cursor-pointer">
                    {isHovered && (
                      <circle cx={pt.x} cy={pt.y} r="8" fill="#10b981" fillOpacity="0.18" />
                    )}
                    <circle 
                      cx={pt.x} 
                      cy={pt.y} 
                      r={isHovered ? "4.5" : "3.5"} 
                      fill="#ffffff" 
                      stroke="#10b981" 
                      strokeWidth="2.5" 
                    />
                  </g>
                );
              })}

              {/* Hover Trigger Zones across X-Axis */}
              {ptsViews.map((pt, idx) => (
                <rect
                  key={`zone-${idx}`}
                  x={pt.x - graphW / (days.length * 2)}
                  y={padY}
                  width={graphW / days.length}
                  height={graphH}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                />
              ))}

              {/* X-Axis Day Tick Labels */}
              {ptsViews.map((pt, idx) => (
                <text
                  key={`lbl-${idx}`}
                  x={pt.x}
                  y={svgH - 6}
                  textAnchor="middle"
                  fill={hoveredIdx === idx ? "#0f172a" : "#64748b"}
                  fontSize="11"
                  fontWeight={hoveredIdx === idx ? "800" : "600"}
                >
                  {pt.date}
                </text>
              ))}
            </svg>

            {/* Shadcn-Style Floating Tooltip */}
            {hoveredIdx !== null && activeDay && activePtView && (
              <div 
                className="absolute top-2 bg-white/95 backdrop-blur-md border border-[#e2e8f0] text-[#0f172a] p-3 rounded-2xl shadow-xl text-xs flex flex-col gap-1.5 transition-all duration-150 pointer-events-none z-20 min-w-[150px]"
                style={{
                  left: `${Math.min(Math.max((activePtView.x / svgW) * 100, 15), 85)}%`,
                  transform: 'translateX(-50%)'
                }}
              >
                <div className="font-black text-[#0f172a] border-b border-[#f1f5f9] pb-1 flex items-center justify-between">
                  <span>{activeDay.date}</span>
                  <span className="text-[10px] text-[#64748b] font-semibold">24h Summary</span>
                </div>
                <div className="flex items-center justify-between gap-4 font-bold text-[#005bf8]">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-[#005bf8]"></span>
                    Views:
                  </span>
                  <span>{activeDay.views}</span>
                </div>
                <div className="flex items-center justify-between gap-4 font-bold text-emerald-600">
                  <span className="flex items-center gap-1.5">
                    <span className="size-2 rounded-full bg-emerald-500"></span>
                    Joins:
                  </span>
                  <span>{activeDay.joins}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Insights: Top Communities, Search Keywords & Devices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Top Clicked Communities */}
          <div className="bg-white border border-[#e2e8f0] rounded-[26px] p-5 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
              <span className="text-xs font-extrabold uppercase text-[#64748b]">Top Clicked Communities</span>
              <MousePointerClick className="size-4 text-emerald-600" />
            </div>
            {stats?.topCommunities?.length > 0 ? (
              <div className="flex flex-col gap-2">
                {stats.topCommunities.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                    <span className="font-bold text-[#0f172a] truncate max-w-[170px]">{i + 1}. {c.title}</span>
                    <span className="font-extrabold text-[#005bf8] bg-[#f0f4ff] px-2.5 py-0.5 rounded-full border border-[#dbe6fe]">
                      {c.count} clicks
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#64748b] font-medium py-6 text-center">No community clicks logged yet</p>
            )}
          </div>

          {/* Top Search Queries */}
          <div className="bg-white border border-[#e2e8f0] rounded-[26px] p-5 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
              <span className="text-xs font-extrabold uppercase text-[#64748b]">Popular Search Queries</span>
              <Search className="size-4 text-amber-600" />
            </div>
            {stats?.topSearches?.length > 0 ? (
              <div className="flex flex-col gap-2">
                {stats.topSearches.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                    <span className="font-bold text-[#0f172a] truncate max-w-[170px]">"{s.query}"</span>
                    <span className="font-extrabold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                      {s.count} searches
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#64748b] font-medium py-6 text-center">No search queries recorded yet</p>
            )}
          </div>

          {/* Device Distribution */}
          <div className="bg-white border border-[#e2e8f0] rounded-[26px] p-5 flex flex-col gap-3 shadow-xs">
            <div className="flex items-center justify-between pb-2 border-b border-[#f1f5f9]">
              <span className="text-xs font-extrabold uppercase text-[#64748b]">Device Distribution</span>
              <Laptop className="size-4 text-purple-600" />
            </div>
            <div className="flex flex-col gap-2.5 py-1">
              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="flex items-center gap-2 font-bold text-[#0f172a]">
                  <Laptop className="size-4 text-[#005bf8]" /> Desktop
                </span>
                <span className="font-extrabold text-[#005bf8] bg-[#f0f4ff] px-2.5 py-0.5 rounded-full">
                  {stats?.deviceCounts?.desktop || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="flex items-center gap-2 font-bold text-[#0f172a]">
                  <Smartphone className="size-4 text-emerald-600" /> Mobile
                </span>
                <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  {stats?.deviceCounts?.mobile || 0}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#f8fafc] border border-[#e2e8f0]">
                <span className="flex items-center gap-2 font-bold text-[#0f172a]">
                  <Globe className="size-4 text-purple-600" /> Tablet / Other
                </span>
                <span className="font-extrabold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
                  {stats?.deviceCounts?.tablet || 0}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Real-time Activity Feed */}
        <div className="bg-white border border-[#e2e8f0] rounded-[32px] p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between border-b border-[#f1f5f9] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#005bf8]/10 text-[#005bf8]">
                <Sparkles className="size-5" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-base font-black text-[#0f172a]">Live Activity Stream</h2>
                <span className="text-xs text-[#64748b] font-medium">Real-time event log of visitor actions</span>
              </div>
            </div>
            
            <span className="text-xs font-extrabold text-[#005bf8] bg-[#f0f4ff] px-3.5 py-1.5 rounded-full border border-[#dbe6fe]">
              Recent {stats?.recentEvents?.length || 0} Events
            </span>
          </div>

          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
            {stats?.recentEvents?.map((evt, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f8fafc] border border-[#e2e8f0] text-xs hover:border-[#005bf8]/30 hover:bg-white transition-all shadow-2xs"
              >
                <div className="flex items-center gap-3">
                  <span className={`size-2.5 rounded-full ${
                    evt.event_type === 'page_view' ? 'bg-[#005bf8]' :
                    evt.event_type === 'join_clicked' ? 'bg-emerald-500' :
                    evt.event_type === 'search_performed' ? 'bg-amber-500' : 'bg-purple-500'
                  }`}></span>
                  <div className="flex flex-col text-left">
                    <span className="font-extrabold text-[#0f172a]">
                      {evt.event_type === 'page_view' && 'Visitor landed on TGRadar'}
                      {evt.event_type === 'join_clicked' && `Clicked Join: "${evt.community_title}"`}
                      {evt.event_type === 'search_performed' && `Searched for: "${evt.search_query}"`}
                      {evt.event_type === 'category_viewed' && `Viewed Category: "${evt.category}"`}
                    </span>
                    <span className="text-[11px] font-semibold text-[#64748b]">
                      Device: {evt.device_type} • Ref: {evt.referrer || 'Direct'}
                    </span>
                  </div>
                </div>

                <span className="text-[11px] font-extrabold text-[#64748b] bg-white px-3 py-1 rounded-full border border-[#e2e8f0]">
                  {formatRelativeTime(evt.created_at)}
                </span>
              </div>
            ))}
          </div>
        </div>

      </main>

    </div>
  );
}
