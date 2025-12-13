<script lang="ts">
  import type { CS2MusicKit } from '$lib/types';
  import { getMvpPreviewUrls, hasPreview } from '$lib/data/musicKitPreviews';

  export let musicKits: CS2MusicKit[];

  let expanded = false;
  let currentlyPlaying: string | null = null;
  let audioElement: HTMLAudioElement | null = null;

  function canPreview(kit: CS2MusicKit): boolean {
    return hasPreview(kit.name);
  }

  // Try to play audio from a list of URLs, falling back to next on failure
  async function tryPlayUrls(urls: string[]): Promise<boolean> {
    for (const url of urls) {
      try {
        const audio = new Audio(url);
        audio.volume = 0.5;
        
        await new Promise<void>((resolve, reject) => {
          audio.oncanplaythrough = () => resolve();
          audio.onerror = () => reject(new Error('Failed to load'));
          audio.load();
        });
        
        audioElement = audio;
        audioElement.onended = () => {
          currentlyPlaying = null;
        };
        
        await audioElement.play();
        return true;
      } catch {
        continue;
      }
    }
    return false;
  }

  async function togglePreview(kit: CS2MusicKit) {
    if (!canPreview(kit)) return;

    if (currentlyPlaying === kit.name) {
      audioElement?.pause();
      currentlyPlaying = null;
      return;
    }

    if (audioElement) {
      audioElement.pause();
    }

    const urls = getMvpPreviewUrls(kit.name, kit.isStatTrak);
    const success = await tryPlayUrls(urls);
    
    if (success) {
      currentlyPlaying = kit.name;
    } else {
      console.error('All URLs failed for:', kit.name);
      currentlyPlaying = null;
    }
  }
</script>

{#if musicKits.length > 0}
  <div class="space-y-4">
    <button
      type="button"
      class="text-xs uppercase tracking-wide flex items-center gap-2 text-muted hover:text-text transition-colors"
      on:click={() => (expanded = !expanded)}
    >
      <span class="text-primary">{expanded ? '−' : '+'}</span>
      <span>Music Kits ({musicKits.length})</span>
    </button>

    {#if expanded}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {#each musicKits as kit}
          <div class="group relative bg-surface border border-border rounded-lg p-3 hover:border-primary transition-colors">
            <img 
              src={kit.iconUrl} 
              alt={kit.name}
              class="w-full aspect-square object-contain mb-2"
            />
            <div class="flex items-center gap-1">
              <p class="text-xs text-text truncate flex-1" title={kit.name}>{kit.name}</p>
              {#if canPreview(kit)}
                <button
                  type="button"
                  class="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-primary/20 hover:bg-primary/40 transition-colors"
                  on:click|stopPropagation={() => togglePreview(kit)}
                  title={currentlyPlaying === kit.name ? 'Stop MVP Preview' : 'Play MVP Preview'}
                >
                  {#if currentlyPlaying === kit.name}
                    <svg class="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <rect x="6" y="4" width="4" height="16" />
                      <rect x="14" y="4" width="4" height="16" />
                    </svg>
                  {:else}
                    <svg class="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  {/if}
                </button>
              {/if}
            </div>
            {#if kit.isStatTrak}
              <span class="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 bg-warning/20 text-warning rounded">
                ST
              </span>
            {/if}
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}
