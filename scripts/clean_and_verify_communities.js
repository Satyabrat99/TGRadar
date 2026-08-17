import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ihtjvkpgvgpvmimgypoq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlodGp2a3Bndmdwdm1pbWd5cG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MzQ1OTUsImV4cCI6MjEwMjIxMDU5NX0.Ebw5EBwOxEss2dz9lkJjw4KVVTnQj0DHP7mLpO1sZww';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function parseSubscribers(extraText) {
  if (!extraText) return 0;
  // e.g. "9 828 564 subscribers" -> remove spaces between numbers
  const textWithoutSpaces = extraText.replace(/(\d)\s+(\d)/g, '$1$2').replace(/(\d)\s+(\d)/g, '$1$2');
  const match = textWithoutSpaces.match(/([\d\.]+)\s*([KkMm])?/);
  if (!match) return 0;
  let val = parseFloat(match[1]);
  if (match[2]) {
    const unit = match[2].toUpperCase();
    if (unit === 'K') val *= 1000;
    if (unit === 'M') val *= 1000000;
  }
  return Math.round(val);
}

async function verifyTelegramHandle(username) {
  const clean = username.replace('@', '').trim();
  const url = `https://t.me/${clean}`;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) return { valid: false, reason: `HTTP ${res.status}` };

    const html = await res.text();

    const titleMatch = html.match(/<meta property="og:title" content="([^"]+)"/);
    const rawTitle = titleMatch ? titleMatch[1] : '';

    const isContactOnly = html.includes('If you have Telegram, you can contact') || 
                          rawTitle.startsWith('Telegram: Contact @') || 
                          rawTitle.startsWith('Telegram: Contact');

    const extraMatch = html.match(/<div class="tgme_page_extra">([^<]+)<\/div>/);
    const extraText = extraMatch ? extraMatch[1].trim() : '';

    const imgMatch = html.match(/<img class="tgme_page_photo_image" src="([^"]+)"/) ||
                     html.match(/<meta property="og:image" content="([^"]+)"/);
    const photoUrl = imgMatch ? imgMatch[1] : null;

    const descMatch = html.match(/<div class="tgme_page_description[^"]*">([\s\S]*?)<\/div>/);
    let desc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';

    const subscribers = parseSubscribers(extraText);

    if (isContactOnly || (!subscribers && !photoUrl && rawTitle.includes('Contact')) || subscribers < 100) {
      return { valid: false, reason: subscribers < 100 ? `Low Subscribers (${subscribers})` : 'Unregistered / Dead Handle' };
    }

    return {
      valid: true,
      username: clean,
      title: rawTitle.replace(/^Telegram:\s*/i, '').trim() || `${clean} Community`,
      subscribers: subscribers || 5000,
      avatar: photoUrl,
      description: desc || `Official Telegram community for @${clean}.`
    };
  } catch (err) {
    return { valid: false, reason: err.message };
  }
}

async function runCleanup() {
  console.log('🔍 Fetching all communities from Supabase...');
  const { data: communities, error } = await supabase
    .from('communities')
    .select('id, username, title, subscribers, avatar');

  if (error) {
    console.error('Failed to fetch from Supabase:', error);
    return;
  }

  console.log(`📊 Found ${communities.length} communities in Supabase. Starting verification sweep...\n`);

  let validCount = 0;
  let deletedCount = 0;
  let updatedCount = 0;

  for (let i = 0; i < communities.length; i++) {
    const item = communities[i];
    const username = item.username || item.id.replace('discovered-', '');

    console.log(`[${i + 1}/${communities.length}] Checking @${username}...`);

    const result = await verifyTelegramHandle(username);

    if (!result.valid) {
      console.log(`  ❌ INVALID (${result.reason}) -> Deleting from Supabase...`);
      const { error: delErr } = await supabase
        .from('communities')
        .delete()
        .eq('id', item.id);

      if (delErr) {
        console.warn(`     ⚠️ Delete failed:`, delErr.message);
      } else {
        deletedCount++;
      }
    } else {
      console.log(`  ✅ VALID: "${result.title}" | Subs: ${result.subscribers.toLocaleString()} | Photo: ${Boolean(result.avatar)}`);
      validCount++;

      // Update Supabase with verified real data
      const updateData = {
        title: result.title,
        subscribers: result.subscribers,
        description: result.description
      };
      if (result.avatar) {
        updateData.avatar = result.avatar;
      }

      const { error: updateErr } = await supabase
        .from('communities')
        .update(updateData)
        .eq('id', item.id);

      if (!updateErr) updatedCount++;
    }

    // Small delay to prevent network throttling
    await new Promise(r => setTimeout(r, 150));
  }

  console.log(`\n==============================================`);
  console.log(`🎉 VERIFICATION SWEEP COMPLETE!`);
  console.log(`✅ Valid Genuine Communities Retained: ${validCount}`);
  console.log(`📝 Updated with Real Live Data: ${updatedCount}`);
  console.log(`🗑️ Fake/Dead Communities Deleted: ${deletedCount}`);
  console.log(`==============================================\n`);
}

runCleanup();
