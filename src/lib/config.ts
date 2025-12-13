/**
 * Centralized configuration file for all hardcoded values.
 * Edit this file to customize your CS2 profile page.
 */

// ============================================
// PROFILE IDENTITY
// ============================================

/** Page title shown in browser tab */
export const PAGE_TITLE = '--jR4dh3y • CS2 Profile';

/** Meta description for SEO */
export const PAGE_DESCRIPTION = 'Counter-Strike 2 profile';

/** Context text shown below username */
export const PROFILE_CONTEXT = 'Counter-Strike 2';

/** Default player name if Steam API fails */
export const DEFAULT_PLAYER_NAME = 'Player';

/** Footer link */
export const FOOTER_LINK = {
  url: 'https://radhey.dev',
  text: 'radhey.dev'
};

// ============================================
// PLAYER ROLES
// ============================================

/** Your roles displayed on the profile */
export const PLAYER_ROLES = ['AWPer', 'IGL/Entry', 'Clutcher', 'Team Player'];

// ============================================
// TEAMMATE ROLES
// ============================================

/** 
 * Roles for each teammate by index (0-based).
 * Key = teammate index, Value = array of role strings
 */
export const TEAMMATE_ROLES: Record<number, string[]> = {
  0: ['Lurker', 'Support'],
  1: ['Support', 'Anchor', 'Cier-Moment']
};

/** Default role if teammate index not found */
export const DEFAULT_TEAMMATE_ROLE = ['Rifler'];

// ============================================
// STATS FALLBACK VALUES
// ============================================

/** 
 * Fallback stats when CSStats API is unavailable.
 * Update these with your actual stats.
 */
export const STATS_FALLBACK = {
  hltvRating: 1.25,
  hsPercent: 52.3,
  adr: 85.4,
  kd: 1.15,
  clutch1v1: 65,
  clutch1v2: 42,
  clutch1v3: 28,
  clutch1v4: null as number | null,
  clutch1v5: null as number | null,
  /** Your crosshair code - paste it here */
  crosshair: ''
};

// ============================================
// WEAPON LOADOUT
// ============================================

/** Weapons to show in the loadout section (lowercase for matching) */
export const LOADOUT_WEAPONS = [
  'glock',
  'usp',
  'p250',
  'ak-47',
  'm4a4',
  'm4a1',
  'awp',
  'desert eagle',
  'deagle',
  'ssg',
  'scout'
];

// ============================================
// WEAPON CATEGORIES
// ============================================

/** Categories for grouping weapons in the loadout */
export const WEAPON_CATEGORIES = [
  { name: 'Pistols', patterns: ['glock', 'usp', 'p250', 'desert eagle'] },
  { name: 'Rifles', patterns: ['ak-47', 'm4a4', 'm4a1'] },
  { name: 'Snipers', patterns: ['awp', 'ssg'] }
];

/** Order in which categories are displayed */
export const WEAPON_CATEGORY_ORDER = ['Pistols', 'Rifles', 'Snipers', 'Other'];

// ============================================
// CS2 RANKS
// ============================================

/** Competitive rank names by index */
export const CS2_RANKS = [
  '',
  'Silver I',
  'Silver II',
  'Silver III',
  'Silver IV',
  'Silver Elite',
  'Silver Elite Master',
  'Gold Nova I',
  'Gold Nova II',
  'Gold Nova III',
  'Gold Nova Master',
  'Master Guardian I',
  'Master Guardian II',
  'Master Guardian Elite',
  'Distinguished Master Guardian',
  'Legendary Eagle',
  'Legendary Eagle Master',
  'Supreme Master First Class',
  'Global Elite'
];

// ============================================
// INVENTORY FILTERS
// ============================================

/** Patterns to exclude from medal/collectible inventory */
export const INVENTORY_EXCLUDE_PATTERNS = [
  'Graffiti', 'Sticker', 'Case', 'Key', 'Container',
  'Patch', 'Agent', 'Music Kit', 'Capsule', 'Package',
  'Souvenir', 'StatTrak'
];

/** Patterns to include for medals/collectibles */
export const INVENTORY_INCLUDE_PATTERNS = [
  'Service Medal', 'Coin', 'Trophy', 'Pin', 'Badge',
  'Collectible', 'Medal', 'Pick\'Em', 'Extraordinary Collectible',
  'Extraordinary', 'High Grade Collectible', 'Remarkable Collectible'
];

// ============================================
// MUSIC KIT PREVIEWS
// ============================================

/** Base URL for music kit previews */
export const MUSIC_KIT_PREVIEW_BASE_URL = 'https://wiki.cs.money/audio/';

/** Special slug overrides for kits with non-standard URL formats */
export const MUSIC_KIT_SLUG_OVERRIDES: Record<string, string> = {
  'skog-metal': 'skog-i-metal',
  'skog-ii-headshot': 'skog-ii-headshot',
  'skog-iii-arena': 'skog-iii-arena'
};

/** Kits that don't have preview URLs */
export const MUSIC_KIT_EXCLUDED = ['csgo', 'hades', 'valve'];

/** Default audio volume for music kit previews (0-1) */
export const MUSIC_KIT_VOLUME = 0.5;

// ============================================
// API ENDPOINTS
// ============================================

export const API_ENDPOINTS = {
  steam: 'https://api.steampowered.com',
  steamCommunity: 'https://steamcommunity.com',
  steamCdn: 'https://steamcommunity-a.akamaihd.net/economy/image',
  leetify: 'https://api-public.cs-prod.leetify.com',
  allstar: 'https://prt.allstar.gg',
  allstarMedia: 'https://media.allstar.gg/clips',
  allstarEmbed: 'https://allstar.gg/iframe'
};

/** CS2 App ID on Steam */
export const CS2_APP_ID = 730;

// ============================================
// UI LABELS & TEXT
// ============================================

export const UI_TEXT = {
  profileUnavailable: 'Profile unavailable',
  highlights: 'Highlights',
  musicKits: 'Music Kits',
  myLoadout: 'My Loadout',
  playsWith: 'Plays with',
  clutchSuccess: 'Clutch Success',
  copyCrosshair: '⊕ Crosshair',
  copiedCrosshair: '✓ Copied!',
  prevButton: '← Prev',
  nextButton: 'Next →',
  stopPreview: 'Stop MVP Preview',
  playPreview: 'Play MVP Preview',
  updated: 'Updated'
};

// ============================================
// METRIC COLOR MAPPING
// ============================================

/** 
 * Keywords to color class mapping for metrics.
 * Order matters - first match wins.
 */
export const METRIC_COLOR_MAP: Array<{ keywords: string[]; colorClass: string }> = [
  { keywords: ['premier', 'rank'], colorClass: 'text-primary' },
  { keywords: ['rating', 'hltv'], colorClass: 'text-highlight' },
  { keywords: ['aim', 'k/d'], colorClass: 'text-error' },
  { keywords: ['positioning'], colorClass: 'text-secondary' },
  { keywords: ['utility'], colorClass: 'text-primary' },
  { keywords: ['win'], colorClass: 'text-warning' }
];

/** Default color class for metrics */
export const METRIC_DEFAULT_COLOR = 'text-text';

// ============================================
// CLIPS CONFIGURATION
// ============================================

/** Default clip duration in seconds when not available from API */
export const DEFAULT_CLIP_DURATION = 15;

/** Default clip title */
export const DEFAULT_CLIP_TITLE = 'Highlight';
