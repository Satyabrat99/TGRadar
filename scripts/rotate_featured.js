/**
 * TGRadar Daily Featured Rotation Engine
 * Runs every day at midnight UTC via GitHub Actions cron.
 * 
 * Hidden Gem Algorithm:
 *   score = (rating × 200) + (upvotes × 3) - (subscribers ÷ 5000)
 *   Bonus: +500 if never featured before
 *   Exclude: communities featured in the last 30 days
 * 
 * Command: node scripts/rotate_featured.js
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (process.env.SUPABASE_URL && process.env.SUPABASE_URL.trim()) 
  || (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_URL.trim()) 
  || 'https://ihtjvkpgvgpvmimgypoq.supabase.co';

const SUPABASE_KEY = (process.env.SUPABASE_ANON_KEY && process.env.SUPABASE_ANON_KEY.trim()) 
  || (process.env.VITE_SUPABASE_ANON_KEY && process.env.VITE_SUPABASE_ANON_KEY.trim()) 
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlodGp2a3Bndmdwdm1pbWd5cG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MzQ1OTUsImV4cCI6MjEwMjIxMDU5NX0.Ebw5EBwOxEss2dz9lkJjw4KVVTnQj0DHP7mLpO1sZww';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function gemScore(c) {
  const rating = parseFloat(c.rating) || 4.5;
  const upvotes = parseInt(c.upvotes) || 0;
  const subscribers = parseInt(c.subscribers) || 0;
  const neverFeatured = !c.featured_date;

  return (rating * 200) + (upvotes * 3) - (subscribers / 5000) + (neverFeatured ? 500 : 0);
}

async function rotateFeatured() {
  console.log('🔄 Starting TGRadar Daily Featured Rotation Engine...');
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // 1. Fetch all communities
  const { data: all, error } = await supabase
    .from('communities')
    .select('id, title, username, rating, upvotes, subscribers, featured_date, is_community_of_day, trend_rank');

  if (error) {
    console.error('⚠️ Failed to fetch communities:', error.message);
    return;
  }

  console.log(`📡 Loaded ${all.length} communities from Supabase.\n`);

  // 2. Filter out recently featured (within last 30 days)
  const eligible = all.filter(c => {
    if (!c.featured_date) return true; // Never featured → always eligible
    return c.featured_date < thirtyDaysAgo;
  });

  console.log(`✅ ${eligible.length} eligible hidden gems (not featured in last 30 days)\n`);

  if (eligible.length < 4) {
    console.log('⚠️ Not enough eligible communities. Skipping rotation today.');
    return;
  }

  // 3. Score and sort by Hidden Gem Algorithm
  const scored = eligible
    .map(c => ({ ...c, _score: gemScore(c) }))
    .sort((a, b) => b._score - a._score);

  const [cotd, trend1, trend2, trend3] = scored;

  console.log('🏆 Community of the Day:', cotd.title, `(@${cotd.username}) | Score: ${cotd._score.toFixed(0)}`);
  console.log('🔥 Trending #1:', trend1.title, `| Score: ${trend1._score.toFixed(0)}`);
  console.log('🔥 Trending #2:', trend2.title, `| Score: ${trend2._score.toFixed(0)}`);
  console.log('🔥 Trending #3:', trend3.title, `| Score: ${trend3._score.toFixed(0)}\n`);

  // 4. Reset ALL communities' featured flags first
  await supabase
    .from('communities')
    .update({ is_community_of_day: false, trend_rank: 0 })
    .neq('id', 'none'); // Match all rows

  // 5. Set Community of the Day
  await supabase
    .from('communities')
    .update({ is_community_of_day: true, featured_date: today, trend_rank: 0 })
    .eq('id', cotd.id);

  // 6. Set Trending Top 3
  for (const [idx, item] of [[trend1, 1], [trend2, 2], [trend3, 3]]) {
    await supabase
      .from('communities')
      .update({ trend_rank: item, featured_date: today })
      .eq('id', idx.id);
  }

  console.log('✅ Daily rotation complete!');
  console.log(`   🏆 Community of the Day → @${cotd.username}`);
  console.log(`   🔥 Trending → @${trend1.username}, @${trend2.username}, @${trend3.username}`);
}

rotateFeatured();
