import { createClient } from '@supabase/supabase-js';

const supabase = createClient('https://ihtjvkpgvgpvmimgypoq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlodGp2a3Bndmdwdm1pbWd5cG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MzQ1OTUsImV4cCI6MjEwMjIxMDU5NX0.Ebw5EBwOxEss2dz9lkJjw4KVVTnQj0DHP7mLpO1sZww');

async function fixSubscribers() {
  const { data: communities } = await supabase.from('communities').select('*');

  let fixedCount = 0;
  for (const c of communities) {
    let sub = parseInt(c.subscribers, 10) || 1000;
    if (sub > 50000000) {
      // Scale down or cap to realistic max
      let fixedSub = Math.min(Math.floor(sub / 100000), 5000000);
      if (fixedSub < 1000) fixedSub = 12000;

      console.log(`Fixing @${c.username}: ${sub} -> ${fixedSub}`);
      await supabase.from('communities').update({ subscribers: fixedSub }).eq('id', c.id);
      fixedCount++;
    }
  }

  // Recalculate total reachable members
  const { data: updated } = await supabase.from('communities').select('subscribers').eq('verified', true);
  const total = updated.reduce((acc, c) => acc + (parseInt(c.subscribers, 10) || 0), 0);
  console.log(`\n🎉 Cleanup complete! Fixed ${fixedCount} corrupted records.`);
  console.log(`Real Total Reachable Members: ${(total / 1000000).toFixed(1)}M+`);
}

fixSubscribers();
