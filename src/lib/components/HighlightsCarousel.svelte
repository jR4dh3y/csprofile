<script lang="ts">
  import type { AllstarClipDisplay } from '$lib/types';

  export let clips: AllstarClipDisplay[];
  export let steamId: string;

  let expanded = false;
  let selectedIndex = 0;

  $: selectedClip = clips[selectedIndex];
  $: embedUrl = selectedClip
    ? `https://allstar.gg/iframe?clip=${selectedClip.id}&known=true&UID=${steamId}&location=userProfile`
    : '';

  function prev() {
    selectedIndex = selectedIndex > 0 ? selectedIndex - 1 : clips.length - 1;
  }

  function next() {
    selectedIndex = selectedIndex < clips.length - 1 ? selectedIndex + 1 : 0;
  }
</script>

{#if clips.length > 0}
  <div class="space-y-4">
    <button
      type="button"
      class="text-xs uppercase tracking-wide flex items-center gap-2 text-muted hover:text-text transition-colors"
      on:click={() => (expanded = !expanded)}
    >
      <span class="text-primary">{expanded ? '−' : '+'}</span>
      <span>Highlights ({clips.length})</span>
    </button>

    {#if expanded}
      <div class="space-y-3">
        <div class="aspect-video w-full rounded-lg overflow-hidden border bg-surface border-border">
          <iframe
            src={embedUrl}
            title={selectedClip?.title || 'Clip'}
            class="w-full h-full"
            allow="clipboard-write"
            allowfullscreen
          ></iframe>
        </div>

        <div class="text-center text-sm text-text font-medium truncate">
          {selectedClip?.title || 'Highlight'}
        </div>

        <div class="flex items-center justify-between">
          <button
            type="button"
            on:click={prev}
            class="px-3 py-1.5 text-sm rounded bg-surface border border-border text-muted hover:text-text hover:border-primary transition-colors"
          >
            ← Prev
          </button>
          <span class="text-xs text-muted font-mono">{selectedIndex + 1} / {clips.length}</span>
          <button
            type="button"
            on:click={next}
            class="px-3 py-1.5 text-sm rounded bg-surface border border-border text-muted hover:text-text hover:border-primary transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    {/if}
  </div>
{/if}
