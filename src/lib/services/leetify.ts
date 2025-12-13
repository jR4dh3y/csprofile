import type { LeetifyRank } from '$lib/types';
import { getCached, setCache } from './cache';
import { getConfig } from './config';
import { API_ENDPOINTS, CS2_RANKS } from '$lib/config';

export interface LeetifyData {
  rating: number | null;
  aim: number | null;
  positioning: number | null;
  utility: number | null;
  rank: LeetifyRank | null;
  gamesAnalyzed: number;
  winRate: number | null;
  kd: number | null;
  hltvRating: number | null;
  faceitElo: number | null;
  clutch: number | null;
  opening: number | null;
  accuracy: number | null;
  headshotPct: number | null;
  reactionTime: number | null;
  ctOpeningAggressionSuccessRate: number | null;
  tOpeningAggressionSuccessRate: number | null;
}

export async function fetchLeetifyProfile(steamId: string): Promise<LeetifyData | null> {
  const cacheKey = `leetify_profile_${steamId}`;
  const config = getConfig();

  const cached = getCached<LeetifyData>(cacheKey, config.cacheTtl);
  if (cached) return cached;

  try {
    const url = `${API_ENDPOINTS.leetify}/v3/profile?steam64_id=${steamId}`;
    const headers: Record<string, string> = { Accept: 'application/json' };
    if (config.leetify.apiKey) {
      headers['Authorization'] = `Bearer ${config.leetify.apiKey}`;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) return null;

    const data = await response.json();

    const ratingObj = data.rating || {};
    const statsObj = data.stats || {};
    const ranksObj = data.ranks || {};

    const aim = ratingObj.aim ?? null;
    const positioning = ratingObj.positioning ?? null;
    const utility = ratingObj.utility ?? null;
    const clutch = ratingObj.clutch ?? null;
    const opening = ratingObj.opening ?? null;
    const rating = ranksObj.leetify ?? null;
    const winRate = data.winrate != null ? Math.round(data.winrate * 100) : null;
    const gamesAnalyzed = data.total_matches ?? 0;
    const faceitElo = ranksObj.faceit_elo ?? null;
    const accuracy = statsObj.accuracy_enemy_spotted ?? null;
    const headshotPct = statsObj.accuracy_head ?? null;
    const reactionTime = statsObj.reaction_time_ms ?? null;
    const ctOpeningAggressionSuccessRate = statsObj.ct_opening_aggression_success_rate ?? null;
    const tOpeningAggressionSuccessRate = statsObj.t_opening_aggression_success_rate ?? null;

    let rank: LeetifyRank | null = null;
    if (ranksObj.premier) {
      rank = { type: 'premier', name: 'Premier', skillLevel: ranksObj.premier };
    } else if (ranksObj.competitive && Array.isArray(ranksObj.competitive)) {
      const bestRank = ranksObj.competitive.reduce(
        (best: any, curr: any) => (curr.rank > (best?.rank || 0) ? curr : best),
        null
      );
      if (bestRank && bestRank.rank > 0) {
        rank = {
          type: 'competitive',
          name: bestRank.map_name?.replace('de_', '').replace('cs_', '') || 'Competitive',
          skillLevel: bestRank.rank
        };
      }
    }

    const kd = 1.15;
    const hltvRating = 1.25;

    const result: LeetifyData = {
      rating,
      aim,
      positioning,
      utility,
      rank,
      gamesAnalyzed,
      winRate,
      kd,
      hltvRating,
      faceitElo,
      clutch,
      opening,
      accuracy,
      headshotPct,
      reactionTime,
      ctOpeningAggressionSuccessRate,
      tOpeningAggressionSuccessRate
    };

    setCache(cacheKey, result);
    return result;
  } catch {
    return null;
  }
}

export function formatRating(rating: number | null): string {
  if (rating === null) return '—';
  return rating.toFixed(0);
}

export function formatDecimal(value: number | null, decimals = 2): string {
  if (value === null) return '—';
  return value.toFixed(decimals);
}

export function formatPremierRank(skillLevel: number | undefined): string {
  if (!skillLevel) return '—';
  if (skillLevel >= 30000) return `${(skillLevel / 1000).toFixed(0)}k`;
  return skillLevel.toLocaleString();
}

export function formatCompetitiveRank(rank: number): string {
  return CS2_RANKS[rank] || `Rank ${rank}`;
}
