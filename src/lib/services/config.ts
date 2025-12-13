import { env } from '$env/dynamic/private';

export interface AppConfig {
  steam: {
    apiKey: string;
    steamId: string;
  };
  leetify: {
    apiKey: string;
  };
  allstar: {
    apiKey: string;
    publicApiKey: string;
    username: string;
  };
  cacheTtl: number;
}

export function getConfig(): AppConfig {
  return {
    steam: {
      apiKey: env.STEAM_API_KEY || '',
      steamId: env.STEAM_ID || ''
    },
    leetify: {
      apiKey: env.LEETIFY_API_KEY || ''
    },
    allstar: {
      apiKey: env.ALLSTAR_API_KEY || '',
      publicApiKey: env.ALLSTAR_PUBLIC_API_KEY || '',
      username: env.ALLSTAR_USERNAME || ''
    },
    cacheTtl: parseInt(env.CACHE_TTL || '300', 10)
  };
}

export function getTeammateIds(): string[] {
  const ids = env.TEAMMATE_IDS || '';
  return ids.split(',').map((t) => t.trim()).filter(Boolean);
}

export function isConfigured(): boolean {
  const config = getConfig();
  return !!(config.steam.apiKey && config.steam.steamId);
}
