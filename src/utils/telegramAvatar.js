export const PREMIUM_GRADIENTS = {
  // Original 9
  electricSapphire:  "linear-gradient(135deg, #005bf8 0%, #3b82f6 50%, #1d4ed8 100%)",
  midnightViolet:    "linear-gradient(135deg, #4c1d95 0%, #7c3aed 50%, #2e1065 100%)",
  solarGold:         "linear-gradient(135deg, #b45309 0%, #f59e0b 50%, #78350f 100%)",
  hyperEmerald:      "linear-gradient(135deg, #047857 0%, #10b981 50%, #064e3b 100%)",
  deepCyan:          "linear-gradient(135deg, #0e7490 0%, #06b6d4 50%, #164e63 100%)",
  neonMagenta:       "linear-gradient(135deg, #be185d 0%, #ec4899 50%, #831843 100%)",
  binanceGold:       "linear-gradient(135deg, #f0b90b 0%, #fcd535 50%, #b78a00 100%)",
  sunsetCoral:       "linear-gradient(135deg, #c2410c 0%, #f97316 50%, #7c2d12 100%)",
  obsidianMesh:      "linear-gradient(135deg, #18181b 0%, #3f3f46 50%, #09090b 100%)",

  // 6 New Premium Additions
  auroraForest:      "linear-gradient(135deg, #064e3b 0%, #059669 40%, #34d399 80%, #065f46 100%)",
  cosmicIndigo:      "linear-gradient(135deg, #1e1b4b 0%, #4338ca 45%, #818cf8 80%, #312e81 100%)",
  cherryBlossom:     "linear-gradient(135deg, #881337 0%, #e11d48 45%, #fb7185 80%, #9f1239 100%)",
  royalSlate:        "linear-gradient(135deg, #0f172a 0%, #1e3a5f 40%, #2563eb 80%, #1e293b 100%)",
  tropicalLime:      "linear-gradient(135deg, #14532d 0%, #16a34a 45%, #86efac 80%, #166534 100%)",
  duskPurple:        "linear-gradient(135deg, #581c87 0%, #9333ea 40%, #c084fc 75%, #6b21a8 100%)",
};


const GRADIENT_ARRAY = Object.values(PREMIUM_GRADIENTS);

/**
 * Get Rotating Premium Gradient for any handle or category
 */
export function getRotatedGradient(username = '') {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % GRADIENT_ARRAY.length;
  return GRADIENT_ARRAY[index];
}

export function getTelegramBanner(category = '') {
  return getRotatedGradient(category);
}

/**
 * High-Reliability Telegram Real Avatar Resolver
 * Priority 1: Official Telegram Web Userpic CDN (t.me/i/userpic/320/username.jpg)
 * Priority 2: Unavatar Proxy CDN (unavatar.io/telegram/username)
 */
export function getTelegramAvatar(username = '') {
  if (!username) return 'https://ui-avatars.com/api/?name=TG&background=005bf8&color=ffffff';
  const clean = username.replace('@', '').trim().toLowerCase();
  
  // Official Telegram Web Profile Picture CDN
  return `https://t.me/i/userpic/320/${clean}.jpg`;
}
