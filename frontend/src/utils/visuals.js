const HEALTH_IMAGES = [
  '1532938911036-79b124682110', // Patient in recovery
  '1585485496744-ed11003d82d4', // Child patient / Care
  '1581056344407-5cd60c637a11', // Elderly care
  '1579684385109-c169224d83e3', // Interaction with caregiver
  '1581595221027-33141bd1d68a', // Support / Holding hands
  '1527613426441-4da1d271701d', // Medical attention
  '1584362940241-7928230559ec', // Patient care
  '1516570161789-db40af706b2a'  // Pediatric care
];

export const getHealthFallback = (id = 'default') => {
  // Use a string hash to consistently pick the same image for the same campaign ID
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % HEALTH_IMAGES.length;
  return `https://images.unsplash.com/photo-${HEALTH_IMAGES[index]}?auto=format&fit=crop&q=80&w=800`;
};

export const parseBeneficiaryName = (description) => {
  if (!description) return null;
  const match = description.match(/^Beneficiary:\s*([^\n\r]+)/i);
  return match ? match[1].trim() : null;
};
