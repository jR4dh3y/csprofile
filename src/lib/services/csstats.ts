import { getCached, setCache } from './cache';
import { getConfig } from './config';
import { STATS_FALLBACK } from '$lib/config';

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

// Fallback values from centralized config
export function getCSStatsFallback(): CSStatsData {
  return { ...STATS_FALLBACK };
}
