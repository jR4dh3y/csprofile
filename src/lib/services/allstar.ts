import type { AllstarClipsResponse, AllstarClip, AllstarClipDisplay } from '$lib/types';
import { getCached, setCache } from './cache';
import { getConfig } from './config';
import clipsData from '$lib/data/clips.json';
import { API_ENDPOINTS, DEFAULT_CLIP_DURATION, DEFAULT_CLIP_TITLE } from '$lib/config';

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
      title: clip.title || DEFAULT_CLIP_TITLE,
      thumbnail: `${API_ENDPOINTS.allstarMedia}/${clip.id.trim()}/thumb.jpg`,
      embedUrl: `${API_ENDPOINTS.allstarEmbed}?clip=${clip.id.trim()}`,
      duration: DEFAULT_CLIP_DURATION,
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
    let url = `${API_ENDPOINTS.allstar}/user/clips?steamId=${steamId}&limit=${limit}&sort=date`;
    let response = await fetch(url, { headers: { 'X-API-Key': apiKey } });

    let data: AllstarClipsResponse | null = null;

    if (response.ok) {
      data = await response.json();
    }

    // If no clips, try by username
    if (!data?.data?.clips?.length && username) {
      url = `${API_ENDPOINTS.allstar}/user/clips?userId=${username}&limit=${limit}&sort=date`;
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
  return `${API_ENDPOINTS.allstarEmbed}?clip=${clipId}&known=true&UID=${steamId}`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
