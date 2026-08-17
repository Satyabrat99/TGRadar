import { createClient } from '@supabase/supabase-js';
import { CATEGORY_HIERARCHY } from '../src/data/categoryHierarchy.js';

const supabase = createClient('https://ihtjvkpgvgpvmimgypoq.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlodGp2a3Bndmdwdm1pbWd5cG9xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY2MzQ1OTUsImV4cCI6MjEwMjIxMDU5NX0.Ebw5EBwOxEss2dz9lkJjw4KVVTnQj0DHP7mLpO1sZww');

async function testMatch() {
  const { data: communities } = await supabase.from('communities').select('*').eq('verified', true).not('avatar', 'is', null);

  console.log('Total Verified Communities in DB:', communities.length);

  CATEGORY_HIERARCHY.forEach(domain => {
    const domainTokens = domain.name.toLowerCase().split(/[\s&,/]+/);
    const domainComms = communities.filter(c => {
      const cat = (c.category || '').toLowerCase();
      return domainTokens.some(t => t.length > 2 && cat.includes(t));
    });

    console.log(`\n=== [${domain.name}] Total: ${domainComms.length} ===`);

    domain.subCategories.forEach(sub => {
      const subTags = sub.tags || [];
      const subWords = sub.name.toLowerCase().split(/[\s&,/]+/).filter(w => w.length > 3 && !['channels','hubs','groups'].includes(w));

      const subComms = domainComms.filter(c => {
        const cTags = (c.tags || []).map(t => t.toLowerCase());
        const cTitle = (c.title || '').toLowerCase();
        const cDesc = (c.description || '').toLowerCase();

        const tagMatch = subTags.some(tag => {
          const t = tag.toLowerCase();
          return cTags.some(ct => ct.includes(t) || t.includes(ct)) || cTitle.includes(t) || cDesc.includes(t);
        });

        const wordMatch = subWords.some(w => cTitle.includes(w) || cDesc.includes(w) || cTags.some(ct => ct.includes(w)));
        return tagMatch || wordMatch;
      });

      console.log(`  -> Sub: "${sub.name}" | Real Count: ${subComms.length}`);
    });
  });
}

testMatch();
