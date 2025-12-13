import type { PageServerLoad } from './$types';
import type { ProfileData, ProfileMetric, ClutchData } from '$lib/types';
import { getConfig, isConfigured } from '$lib/services/config';
import { fetchSteamPlayer, fetchCS2Playtime, formatPlaytime, fetchCS2Inventory, fetchCS2MusicKits, fetchCS2WeaponSkins } from '$lib/services/steam';
import { fetchLeetifyProfile, formatDecimal } from '$lib/services/leetify';
import { fetchAllstarClips } from '$lib/services/allstar';
import { fetchTeammates } from '$lib/services/teammates';
import { getCSStatsFallback } from '$lib/services/csstats';
import { PROFILE_CONTEXT, DEFAULT_PLAYER_NAME } from '$lib/config';

export const load: PageServerLoad = async () => {
  const config = getConfig();
  const steamId = config.steam.steamId;

  if (!isConfigured()) {
    return {
      profile: null,
      steamId: '',
      error: 'Profile not configured'
    };
  }

  const [steamPlayer, playtime, leetify, clips, teammates, medals, musicKits, weaponSkins] = await Promise.all([
    fetchSteamPlayer(steamId).catch(() => null),
    fetchCS2Playtime(steamId).catch(() => null),
    fetchLeetifyProfile(steamId).catch(() => null),
    fetchAllstarClips(steamId, 50).catch(() => []),
    fetchTeammates().catch(() => []),
    fetchCS2Inventory(steamId).catch(() => []),
    fetchCS2MusicKits(steamId).catch(() => []),
    fetchCS2WeaponSkins(steamId).catch(() => [])
  ]);

  const stats = getCSStatsFallback();
  const metrics: ProfileMetric[] = [];

  // Row 1: Leetify, HLTV, K/D
  if (leetify?.rating) {
    metrics.push({
      label: 'Leetify',
      value: formatDecimal(leetify.rating, 2)
    });
  }

  metrics.push({
    label: 'HLTV 2.0',
    value: formatDecimal(stats.hltvRating, 2)
  });

  metrics.push({
    label: 'K/D',
    value: formatDecimal(stats.kd, 2)
  });

  // Row 2: CT Opening, T Opening, Reaction
  if (leetify?.ctOpeningAggressionSuccessRate != null) {
    metrics.push({
      label: 'CT Opening Attempt',
      value: `${formatDecimal(leetify.ctOpeningAggressionSuccessRate, 1)}%`
    });
  }

  if (leetify?.tOpeningAggressionSuccessRate != null) {
    metrics.push({
      label: 'T Opening Attempt',
      value: `${formatDecimal(leetify.tOpeningAggressionSuccessRate, 1)}%`
    });
  }

  if (leetify?.reactionTime != null) {
    metrics.push({
      label: 'Reaction',
      value: `${Math.round(leetify.reactionTime)}ms`
    });
  }

  // Row 3: HS%, Playtime, Matches
  metrics.push({
    label: 'HS%',
    value: `${formatDecimal(stats.hsPercent, 1)}%`
  });

  if (playtime) {
    metrics.push({
      label: 'Playtime',
      value: formatPlaytime(playtime)
    });
  }

  if (leetify?.gamesAnalyzed) {
    metrics.push({
      label: 'Matches',
      value: leetify.gamesAnalyzed.toLocaleString()
    });
  }

  // Clutch stats
  const clutchStats: ClutchData = {
    clutch1v1: stats.clutch1v1,
    clutch1v2: stats.clutch1v2,
    clutch1v3: stats.clutch1v3
  };

  const profile: ProfileData = {
    identity: {
      handle: steamPlayer?.personaname || DEFAULT_PLAYER_NAME,
      context: PROFILE_CONTEXT,
      avatarUrl: steamPlayer?.avatarfull || steamPlayer?.avatarmedium,
      profileUrl: steamPlayer?.profileurl,
      medals,
      crosshair: stats.crosshair || undefined
    },
    metrics: metrics.slice(0, 9),
    clutchStats,
    highlights: clips,
    teammates,
    musicKits,
    weaponSkins,
    lastUpdated: new Date().toISOString()
  };

  return {
    profile,
    steamId,
    error: null
  };
};
