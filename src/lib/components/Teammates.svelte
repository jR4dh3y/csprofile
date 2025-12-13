<script lang="ts">
  import type { ProfileTeammate } from '$lib/types';

  export let teammates: ProfileTeammate[];
</script>

{#if teammates.length > 0}
  <div class="flex items-center gap-3 flex-wrap">
    <span class="uppercase tracking-wide text-xs text-muted">Plays with</span>
    <div class="flex items-center gap-4">
      {#each teammates as teammate (teammate.steamId)}
        <a
          href={teammate.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          class="flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors group"
        >
          {#if teammate.avatarUrl}
            <img
              src={teammate.avatarUrl}
              alt=""
              class="w-5 h-5 rounded-full opacity-70 group-hover:opacity-100 transition-opacity"
            />
          {/if}
          <span class="border-b border-transparent group-hover:border-primary/50">{teammate.name}</span>
        </a>
      {/each}
    </div>
  </div>
{/if}
