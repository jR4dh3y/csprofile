import { getCached, setCache } from './cache';
import { getConfig } from './config';

export interface CSStatsData {
  hltvRating: number | null;
  hsPercent: number | null;
  adr: number | null;
  kd: number | null;
  clutch1v1: number | null;
  clutch1v2: number | null;
  clutch1v3: number | null;
  clutch1v4: number | null;
  clutch1v5: number | null;
  crosshair: string | null;
}

export async function fetchCSStats(steamId: string): Promise<CSStatsData | null> {
  const cacheKey = `csstats_${steamId}`;
  const config = getConfig();

  const cached = getCached<CSStatsData>(cacheKey, config.cacheTtl);
  if (cached) return cached;

  // CSStats blocks server-side requests, return null to use fallback
  return null;
}

// Fallback values - update these with your actual stats
export function getCSStatsFallback(): CSStatsData {
  return {
    hltvRating: 1.25,
    hsPercent: 52.3,
    adr: 85.4,
    kd: 1.15,
    clutch1v1: 65,
    clutch1v2: 42,
    clutch1v3: 28,
    clutch1v4: null,
    clutch1v5: null,
    // Your crosshair code - update this with your actual crosshair
    crosshair: 'CSGO-xxxxx-xxxxx-xxxxx-xxxxx-xxxxx'
  };
}
