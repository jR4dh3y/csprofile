// Music Kit MVP preview URLs from CS.Money wiki
// Format: https://wiki.cs.money/audio/music-kit-{slug}/mvp-anthem.mp3
// StatTrak: https://wiki.cs.money/audio/stattrak-music-kit-{slug}/mvp-anthem.mp3

const BASE_URL = 'https://wiki.cs.money/audio/';

// Special slug overrides for kits with non-standard URL formats
const SLUG_OVERRIDES: Record<string, string> = {
  'skog-metal': 'skog-i-metal',
  'skog-ii-headshot': 'skog-ii-headshot',
  'skog-iii-arena': 'skog-iii-arena'
};

// Convert kit name to URL slug
// "Skog, III-Arena" -> "skog-iii-arena"
function toSlug(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[,:!'*~()™]/g, '') // Remove special chars
    .replace(/&/g, 'and')
    .replace(/\+/g, 'plus')
    .replace(/\s+/g, '-') // Spaces to dashes
    .replace(/-+/g, '-') // Multiple dashes to single
    .replace(/^-|-$/g, ''); // Trim dashes

  // Check for overrides
  return SLUG_OVERRIDES[slug] || slug;
}

// Generate MVP anthem URL from kit name
// Try StatTrak URL first if isStatTrak, otherwise use regular
export function getMvpPreviewUrl(kitName: string, isStatTrak: boolean = false): string {
  // Remove "StatTrak™ " prefix if present in name
  const cleanName = kitName.replace(/^StatTrak™?\s*/i, '');
  const slug = toSlug(cleanName);
  // CS.Money wiki uses stattrak prefix for StatTrak kits
  const prefix = isStatTrak ? 'stattrak-music-kit-' : 'music-kit-';
  return `${BASE_URL}${prefix}${slug}/mvp-anthem.mp3`;
}

// Get both possible URLs (StatTrak and non-StatTrak) for fallback
export function getMvpPreviewUrls(kitName: string, isStatTrak: boolean = false): string[] {
  const cleanName = kitName.replace(/^StatTrak™?\s*/i, '');
  const slug = toSlug(cleanName);
  
  if (isStatTrak) {
    // Try StatTrak URL first, then regular
    return [
      `${BASE_URL}stattrak-music-kit-${slug}/mvp-anthem.mp3`,
      `${BASE_URL}music-kit-${slug}/mvp-anthem.mp3`
    ];
  }
  return [`${BASE_URL}music-kit-${slug}/mvp-anthem.mp3`];
}

// Kits that don't have preview URLs on CS.Money
const EXCLUDED_KITS = ['csgo', 'hades', 'valve'];

// Check if kit has a preview available
export function hasPreview(kitName: string): boolean {
  const slug = toSlug(kitName);
  return !EXCLUDED_KITS.some((ex) => slug.includes(ex));
}

// Alias for compatibility - needs isStatTrak param
// Returns undefined for excluded kits
export function findMusicKitPreview(
  kitName: string,
  isStatTrak: boolean = false
): string | undefined {
  if (!hasPreview(kitName)) return undefined;
  return getMvpPreviewUrl(kitName, isStatTrak);
}
