<script lang="ts">
  import type { ProfileIdentity } from '$lib/types';

  export let identity: ProfileIdentity;
  
  let copied = false;
  
  async function copyCrosshair() {
    if (!identity.crosshair) return;
    await navigator.clipboard.writeText(identity.crosshair);
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
</script>

<div class="flex items-center gap-5">
  {#if identity.avatarUrl}
    <img src={identity.avatarUrl} alt="" class="w-16 h-16 rounded-lg ring-2 ring-selection" />
  {/if}
  <div>
    <div class="flex items-center gap-3 flex-wrap">
      {#if identity.profileUrl}
        <a 
          href={identity.profileUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          class="text-xl font-mono font-medium text-text hover:text-primary transition-colors"
        >
          {identity.handle}
        </a>
      {:else}
        <h1 class="text-xl font-mono font-medium text-text">{identity.handle}</h1>
      {/if}
      
      {#if identity.medals && identity.medals.length > 0}
        <div class="flex items-center gap-1.5">
          {#each identity.medals as medal}
            <img 
              src={medal.iconUrl} 
              alt={medal.name}
              title={medal.name}
              class="w-6 h-6 object-contain"
            />
          {/each}
        </div>
      {/if}
    </div>
    
    <div class="flex items-center gap-3 mt-1">
      <p class="text-sm text-muted">{identity.context}</p>
      
      {#if identity.crosshair}
        <button
          on:click={copyCrosshair}
          class="text-xs px-2 py-0.5 rounded bg-surface border border-border text-muted hover:text-text hover:border-primary transition-colors"
          title="Copy crosshair code"
        >
          {copied ? '✓ Copied!' : '⊕ Crosshair'}
        </button>
      {/if}
    </div>
  </div>
</div>
