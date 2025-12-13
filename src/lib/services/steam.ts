import type {
  SteamPlayer,
  SteamPlayerSummaryResponse,
  SteamOwnedGamesResponse,
  CS2Medal,
  CS2MusicKit,
  CS2WeaponSkin
} from '$lib/types';
import { getCached, setCache } from './cache';
import { getConfig } from './config';
import { findMusicKitPreview } from '$lib/data/musicKitPreviews';
import { 
  API_ENDPOINTS, 
  CS2_APP_ID, 
  LOADOUT_WEAPONS, 
  INVENTORY_EXCLUDE_PATTERNS, 
  INVENTORY_INCLUDE_PATTERNS 
} from '$lib/config';

export async function fetchSteamPlayer(steamId: string): Promise<SteamPlayer | null> {
  const cacheKey = `steam_player_${steamId}`;
  const config = getConfig();

  const cached = getCached<SteamPlayer>(cacheKey, config.cacheTtl);
  if (cached) return cached;

  try {
    const url = `${API_ENDPOINTS.steam}/ISteamUser/GetPlayerSummaries/v2/?key=${config.steam.apiKey}&steamids=${steamId}`;
    const response = await fetch(url);

    if (!response.ok) return null;

    const data: SteamPlayerSummaryResponse = await response.json();
    const player = data.response.players[0] || null;

    if (player) setCache(cacheKey, player);
    return player;
  } catch {
    return null;
  }
}

export async function fetchCS2Playtime(steamId: string): Promise<number | null> {
  const cacheKey = `steam_cs2_playtime_${steamId}`;
  const config = getConfig();

  const cached = getCached<number>(cacheKey, config.cacheTtl);
  if (cached !== null) return cached;

  try {
    const url = `${API_ENDPOINTS.steam}/IPlayerService/GetOwnedGames/v1/?key=${config.steam.apiKey}&steamid=${steamId}&include_appinfo=true&include_played_free_games=true`;
    const response = await fetch(url);

    if (!response.ok) return null;

    const data: SteamOwnedGamesResponse = await response.json();
    const cs2 = data.response.games?.find((g) => g.appid === CS2_APP_ID);
    const playtime = cs2?.playtime_forever || null;

    if (playtime !== null) setCache(cacheKey, playtime);
    return playtime;
  } catch {
    return null;
  }
}

export function formatPlaytime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  if (hours >= 1000) {
    return `${(hours / 1000).toFixed(1)}k hrs`;
  }
  return `${hours} hrs`;
}

export async function fetchCS2Inventory(steamId: string): Promise<CS2Medal[]> {
  const cacheKey = `steam_cs2_inventory_${steamId}`;
  const config = getConfig();

  const cached = getCached<CS2Medal[]>(cacheKey, config.cacheTtl);
  if (cached) return cached;

  try {
    // Steam inventory API for CS2
    const url = `${API_ENDPOINTS.steamCommunity}/inventory/${steamId}/${CS2_APP_ID}/2?l=english&count=500`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) return [];

    const data = await response.json();
    
    if (!data.descriptions) return [];

    const medals: CS2Medal[] = data.descriptions
      .filter((item: { type?: string; name?: string; market_name?: string; tags?: Array<{ localized_tag_name: string; category: string }> }) => {
        const itemType = item.type || '';
        const itemName = item.name || '';
        const marketName = item.market_name || '';
        
        // Exclude unwanted items by type or name
        const isExcluded = INVENTORY_EXCLUDE_PATTERNS.some(ex => 
          itemType.toLowerCase().includes(ex.toLowerCase()) || 
          itemName.toLowerCase().includes(ex.toLowerCase())
        );
        if (isExcluded) return false;
        
        // Check if it's a collectible/medal type
        const isCollectible = INVENTORY_INCLUDE_PATTERNS.some(inc => 
          itemType.toLowerCase().includes(inc.toLowerCase()) ||
          itemName.toLowerCase().includes(inc.toLowerCase()) ||
          marketName.toLowerCase().includes(inc.toLowerCase())
        );
        
        // Also check tags for "Type: Collectible" category
        const hasCollectibleTag = item.tags?.some((tag: { localized_tag_name: string; category: string }) => 
          tag.category === 'Type' && INVENTORY_INCLUDE_PATTERNS.some(inc => 
            tag.localized_tag_name?.toLowerCase().includes(inc.toLowerCase())
          )
        );
        
        return isCollectible || hasCollectibleTag;
      })
      .map((item: { name: string; icon_url: string; type: string }) => ({
        name: item.name,
        iconUrl: `${API_ENDPOINTS.steamCdn}/${item.icon_url}`,
        type: item.type
      }))
      // Sort by year in name (oldest first to show progression)
      .sort((a: CS2Medal, b: CS2Medal) => {
        const yearA = a.name.match(/20\d{2}/)?.[0] || '9999';
        const yearB = b.name.match(/20\d{2}/)?.[0] || '9999';
        return parseInt(yearB) - parseInt(yearA);
      });

    if (medals.length > 0) setCache(cacheKey, medals);
    return medals;
  } catch {
    return [];
  }
}

export async function fetchCS2MusicKits(steamId: string): Promise<CS2MusicKit[]> {
  const cacheKey = `steam_cs2_music_${steamId}`;
  const config = getConfig();

  const cached = getCached<CS2MusicKit[]>(cacheKey, config.cacheTtl);
  if (cached) return cached;

  try {
    const url = `${API_ENDPOINTS.steamCommunity}/inventory/${steamId}/${CS2_APP_ID}/2?l=english&count=500`;
    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) return [];

    const data = await response.json();
    
    if (!data.descriptions) return [];

    const musicKits: CS2MusicKit[] = data.descriptions
      .filter((item: { type?: string; tags?: Array<{ localized_tag_name: string }> }) => {
        const itemType = item.type || '';
        return itemType.toLowerCase().includes('music kit');
      })
      .map((item: { name: string; icon_url: string; type: string }) => {
        const cleanName = item.name.replace('Music Kit | ', '').replace('StatTrak™ ', '');
        
        return {
          name: cleanName,
          artist: item.name.includes('|') ? item.name.split('|')[0].replace('Music Kit', '').replace('StatTrak™', '').trim() : '',
          iconUrl: `${API_ENDPOINTS.steamCdn}/${item.icon_url}`,
          isStatTrak: item.name.includes('StatTrak'),
          previewUrl: findMusicKitPreview(cleanName)
        };
      });

    if (musicKits.length > 0) setCache(cacheKey, musicKits);
    return musicKits;
  } catch {
    return [];
  }
}

export async function fetchCS2WeaponSkins(steamId: string): Promise<CS2WeaponSkin[]> {
  const cacheKey = `steam_cs2_weapons_${steamId}`;
  const config = getConfig();

  const cached = getCached<CS2WeaponSkin[]>(cacheKey, config.cacheTtl);
  if (cached) return cached;

  try {
    const url = `${API_ENDPOINTS.steamCommunity}/inventory/${steamId}/${CS2_APP_ID}/2?l=english&count=500`;
    const response = await fetch(url, {
      headers: { Accept: 'application/json' }
    });

    if (!response.ok) return [];

    const data = await response.json();

    if (!data.descriptions) return [];

    const weapons: CS2WeaponSkin[] = data.descriptions
      .filter(
        (item: {
          type?: string;
          tags?: Array<{ category: string; localized_tag_name: string }>;
        }) => {
          // Check if it's a weapon skin
          const weaponTag = item.tags?.find((t) => t.category === 'Weapon');
          if (!weaponTag) return false;

          const weaponName = weaponTag.localized_tag_name.toLowerCase();
          return LOADOUT_WEAPONS.some((w) => weaponName.includes(w));
        }
      )
      .map(
        (item: {
          name: string;
          icon_url: string;
          type: string;
          descriptions?: Array<{ type?: string; value: string }>;
          tags?: Array<{ category: string; localized_tag_name: string; internal_name: string }>;
        }) => {
          const weaponTag = item.tags?.find((t) => t.category === 'Weapon');
          const rarityTag = item.tags?.find((t) => t.category === 'Rarity');

          // Parse stickers from descriptions
          const stickers: { name: string; slot: number }[] = [];
          let charm: string | undefined;

          // Find the sticker description line
          const stickerDesc = item.descriptions?.find((d) => 
            d.value?.includes('Sticker:') || d.value?.includes('sticker_info')
          );
          
          if (stickerDesc?.value) {
            // Clean HTML and extract sticker names
            // Format is usually: "Sticker: Name1, Name2, Name3"
            const cleanText = stickerDesc.value
              .replace(/<[^>]*>/g, '') // Remove HTML tags
              .replace(/&[^;]+;/g, '') // Remove HTML entities
              .trim();
            
            const stickerMatch = cleanText.match(/Sticker:\s*(.+)/);
            if (stickerMatch) {
              const stickerNames = stickerMatch[1].split(',').map(s => s.trim()).filter(Boolean);
              stickerNames.forEach((name, idx) => {
                stickers.push({ name, slot: idx });
              });
            }
          }

          // Check for charm
          const charmDesc = item.descriptions?.find((d) => d.value?.includes('Charm:'));
          if (charmDesc?.value) {
            const cleanText = charmDesc.value.replace(/<[^>]*>/g, '').trim();
            const charmMatch = cleanText.match(/Charm:\s*(.+)/);
            if (charmMatch) {
              charm = charmMatch[1].trim();
            }
          }

          return {
            weapon: weaponTag?.localized_tag_name || 'Unknown',
            name: item.name,
            iconUrl: `${API_ENDPOINTS.steamCdn}/${item.icon_url}`,
            rarity: rarityTag?.localized_tag_name || 'Common',
            isStatTrak: item.name.includes('StatTrak'),
            stickers: stickers.length > 0 ? stickers : undefined,
            charm
          };
        }
      );

    if (weapons.length > 0) setCache(cacheKey, weapons);
    return weapons;
  } catch {
    return [];
  }
}
