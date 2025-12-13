import type { AllstarClipsResponse, AllstarClip, AllstarClipDisplay } from '$lib/types';
import { getCached, setCache } from './cache';
import { getConfig } from './config';
import clipsData from '$lib/data/clips.json';

const ALLSTAR_API_BASE = 'https://prt.allstar.gg';

export async function fetchAllstarClips(
  steamId: string,
  limit = 3
): Promise<AllstarClipDisplay[]> {
  const config = getConfig();
  const cacheKey = `allstar_clips_${steamId}_${limit}`;

  const cached = getCached<AllstarClipDisplay[]>(cacheKey, config.cacheTtl);
  if (cached) return cached;

  const apiKey = config.allstar.publicApiKey || config.allstar.apiKey;
  
  // Try API first
  if (apiKey) {
    const apiClips = await fetchClipsFromAPI(steamId, limit, apiKey, config.allstar.username);
    if (apiClips.length > 0) {
      setCache(cacheKey, apiClips);
      return apiClips;
    }
  }

  // Fallback to manual clip IDs from JSON file
  const manualClips = clipsData.clips || [];
  if (manualClips.length > 0) {
    const clips = manualClips.slice(0, limit).map((clip) => ({
      id: clip.id.trim(),
      title: clip.title || 'Highlight',
      thumbnail: `https://media.allstar.gg/clips/${clip.id.trim()}/thumb.jpg`,
      embedUrl: `https://allstar.gg/iframe?clip=${clip.id.trim()}`,
      duration: 15,
      date: new Date().toISOString(),
      map: undefined,
      kills: undefined
    }));
    setCache(cacheKey, clips);
    return clips;
  }

  return [];
}

async function fetchClipsFromAPI(
  steamId: string,
  limit: number,
  apiKey: string,
  username?: string
): Promise<AllstarClipDisplay[]> {
  try {
    // Try fetching by Steam ID first
    let url = `${ALLSTAR_API_BASE}/user/clips?steamId=${steamId}&limit=${limit}&sort=date`;
    let response = await fetch(url, { headers: { 'X-API-Key': apiKey } });

    let data: AllstarClipsResponse | null = null;

    if (response.ok) {
      data = await response.json();
    }

    // If no clips, try by username
    if (!data?.data?.clips?.length && username) {
      url = `${ALLSTAR_API_BASE}/user/clips?userId=${username}&limit=${limit}&sort=date`;
      response = await fetch(url, { headers: { 'X-API-Key': apiKey } });

      if (response.ok) {
        data = await response.json();
      }
    }

    if (!data?.data?.clips) return [];

    return data.data.clips
      .filter((c) => c.status === 'Processed')
      .slice(0, limit)
      .map(transformClip);
  } catch {
    return [];
  }
}

function transformClip(clip: AllstarClip): AllstarClipDisplay {
  const map = clip.metadata?.find((m) => m.key === 'CS_Map')?.value;
  const kills = clip.metadata?.find((m) => m.key === 'CS_Kill Count')?.value;

  return {
    id: clip._id,
    title: clip.clipTitle,
    thumbnail: clip.clipImageThumbURL || clip.clipSnapshotURL,
    embedUrl: clip.clipUrl,
    duration: clip.clipLength,
    date: clip.createdDate,
    map,
    kills
  };
}

export function buildEmbedUrl(clipId: string, steamId: string): string {
  return `https://allstar.gg/iframe?clip=${clipId}&known=true&UID=${steamId}`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
