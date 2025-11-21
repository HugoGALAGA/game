/**
 * Calcula el tier correcto basado en el ELO del jugador
 * Mantiene la misma lógica que la función de base de datos
 */
export const calculateTierFromElo = (elo: number): string => {
  if (elo >= 5001) return 'Master';
  if (elo >= 3001) return 'Diamond';
  if (elo >= 2001) return 'Platinum';
  if (elo >= 1201) return 'Gold';
  if (elo >= 501) return 'Silver';
  return 'Bronze';
};

/**
 * Rangos de ELO para cada tier
 */
export const TIER_RANGES = {
  Bronze: { min: 0, max: 500 },
  Silver: { min: 501, max: 1200 },
  Gold: { min: 1201, max: 2000 },
  Platinum: { min: 2001, max: 3000 },
  Diamond: { min: 3001, max: 5000 },
  Master: { min: 5001, max: Infinity },
} as const;

/**
 * Verifica si el tier es consistente con el ELO
 */
export const isTierConsistent = (elo: number, tier: string): boolean => {
  return calculateTierFromElo(elo) === tier.trim();
};
