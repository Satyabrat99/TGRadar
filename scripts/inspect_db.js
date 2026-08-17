import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ihtjvkpgvgpvmimgypoq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlodGp2a3Bndmdwdm1pbWd5cG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MzQ1OTUsImV4cCI6MjEwMjIxMDU5NX0.Ebw5EBwOxEss2dz9lkJjw4KVVTnQj0DHP7mLpO1sZww';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function inspect() {
  const { data, error, count } = await supabase
    .from('communities')
    .select('id, username, title, subscribers, avatar', { count: 'exact' });

  if (error) {
    console.error('Supabase query error:', error);
    return;
  }

  console.log(`Total communities in Supabase: ${data.length} (count: ${count})`);
  console.log('Sample rows:', data.slice(0, 10));
}

inspect();
