export interface SteamPlayer {
  steamid: string;
  personaname: string;
  profileurl: string;
  avatar: string;
  avatarmedium: string;
  avatarfull: string;
  personastate: number;
  lastlogoff?: number;
}

export interface SteamPlayerSummaryResponse {
  response: {
    players: SteamPlayer[];
  };
}

export interface CS2Stats {
  totalPlaytime: number;
  totalKills?: number;
  totalDeaths?: number;
  totalWins?: number;
  totalMatches?: number;
}

export interface SteamOwnedGame {
  appid: number;
  name: string;
  playtime_forever: number;
  playtime_2weeks?: number;
}

export interface SteamOwnedGamesResponse {
  response: {
    game_count: number;
    games: SteamOwnedGame[];
  };
}

export interface SteamInventoryItem {
  classid: string;
  instanceid: string;
  name: string;
  market_name: string;
  icon_url: string;
  icon_url_large?: string;
  type: string;
  tags?: Array<{
    category: string;
    internal_name: string;
    localized_category_name: string;
    localized_tag_name: string;
  }>;
}

export interface CS2Medal {
  name: string;
  iconUrl: string;
  type: string;
}

export interface CS2MusicKit {
  name: string;
  artist: string;
  iconUrl: string;
  isStatTrak: boolean;
  previewUrl?: string;
}

export interface CS2Sticker {
  name: string;
  slot: number;
}

export interface CS2WeaponSkin {
  weapon: string;
  name: string;
  iconUrl: string;
  rarity: string;
  isStatTrak: boolean;
  stickers?: CS2Sticker[];
  charm?: string;
}
