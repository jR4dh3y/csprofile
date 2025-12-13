// Music Kit MVP preview URLs from CS.Money wiki
import { 
  MUSIC_KIT_PREVIEW_BASE_URL, 
  MUSIC_KIT_SLUG_OVERRIDES, 
  MUSIC_KIT_EXCLUDED 
} from '$lib/config';

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
  return MUSIC_KIT_SLUG_OVERRIDES[slug] || slug;
}

// Generate MVP anthem URL from kit name
export function getMvpPreviewUrl(kitName: string, isStatTrak: boolean = false): string {
  const cleanName = kitName.replace(/^StatTrak™?\s*/i, '');
  const slug = toSlug(cleanName);
  const prefix = isStatTrak ? 'stattrak-music-kit-' : 'music-kit-';
  return `${MUSIC_KIT_PREVIEW_BASE_URL}${prefix}${slug}/mvp-anthem.mp3`;
}

// Get both possible URLs (StatTrak and non-StatTrak) for fallback
export function getMvpPreviewUrls(kitName: string, isStatTrak: boolean = false): string[] {
  const cleanName = kitName.replace(/^StatTrak™?\s*/i, '');
  const slug = toSlug(cleanName);
  
  if (isStatTrak) {
    return [
      `${MUSIC_KIT_PREVIEW_BASE_URL}stattrak-music-kit-${slug}/mvp-anthem.mp3`,
      `${MUSIC_KIT_PREVIEW_BASE_URL}music-kit-${slug}/mvp-anthem.mp3`
    ];
  }
  return [`${MUSIC_KIT_PREVIEW_BASE_URL}music-kit-${slug}/mvp-anthem.mp3`];
}

// Check if kit has a preview available
export function hasPreview(kitName: string): boolean {
  const slug = toSlug(kitName);
  return !MUSIC_KIT_EXCLUDED.some((ex) => slug.includes(ex));
}

// Alias for compatibility
export function findMusicKitPreview(
  kitName: string,
  isStatTrak: boolean = false
): string | undefined {
  if (!hasPreview(kitName)) return undefined;
  return getMvpPreviewUrl(kitName, isStatTrak);
}
