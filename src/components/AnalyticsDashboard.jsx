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
  Clock,
  Compass
} from 'lucide-react';
import { fetchAnalyticsData } from '../lib/analytics';

export default function AnalyticsDashboard({ onBackToApp }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());
  const [hoveredIndex, setHoveredIndex] = useState(null);

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

  // SVG Line Graph Calculations
  const days = stats?.last7Days || [];
  const maxVal = Math.max(...days.map(d => Math.max(d.views, d.joins)), 5);

  const svgW = 760;
  const svgH = 200;
  const padX = 45;
  const padY = 30;
  const gWidth = svgW - padX * 2;
  const gHeight = svgH - padY * 2;

  const ptsViews = days.map((d, i) => ({
    x: padX + (i / Math.max(days.length - 1, 1)) * gWidth,
    y: padY + gHeight - (d.views / maxVal) * gHeight,
    val: d.views,
    date: d.date
  }));

  const ptsJoins = days.map((d, i) => ({
    x: padX + (i / Math.max(days.length - 1, 1)) * gWidth,
    y: padY + gHeight - (d.joins / maxVal) * gHeight,
    val: d.joins,
    date: d.date
  }));

  // Smooth Cubic Bezier Curves
  const buildCurvedPath = (pts) => {
    if (!pts || pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x},${pts[0].y}`;
    
    let path = `M ${pts[0].x},${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const cp1x = curr.x + (next.x - curr.x) * 0.4;
      const cp1y = curr.y;
      const cp2x = curr.x + (next.x - curr.x) * 0.6;
      const cp2y = next.y;
      path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
    }
    return path;
  };

  const pathViews = buildCurvedPath(ptsViews);
  const pathJoins = buildCurvedPath(ptsJoins);

  const areaViews = ptsViews.length > 0 
    ? `${pathViews} L ${ptsViews[ptsViews.length - 1].x},${svgH - padY} L ${ptsViews[0].x},${svgH - padY} Z`
    : '';

  const areaJoins = ptsJoins.length > 0 
    ? `${pathJoins} L ${ptsJoins[ptsJoins.length - 1].x},${svgH - padY} L ${ptsJoins[0].x},${svgH - padY} Z`
    : '';

  return (
    <div className="min-h-screen bg-[#f8fafc] text-[#0f172a] flex flex-col font-sans antialiased selection:bg-[#005bf8] selection:text-white">
      
      {/* Top Floating Glass Header */}
      <header className="w-full bg-white/90 backdrop-blur-md border-b border-[#e2e8f0] sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToApp}
            className="flex items-center gap-2 bg-[#f0f4ff] hover:bg-[#e0ebff] text-[#005bf8] px-4 py-2 rounded-full text-xs font-extrabold transition-all cursor-pointer border border-[#dbe6fe] active:scale-95 shadow-xs"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Directory</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-gradient-to-br from-[#005bf8] to-[#3b82f6] text-white flex items-center justify-center shadow-md">
              <BarChart3 className="size-5" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-[#0f172a] tracking-tight">Platform Telemetry & Analytics</h1>
                <span className="bg-[#005bf8]/10 text-[#005bf8] border border-[#005bf8]/20 text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-[#005bf8] animate-ping"></span>
                  Live Monitor
                </span>
              </div>
              <p className="text-xs text-[#64748b]">Real-time visitor tracking & Telegram conversion insights</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#64748b] bg-[#f1f5f9] px-3 py-1.5 rounded-full border border-[#e2e8f0]">
            <Clock className="size-3.5 text-[#005bf8]" />
            <span>Updated {formatRelativeTime(lastRefreshed)}</span>
          </div>
          
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-full bg-white hover:bg-[#f1f5f9] text-[#0f172a] transition-all cursor-pointer border border-[#e2e8f0] shadow-xs active:scale-95 disabled:opacity-50"
            title="Refresh Analytics"
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin text-[#005bf8]' : ''}`} />
          </button>
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

        {/* 7-Day Traffic SVG Line Graph Section */}
        <div className="bg-white border border-[#e2e8f0] rounded-[32px] p-6 flex flex-col gap-4 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#f1f5f9] pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-[#005bf8]/10 text-[#005bf8]">
                <TrendingUp className="size-5" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-base font-black text-[#0f172a]">7-Day Daily Traffic Volume</h2>
                <span className="text-xs text-[#64748b] font-medium">Smooth telemetry curve comparing Page Views vs. Telegram Outbound Clicks</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-extrabold bg-[#f8fafc] px-3.5 py-1.5 rounded-full border border-[#e2e8f0]">
              <span className="flex items-center gap-1.5 text-[#005bf8]">
                <span className="size-2.5 rounded-full bg-[#005bf8]"></span>
                Page Views
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600">
                <span className="size-2.5 rounded-full bg-emerald-500"></span>
                Telegram Joins
              </span>
            </div>
          </div>

          {/* SVG Line Graph Canvas */}
          <div className="relative w-full pt-2">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto overflow-visible">
              <defs>
                <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#005bf8" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#005bf8" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal Reference Lines */}
              {[0, 0.33, 0.66, 1].map((ratio, idx) => {
                const y = padY + ratio * gHeight;
                return (
                  <line 
                    key={idx} 
                    x1={padX} 
                    y1={y} 
                    x2={svgW - padX} 
                    y2={y} 
                    stroke="#f1f5f9" 
                    strokeDasharray="4 4"
                    strokeWidth="1.5"
                  />
                );
              })}

              {/* Smooth Area Gradient Fills */}
              {areaViews && <path d={areaViews} fill="url(#blueGradient)" />}
              {areaJoins && <path d={areaJoins} fill="url(#emeraldGradient)" />}

              {/* Curved Spline Paths */}
              {pathViews && (
                <path d={pathViews} fill="none" stroke="#005bf8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              )}
              {pathJoins && (
                <path d={pathJoins} fill="none" stroke="#10b981" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
              )}

              {/* Data Points */}
              {ptsViews.map((pt, idx) => (
                <g key={`view-${idx}`} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(idx)}>
                  <circle cx={pt.x} cy={pt.y} r="6" fill="#ffffff" stroke="#005bf8" strokeWidth="3" className="transition-transform hover:scale-150" />
                </g>
              ))}

              {ptsJoins.map((pt, idx) => (
                <g key={`join-${idx}`} className="cursor-pointer" onMouseEnter={() => setHoveredIndex(idx)}>
                  <circle cx={pt.x} cy={pt.y} r="5" fill="#ffffff" stroke="#10b981" strokeWidth="3" className="transition-transform hover:scale-150" />
                </g>
              ))}

              {/* X-Axis Day Labels */}
              {ptsViews.map((pt, idx) => (
                <text
                  key={`label-${idx}`}
                  x={pt.x}
                  y={svgH - 4}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="11"
                  fontWeight="800"
                >
                  {pt.date}
                </text>
              ))}
            </svg>

            {/* Interactive Floating Tooltip */}
            {hoveredIndex !== null && days[hoveredIndex] && (
              <div className="absolute top-2 right-4 bg-[#0f172a] text-white p-3.5 rounded-2xl shadow-xl text-xs flex flex-col gap-1.5 border border-[#005bf8]/30 animate-fadeIn z-10">
                <span className="font-black text-[#3b82f6] border-b border-gray-800 pb-1">{days[hoveredIndex].date} Overview</span>
                <div className="flex items-center justify-between gap-5 font-semibold text-gray-300">
                  <span>Page Views:</span>
                  <span className="font-extrabold text-white">{days[hoveredIndex].views}</span>
                </div>
                <div className="flex items-center justify-between gap-5 font-semibold text-gray-300">
                  <span>Telegram Joins:</span>
                  <span className="font-extrabold text-emerald-400">{days[hoveredIndex].joins}</span>
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
