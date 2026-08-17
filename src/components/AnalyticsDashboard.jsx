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
  ShieldCheck,
  Globe
} from 'lucide-react';
import { fetchAnalyticsData } from '../lib/analytics';

export default function AnalyticsDashboard({ onBackToApp }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(new Date());

  const loadData = async () => {
    setLoading(true);
    const data = await fetchAnalyticsData();
    setStats(data);
    setLoading(false);
    setLastRefreshed(new Date());
  };

  useEffect(() => {
    loadData();
    // Auto-refresh every 30 seconds
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

  return (
    <div className="min-h-screen bg-[#0d1117] text-white flex flex-col antialiased">
      
      {/* Top Navigation Header */}
      <header className="w-full bg-[#161b22] border-b border-[#30363d] sticky top-0 z-40 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBackToApp}
            className="flex items-center gap-2 bg-[#21262d] hover:bg-[#30363d] text-gray-200 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border border-[#30363d] active:scale-95"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Directory</span>
          </button>
          
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#005bf8]/20 text-[#005bf8] border border-[#005bf8]/30">
              <BarChart3 className="size-5 text-[#58a6ff]" />
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold text-white tracking-tight">TGRadar Platform Analytics</h1>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live Telemetry
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Traffic, visitor interest & community outbound conversion insights</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-gray-400 hidden sm:inline-block">
            Updated {formatRelativeTime(lastRefreshed)}
          </span>
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2 rounded-xl bg-[#21262d] hover:bg-[#30363d] text-gray-200 hover:text-white transition-all cursor-pointer border border-[#30363d] disabled:opacity-50"
            title="Refresh Analytics"
          >
            <RefreshCw className={`size-4 ${loading ? 'animate-spin text-[#58a6ff]' : ''}`} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1240px] w-full mx-auto p-4 sm:p-8 flex flex-col gap-6 text-left">
        
        {/* KPI Summary Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Total Views Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Page Views</span>
              <Eye className="size-4 text-[#58a6ff]" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{stats?.totalViews || 0}</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                +{stats?.todayViews || 0} Today
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">7-Day Volume: {stats?.weekViews || 0} views</p>
          </div>

          {/* Unique Visitors Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Unique Visitors</span>
              <Users className="size-4 text-purple-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{stats?.uniqueVisitors || 0}</span>
              <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                Distinct Devices
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Anonymous device session tracking</p>
          </div>

          {/* Telegram Outbound Clicks Card */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Telegram Redirects</span>
              <Send className="size-4 text-blue-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{stats?.totalJoins || 0}</span>
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">
                +{stats?.todayJoins || 0} Today
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">
              Conversion Rate: {stats?.totalViews ? ((stats.totalJoins / stats.totalViews) * 100).toFixed(1) : '0'}%
            </p>
          </div>

          {/* Total System Events */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden">
            <div className="flex items-center justify-between text-gray-400">
              <span className="text-xs font-bold uppercase tracking-wider">Total Interactions</span>
              <Activity className="size-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white">{stats?.totalEvents || 0}</span>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                Actions Logged
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-1">Searches, Clicks & Views</p>
          </div>

        </div>

        {/* 7-Day Traffic Timeline Chart */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-sm font-extrabold text-white">7-Day Daily Traffic Volume</h2>
              <span className="text-xs text-gray-400">Page views vs Telegram outbound clicks</span>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-blue-400">
                <span className="size-2.5 rounded-full bg-blue-500"></span>
                Page Views
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="size-2.5 rounded-full bg-emerald-500"></span>
                Join Clicks
              </span>
            </div>
          </div>

          {/* Bar Visualization */}
          <div className="grid grid-cols-7 gap-3 pt-6 pb-2 items-end h-48 border-b border-[#30363d]">
            {stats?.last7Days?.map((day, idx) => {
              const maxViews = Math.max(...(stats.last7Days.map(d => d.views)), 5);
              const heightPercent = Math.max((day.views / maxViews) * 100, 8);
              const joinPercent = Math.max((day.joins / maxViews) * 100, 4);

              return (
                <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full max-w-[40px] flex items-end justify-center gap-1 h-full">
                    {/* Views Bar */}
                    <div 
                      style={{ height: `${heightPercent}%` }}
                      className="w-1/2 bg-blue-500 hover:bg-blue-400 rounded-t-md transition-all relative group"
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {day.views} views
                      </div>
                    </div>
                    {/* Joins Bar */}
                    <div 
                      style={{ height: `${joinPercent}%` }}
                      className="w-1/2 bg-emerald-500 hover:bg-emerald-400 rounded-t-md transition-all relative group"
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {day.joins} joins
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-gray-400">{day.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Insights: Top Communities, Search Keywords & Devices */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Top Clicked Communities */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
              <span className="text-xs font-bold uppercase text-gray-300">Top Clicked Communities</span>
              <TrendingUp className="size-4 text-emerald-400" />
            </div>
            {stats?.topCommunities?.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {stats.topCommunities.map((c, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-200 truncate max-w-[180px]">{i + 1}. {c.title}</span>
                    <span className="font-extrabold text-[#58a6ff] bg-[#58a6ff]/10 px-2 py-0.5 rounded-full">
                      {c.count} clicks
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-6 text-center">No community clicks logged yet</p>
            )}
          </div>

          {/* Top Search Queries */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
              <span className="text-xs font-bold uppercase text-gray-300">Popular Search Queries</span>
              <Search className="size-4 text-amber-400" />
            </div>
            {stats?.topSearches?.length > 0 ? (
              <div className="flex flex-col gap-2.5">
                {stats.topSearches.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-gray-200 truncate max-w-[180px]">"{s.query}"</span>
                    <span className="font-extrabold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                      {s.count} searches
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 py-6 text-center">No search queries recorded yet</p>
            )}
          </div>

          {/* Device Breakdown */}
          <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#30363d]">
              <span className="text-xs font-bold uppercase text-gray-300">Device Distribution</span>
              <Laptop className="size-4 text-purple-400" />
            </div>
            <div className="flex flex-col gap-3 py-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Laptop className="size-3.5 text-blue-400" /> Desktop
                </span>
                <span className="font-bold text-white">{stats?.deviceCounts?.desktop || 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Smartphone className="size-3.5 text-emerald-400" /> Mobile
                </span>
                <span className="font-bold text-white">{stats?.deviceCounts?.mobile || 0}</span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-gray-300">
                  <Globe className="size-3.5 text-purple-400" /> Tablet / Other
                </span>
                <span className="font-bold text-white">{stats?.deviceCounts?.tablet || 0}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Real-time Activity Feed */}
        <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h2 className="text-sm font-extrabold text-white">Live Activity Stream</h2>
              <span className="text-xs text-gray-400">Chronological visitor interactions in real-time</span>
            </div>
            <span className="text-xs font-bold text-gray-400 bg-[#21262d] px-3 py-1 rounded-full border border-[#30363d]">
              Showing Recent {stats?.recentEvents?.length || 0}
            </span>
          </div>

          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
            {stats?.recentEvents?.map((evt, idx) => (
              <div 
                key={idx} 
                className="flex items-center justify-between p-3 rounded-xl bg-[#0d1117] border border-[#21262d] text-xs hover:border-[#30363d] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className={`size-2 rounded-full ${
                    evt.event_type === 'page_view' ? 'bg-blue-400' :
                    evt.event_type === 'join_clicked' ? 'bg-emerald-400' :
                    evt.event_type === 'search_performed' ? 'bg-amber-400' : 'bg-purple-400'
                  }`}></span>
                  <div className="flex flex-col">
                    <span className="font-bold text-white">
                      {evt.event_type === 'page_view' && 'Visitor landed on TGRadar'}
                      {evt.event_type === 'join_clicked' && `Clicked Join: "${evt.community_title}"`}
                      {evt.event_type === 'search_performed' && `Searched for: "${evt.search_query}"`}
                      {evt.event_type === 'category_viewed' && `Viewed Category: "${evt.category}"`}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Device: {evt.device_type} • Ref: {evt.referrer || 'Direct'}
                    </span>
                  </div>
                </div>

                <span className="text-[10px] text-gray-400 font-semibold">
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
