async function check(u) {
  try {
    const res = await fetch(`https://t.me/${u}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const text = await res.text();
    
    // Check if channel / group exists
    const hasChannel = text.includes('tgme_page_extra') || text.includes('tgme_action_button_new');
    const extraMatch = text.match(/<div class="tgme_page_extra">([^<]+)<\/div>/);
    const titleMatch = text.match(/<meta property="og:title" content="([^"]+)"/);
    const descMatch = text.match(/<div class="tgme_page_description[^"]*">([\s\S]*?)<\/div>/);
    const photoMatch = text.match(/<img class="tgme_page_photo_image" src="([^"]+)"/);
    const notFound = text.includes('If you have Telegram, you can contact') || text.includes('tgme_page_icon') && !hasChannel;

    console.log(`\n--- Check @${u} ---`);
    console.log('Status:', res.status);
    console.log('Title:', titleMatch ? titleMatch[1] : null);
    console.log('Subscribers/Members:', extraMatch ? extraMatch[1] : null);
    console.log('Has Photo:', photoMatch ? photoMatch[1] : null);
    console.log('Exists as Public Community:', Boolean(extraMatch && !notFound));
  } catch (err) {
    console.error(u, err.message);
  }
}

async function run() {
  await check('telegram');
  await check('durov');
  await check('binance_announcements');
  await check('angels_community');
  await check('election_devs');
  await check('python_devs');
  await check('midjourney');
  await check('random_fake_username_xyz987');
}

run();
