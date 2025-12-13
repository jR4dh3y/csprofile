import { fetchSteamPlayer } from './steam';
import { getTeammateIds } from './config';

export interface Teammate {
  steamId: string;
  name: string;
  profileUrl: string;
  avatarUrl?: string;
}

export async function fetchTeammates(): Promise<Teammate[]> {
  const ids = getTeammateIds();
  if (ids.length === 0) return [];

  const teammates: Teammate[] = [];

  for (const steamId of ids) {
    try {
      const player = await fetchSteamPlayer(steamId);
      if (player) {
        teammates.push({
          steamId,
          name: player.personaname,
          profileUrl: player.profileurl || `https://steamcommunity.com/profiles/${steamId}`,
          avatarUrl: player.avatar
        });
      }
    } catch {
      // Skip failed fetches
    }
  }

  return teammates;
}
