<script lang="ts">
  import type { AllstarClipDisplay } from '$lib/types';

  export let clip: AllstarClipDisplay;
  export let selected = false;
  export let onClick: () => void;

  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
</script>

<button
  type="button"
  class="relative w-full aspect-video overflow-hidden rounded-lg border transition-all
         {selected ? 'border-primary ring-1 ring-primary/30' : 'border-border hover:border-selection'}"
  on:click={onClick}
>
  <img src={clip.thumbnail} alt={clip.title} class="w-full h-full object-cover opacity-80" />
  <span class="absolute bottom-1 right-1 px-1.5 py-0.5 text-xs font-mono bg-background/80 text-text rounded">
    {formatDuration(clip.duration)}
  </span>
  {#if clip.map}
    <span class="absolute top-1 left-1 px-1.5 py-0.5 text-xs font-mono bg-background/80 text-muted rounded">
      {clip.map}
    </span>
  {/if}
</button>
