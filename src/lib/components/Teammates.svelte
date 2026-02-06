<script lang="ts">
  import type { ProfileTeammate } from '$lib/types';
  import { UI_TEXT } from '$lib/config';

  export let teammates: ProfileTeammate[];

  function formatStat(value: number | null | undefined): string {
    if (value === null || value === undefined) return '—';
    return value.toFixed(2);
  }
</script>

{#if teammates.length > 0}
  <div class="flex items-center gap-3 flex-wrap">
    <span class="uppercase tracking-wide text-xs text-muted">{UI_TEXT.playsWith}</span>
    <div class="flex items-center gap-4 flex-wrap">
      {#each teammates as teammate (teammate.steamId)}
        <div class="relative group/tooltip">
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

          <!-- Tooltip -->
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all duration-200 pointer-events-none z-10">
            <div class="bg-surface border border-border rounded-lg p-3 shadow-xl min-w-[180px]">
              <div class="text-xs space-y-2">
                <div class="font-semibold text-text border-b border-border pb-2 mb-2">
                  {teammate.name}
                </div>

                {#if teammate.roles && teammate.roles.length > 0}
                  <div class="flex justify-center gap-1.5 mb-2 whitespace-nowrap">
                    {#each teammate.roles as role}
                      <span class="text-[10px] px-2 py-0.5 rounded-full bg-background border border-border text-muted">
                        {role}
                      </span>
                    {/each}
                  </div>
                {/if}

                {#if teammate.leetifyRating !== null && teammate.leetifyRating !== undefined}
                  <div class="flex justify-between">
                    <span class="text-muted">Rating:</span>
                    <span class="text-text">{formatStat(teammate.leetifyRating)}</span>
                  </div>
                {/if}

                {#if teammate.aim !== null && teammate.aim !== undefined}
                  <div class="flex justify-between">
                    <span class="text-muted">Aim:</span>
                    <span class="text-text">{formatStat(teammate.aim)}</span>
                  </div>
                {/if}

                {#if teammate.positioning !== null && teammate.positioning !== undefined}
                  <div class="flex justify-between">
                    <span class="text-muted">Positioning:</span>
                    <span class="text-text">{formatStat(teammate.positioning)}</span>
                  </div>
                {/if}

                {#if teammate.utility !== null && teammate.utility !== undefined}
                  <div class="flex justify-between">
                    <span class="text-muted">Utility:</span>
                    <span class="text-text">{formatStat(teammate.utility)}</span>
                  </div>
                {/if}
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}
