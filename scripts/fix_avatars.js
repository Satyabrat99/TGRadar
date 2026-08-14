/**
 * TGRadar Image Fixer Utility
 * Fetches all communities in Supabase, checks for broken/unavatar URLs,
 * downloads real profile pictures from Telegram CDN, and stores them in Supabase Storage.
 * Command: node scripts/fix_avatars.js
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = (process.env.SUPABASE_URL && process.env.SUPABASE_URL.trim()) 
  || (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_URL.trim()) 
  || 'https://ihtjvkpgvgpvmimgypoq.supabase.co';

const SUPABASE_KEY = (process.env.SUPABASE_ANON_KEY && process.env.SUPABASE_ANON_KEY.trim()) 
  || (process.env.VITE_SUPABASE_ANON_KEY && process.env.VITE_SUPABASE_ANON_KEY.trim()) 
  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlodGp2a3Bndmdwdm1pbWd5cG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MzQ1OTUsImV4cCI6MjEwMjIxMDU5NX0.Ebw5EBwOxEss2dz9lkJjw4KVVTnQj0DHP7mLpO1sZww';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function downloadAndUploadAvatar(username) {
  try {
    const clean = username.replace('@', '').trim().toLowerCase();
    const telegramUrl = `https://t.me/i/userpic/320/${clean}.jpg`;
    
    const response = await fetch(telegramUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!response.ok) return null;

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      return null;
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to public "avatars" storage bucket
    const fileName = `${clean}.jpg`;
    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, buffer, {
        contentType: 'image/jpeg',
        upsert: true
      });

    if (error) {
      console.warn(`  ⚠️ Storage upload failed for @${clean}:`, error.message);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);

    return publicUrl;
  } catch (err) {
    console.warn(`  ⚠️ Avatar recovery failed for @${username}:`, err.message);
    return null;
  }
}

async function fixAvatars() {
  console.log("🔍 Fetching all communities from Supabase to scan for missing or unavatar URLs...");

  const { data: communities, error } = await supabase
    .from('communities')
    .select('id, username, title, avatar');

  if (error) {
    console.error("❌ Error fetching communities:", error.message);
    return;
  }

  console.log(`📡 Scanning ${communities.length} communities for avatar updates...\n`);
  let fixedCount = 0;

  for (const item of communities) {
    const cleanUsername = item.username.replace('@', '').trim().toLowerCase();
    const needsUpdate = !item.avatar || item.avatar.includes('unavatar.io');

    if (needsUpdate) {
      console.log(`[Scanning] -> @${cleanUsername} | "${item.title}"`);
      const newAvatarUrl = await downloadAndUploadAvatar(cleanUsername);

      if (newAvatarUrl) {
        // Update community record in database
        const { error: updateError } = await supabase
          .from('communities')
          .update({ avatar: newAvatarUrl })
          .eq('id', item.id);

        if (updateError) {
          console.warn(`  ⚠️ Failed to update database record for @${cleanUsername}:`, updateError.message);
        } else {
          console.log(`  ✅ Successfully updated avatar for @${cleanUsername} in Supabase!`);
          fixedCount++;
        }
      } else {
        console.log(`  ℹ️ No active profile photo on Telegram for @${cleanUsername} (keeps fallback badge).`);
      }
    }
  }

  console.log(`\n🎉 Avatar recovery operation complete! Repopulated and updated ${fixedCount} communities in Supabase.`);
}

fixAvatars();
