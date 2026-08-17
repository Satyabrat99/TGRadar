import { createClient } from '@supabase/supabase-js';
import { COMMUNITIES } from '../data/communities';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ihtjvkpgvgpvmimgypoq.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlodGp2a3Bndmdwdm1pbWd5cG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MzQ1OTUsImV4cCI6MjEwMjIxMDU5NX0.Ebw5EBwOxEss2dz9lkJjw4KVVTnQj0DHP7mLpO1sZww';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Fetch Communities from Supabase with Fallback
 */
export async function fetchCommunities() {
  try {
    const { data, error } = await supabase
      .from('communities')
      .select('*')
      .eq('verified', true)
      .not('avatar', 'is', null)
      .order('subscribers', { ascending: false });

    if (error || !data || data.length === 0) {
      console.warn('Supabase fetch notice: Falling back to seed dataset.', error?.message);
      return COMMUNITIES;
    }

    // Format Supabase camelCase mappings
    return data.map(item => ({
      id: item.id,
      title: item.title,
      username: item.username,
      description: item.description,
      type: item.type,
      category: item.category,
      subscribers: parseInt(item.subscribers, 10) || 1000,
      language: item.language || 'English',
      verified: item.verified,
      activity: item.activity || 'Active',
      safetyScore: item.safety_score || 98,
      rating: parseFloat(item.rating) || 4.8,
      tags: item.tags || [],
      avatar: item.avatar,
      bannerBg: item.banner_bg,
      link: item.link || `https://t.me/${item.username}`,
      upvotes: item.upvotes || 1,
      isCommunityOfDay: item.is_community_of_day || false
    }));
  } catch (err) {
    console.error('Supabase connection error:', err);
    return COMMUNITIES;
  }
}

/**
 * Submit Community to Supabase
 */
export async function insertCommunityToSupabase(newCommunity) {
  try {
    const dbPayload = {
      id: newCommunity.id,
      title: newCommunity.title,
      username: newCommunity.username,
      description: newCommunity.description,
      type: newCommunity.type,
      category: newCommunity.category,
      subscribers: newCommunity.subscribers,
      language: newCommunity.language,
      verified: newCommunity.verified,
      activity: newCommunity.activity,
      safety_score: newCommunity.safetyScore,
      rating: newCommunity.rating,
      tags: newCommunity.tags,
      avatar: newCommunity.avatar,
      banner_bg: newCommunity.bannerBg,
      link: newCommunity.link,
      upvotes: newCommunity.upvotes
    };

    const { error } = await supabase.from('communities').insert([dbPayload]);
    if (error) console.warn('Supabase insert warning:', error.message);
  } catch (err) {
    console.error('Supabase insert error:', err);
  }
}
