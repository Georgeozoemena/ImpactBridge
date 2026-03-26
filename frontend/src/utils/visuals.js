const HEALTH_IMAGES = [
  '1584515159494-d242851b2a5c', // Medical Monitor
  '1519494026892-80bbd2d6fd0d', // Hospital Bed / Consultation
  '1532938911036-79b124682110', // Patient
  '1505751172876-fa1923c5c528', // Doctor / Medical Care
  '1581594632750-717424fb3c32', // Lab / Healthcare Visual
  '1551076805-e186e8e3edfb', // Modern Clinic
  '1576091160550-217359f488d5', // Surgery Room
  '1583324113626-70df0f4daaaa'  // Hospital Corridor
];

export const getHealthFallback = (id = 'default') => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % HEALTH_IMAGES.length;
  return `https://images.unsplash.com/photo-${HEALTH_IMAGES[index]}?auto=format&fit=crop&q=80&w=800`;
};
