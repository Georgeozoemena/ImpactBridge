const HEALTH_IMAGES = [
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="%23f4efe9"/><stop offset="1" stop-color="%23e6f2ed"/></linearGradient></defs><rect width="1200" height="800" fill="url(%23g)"/><circle cx="220" cy="220" r="140" fill="%23cfe6dc"/><circle cx="980" cy="140" r="120" fill="%23f2d9c9"/><rect x="120" y="420" width="960" height="220" rx="32" fill="%23ffffff" opacity="0.6"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><defs><linearGradient id="g" x1="0" x2="1" y1="1" y2="0"><stop offset="0" stop-color="%23f7f2ec"/><stop offset="1" stop-color="%23e8f0f7"/></linearGradient></defs><rect width="1200" height="800" fill="url(%23g)"/><circle cx="180" cy="620" r="160" fill="%23d6e7f5"/><circle cx="920" cy="280" r="150" fill="%23f1e1d3"/><rect x="140" y="160" width="920" height="260" rx="32" fill="%23ffffff" opacity="0.6"/></svg>',
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800"><defs><linearGradient id="g" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="%23f3f7f4"/><stop offset="1" stop-color="%23f7ede5"/></linearGradient></defs><rect width="1200" height="800" fill="url(%23g)"/><circle cx="260" cy="200" r="130" fill="%23e0efe6"/><circle cx="930" cy="600" r="170" fill="%23f3dac8"/><rect x="160" y="300" width="880" height="220" rx="32" fill="%23ffffff" opacity="0.6"/></svg>'
];

export const getHealthFallback = (id = 'default') => {
  // Use a string hash to consistently pick the same image for the same campaign ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % HEALTH_IMAGES.length;
  return HEALTH_IMAGES[index];
};

export const parseBeneficiaryName = (description) => {
  if (!description) return null;
  const match = description.match(/^Beneficiary:\s*([^\n\r]+)/i);
  return match ? match[1].trim() : null;
};
