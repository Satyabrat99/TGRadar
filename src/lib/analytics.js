import { supabase } from './supabase';

// Get or create anonymous unique visitor ID
function getVisitorId() {
  try {
    let vid = localStorage.getItem('tgradar_visitor_id');
    if (!vid) {
      vid = 'v_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem('tgradar_visitor_id', vid);
    }
    return vid;
  } catch {
    return 'v_anon_' + Date.now();
  }
}

// Detect device type
function getDeviceType() {
  const ua = navigator.userAgent || '';
  if (/mobile/i.test(ua)) return 'mobile';
  if (/tablet|ipad/i.test(ua)) return 'tablet';
  return 'desktop';
}

// Log event locally for instant offline dashboard caching
function logLocalEvent(event) {
  try {
    const raw = localStorage.getItem('tgradar_analytics_log');
    const logs = raw ? JSON.parse(raw) : [];
    logs.unshift(event);
    if (logs.length > 300) logs.length = 300;
    localStorage.setItem('tgradar_analytics_log', JSON.stringify(logs));
  } catch (e) {
    // Ignore storage quota
  }
}

// Universal event logger
export async function trackEvent(eventType, payload = {}) {
  const visitorId = getVisitorId();
  const deviceType = getDeviceType();

  const eventData = {
    event_type: eventType,
    visitor_id: visitorId,
    device_type: deviceType,
    page_path: window.location.pathname || '/',
    referrer: document.referrer || 'direct',
    community_id: payload.communityId || null,
    community_title: payload.communityTitle || null,
    category: payload.category || null,
    search_query: payload.searchQuery || null,
    created_at: new Date().toISOString()
  };

  // Save to local cache
  logLocalEvent(eventData);

  // Send to Supabase asynchronously (silent fail if table doesn't exist yet)
  try {
    if (supabase) {
      await supabase.from('analytics_events').insert([eventData]);
    }
  } catch (err) {
    // Graceful silent fallback
  }
}

// Convenience Trackers
export function trackPageView() {
  trackEvent('page_view');
}

export function trackJoinClick(community) {
  if (!community) return;
  trackEvent('join_clicked', {
    communityId: community.id,
    communityTitle: community.title,
    category: community.category
  });
}

export function trackSearch(query) {
  if (!query || query.trim().length < 2) return;
  trackEvent('search_performed', {
    searchQuery: query.trim()
  });
}

export function trackCategoryView(category) {
  if (!category) return;
  trackEvent('category_viewed', {
    category
  });
}

// Fetch Aggregated Analytics Summary
export async function fetchAnalyticsData() {
  let events = [];

  // Try fetching from Supabase first
  try {
    if (supabase) {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (!error && Array.isArray(data) && data.length > 0) {
        events = data;
      }
    }
  } catch (e) {
    // Fallback to local
  }

  // If Supabase returned empty or errored, load from localStorage
  if (events.length === 0) {
    try {
      const raw = localStorage.getItem('tgradar_analytics_log');
      if (raw) events = JSON.parse(raw);
    } catch {}
  }

  // Compute Metrics
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const pageViews = events.filter(e => e.event_type === 'page_view');
  const joinClicks = events.filter(e => e.event_type === 'join_clicked');
  const searches = events.filter(e => e.event_type === 'search_performed');

  const uniqueVisitors = new Set(events.map(e => e.visitor_id)).size;
  const todayViews = pageViews.filter(e => new Date(e.created_at) >= oneDayAgo).length;
  const todayJoins = joinClicks.filter(e => new Date(e.created_at) >= oneDayAgo).length;
  const weekViews = pageViews.filter(e => new Date(e.created_at) >= sevenDaysAgo).length;

  // Device Breakdown
  const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 };
  events.forEach(e => {
    const d = e.device_type || 'desktop';
    if (deviceCounts[d] !== undefined) deviceCounts[d]++;
    else deviceCounts.desktop++;
  });

  // Top Communities Clicked
  const communityCounts = {};
  joinClicks.forEach(e => {
    const title = e.community_title || 'Unknown Community';
    communityCounts[title] = (communityCounts[title] || 0) + 1;
  });
  const topCommunities = Object.entries(communityCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([title, count]) => ({ title, count }));

  // Top Search Queries
  const searchCounts = {};
  searches.forEach(e => {
    const q = e.search_query?.toLowerCase() || '';
    if (q) searchCounts[q] = (searchCounts[q] || 0) + 1;
  });
  const topSearches = Object.entries(searchCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([query, count]) => ({ query, count }));

  // 7-Day Timeline Data
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const dayStart = new Date(d.setHours(0, 0, 0, 0));
    const dayEnd = new Date(d.setHours(23, 59, 59, 999));

    const dayViews = pageViews.filter(e => {
      const et = new Date(e.created_at);
      return et >= dayStart && et <= dayEnd;
    }).length;

    const dayJoins = joinClicks.filter(e => {
      const et = new Date(e.created_at);
      return et >= dayStart && et <= dayEnd;
    }).length;

    last7Days.push({ date: dateStr, views: dayViews, joins: dayJoins });
  }

  return {
    totalEvents: events.length,
    totalViews: pageViews.length,
    todayViews,
    weekViews,
    totalJoins: joinClicks.length,
    todayJoins,
    uniqueVisitors: Math.max(uniqueVisitors, 1),
    deviceCounts,
    topCommunities,
    topSearches,
    last7Days,
    recentEvents: events.slice(0, 20)
  };
}
