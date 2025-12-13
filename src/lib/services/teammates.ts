import { fetchSteamPlayer } from './steam';
import { fetchLeetifyProfile } from './leetify';
import { getTeammateIds } from './config';

export interface Teammate {
  steamId: string;
  name: string;
  profileUrl: string;
  avatarUrl?: string;
  roles?: string[];
  leetifyRating?: number | null;
  aim?: number | null;
  positioning?: number | null;
  utility?: number | null;
  clutch?: number | null;
  opening?: number | null;
}

// Hardcoded roles for teammates (as arrays for separate pills)
const TEAMMATE_ROLES: Record<number, string[]> = {
  0: ['Lurker', 'Support'],
  1: ['Support', 'Anchor', 'Cier-Moment']
};

export async function fetchTeammates(): Promise<Teammate[]> {
  const ids = getTeammateIds();
  if (ids.length === 0) return [];

  const teammates: Teammate[] = [];

  for (let i = 0; i < ids.length; i++) {
    const steamId = ids[i];
    try {
      const player = await fetchSteamPlayer(steamId);
      if (player) {
        const leetifyData = await fetchLeetifyProfile(steamId);

        teammates.push({
          steamId,
          name: player.personaname,
          profileUrl: player.profileurl || `https://steamcommunity.com/profiles/${steamId}`,
          avatarUrl: player.avatar,
          roles: TEAMMATE_ROLES[i] || ['Rifler'],
          leetifyRating: leetifyData?.rating ?? null,
          aim: leetifyData?.aim ?? null,
          positioning: leetifyData?.positioning ?? null,
          utility: leetifyData?.utility ?? null,
          clutch: leetifyData?.clutch ?? null,
          opening: leetifyData?.opening ?? null
        });
      }
    } catch {
      // Skip failed fetches
    }
  }

  return teammates;
}
