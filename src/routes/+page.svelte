<script lang="ts">
  import type { PageData } from './$types';
  import { Identity, ClutchStats, HighlightsCarousel, Teammates, MusicKits, WeaponSkins } from '$lib/components';
  import { PAGE_TITLE, PAGE_DESCRIPTION, PLAYER_ROLES, FOOTER_LINK, UI_TEXT } from '$lib/config';

  export let data: PageData;
</script>

<svelte:head>
  <title>{PAGE_TITLE}</title>
  <meta name="description" content={PAGE_DESCRIPTION} />
</svelte:head>

<main class="min-h-screen bg-background flex flex-col">
  <div class="max-w-3xl mx-auto px-4 sm:px-6 pt-8 sm:pt-10 pb-4 flex-1 w-full">
    {#if !data.profile}
      <p class="text-sm text-muted">{UI_TEXT.profileUnavailable}</p>
    {:else}
      <div class="space-y-4">
        <!-- Identity -->
        <Identity identity={data.profile.identity} />

        <!-- Roles -->
        <div class="flex flex-wrap gap-2">
          {#each PLAYER_ROLES as role}
            <span class="px-3 py-1 text-xs rounded-full bg-surface border border-border text-muted">
              {role}
            </span>
          {/each}
        </div>

        <!-- Metrics Grid -->
        {#if data.profile.metrics.length > 0}
          <div class="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
            {#each data.profile.metrics as metric (metric.label)}
              <div class="text-center p-3 sm:p-4 rounded-lg bg-surface border border-border">
                <p
                  class="text-xl sm:text-2xl font-mono font-medium
                         {metric.label.includes('HLTV') || metric.label.includes('K/D')
                    ? 'text-highlight'
                    : metric.label.includes('HS') || metric.label.includes('Reaction')
                      ? 'text-error'
                      : metric.label.includes('Win')
                        ? 'text-warning'
                        : metric.label.includes('Leetify')
                          ? 'text-primary'
                          : 'text-text'}"
                >
                  {metric.value}
                </p>
                <p class="text-xs uppercase tracking-wider mt-1.5 text-muted">{metric.label}</p>
                {#if metric.subtext}
                  <p class="text-xs mt-1 text-muted">{metric.subtext}</p>
                {/if}
              </div>
            {/each}

            <!-- Clutch Stats -->
            {#if data.profile.clutchStats}
              <ClutchStats
                clutch1v1={data.profile.clutchStats.clutch1v1}
                clutch1v2={data.profile.clutchStats.clutch1v2}
                clutch1v3={data.profile.clutchStats.clutch1v3}
              />
            {/if}
          </div>
        {/if}

        <!-- Teammates -->
        {#if data.profile.teammates.length > 0}
          <Teammates teammates={data.profile.teammates} />
        {/if}

        <!-- Highlights -->
        {#if data.profile.highlights.length > 0}
          <HighlightsCarousel clips={data.profile.highlights} steamId={data.steamId} />
        {/if}

        <!-- Music Kits -->
        {#if data.profile.musicKits.length > 0}
          <MusicKits musicKits={data.profile.musicKits} />
        {/if}

        <!-- Weapon Skins -->
        {#if data.profile.weaponSkins.length > 0}
          <WeaponSkins weapons={data.profile.weaponSkins} />
        {/if}
      </div>
    {/if}
  </div>

  <!-- footer -->
  {#if data.profile}
    <footer class="max-w-3xl mx-auto px-4 sm:px-6 pb-4 w-full">
      <div class="flex flex-wrap justify-between items-center gap-2 text-xs font-mono pt-2 border-t text-muted border-border">
        <span>{UI_TEXT.updated} {new Date(data.profile.lastUpdated).toLocaleDateString()}</span>
        <a href={FOOTER_LINK.url} target="_blank" rel="noopener noreferrer" class="hover:text-primary transition-colors">{FOOTER_LINK.text}</a>
      </div>
    </footer>
  {/if}
</main>
