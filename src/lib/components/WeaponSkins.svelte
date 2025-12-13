<script lang="ts">
  import type { CS2WeaponSkin } from '$lib/types';
  import { WEAPON_CATEGORIES, WEAPON_CATEGORY_ORDER, UI_TEXT } from '$lib/config';

  export let weapons: CS2WeaponSkin[];

  let expanded = false;

  // Get category for a weapon
  function getCategory(weaponName: string): string {
    const lower = weaponName.toLowerCase();
    for (const cat of WEAPON_CATEGORIES) {
      if (cat.patterns.some((p) => lower.includes(p))) {
        return cat.name;
      }
    }
    return 'Other';
  }

  // Group weapons by category
  $: categorizedWeapons = weapons.reduce(
    (acc, skin) => {
      const cat = getCategory(skin.weapon);
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(skin);
      return acc;
    },
    {} as Record<string, CS2WeaponSkin[]>
  );

  // Order categories
  $: sortedCategories = WEAPON_CATEGORY_ORDER
    .filter((cat) => categorizedWeapons[cat]?.length > 0)
    .map((cat) => ({ name: cat, skins: categorizedWeapons[cat] }));
</script>

{#if weapons.length > 0}
  <div class="space-y-4">
    <button
      type="button"
      class="text-xs uppercase tracking-wide flex items-center gap-2 text-muted hover:text-text transition-colors"
      on:click={() => (expanded = !expanded)}
    >
      <span class="text-primary">{expanded ? '−' : '+'}</span>
      <span>{UI_TEXT.myLoadout} ({weapons.length})</span>
    </button>

    {#if expanded}
      <div class="space-y-6">
        {#each sortedCategories as { name, skins }}
          <div>
            <p class="text-sm font-medium text-text mb-3">{name}</p>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {#each skins as skin}
                <div
                  class="group relative bg-surface border border-border rounded-lg p-3 hover:border-primary transition-colors"
                >
                  <img src={skin.iconUrl} alt={skin.name} class="w-full aspect-video object-contain mb-2" />
                  <p class="text-xs text-text truncate" title={skin.name}>
                    {skin.name}
                  </p>
                  {#if skin.stickers?.length || skin.charm}
                    <div class="absolute inset-0 bg-background/95 rounded-lg p-2 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none overflow-hidden">
                      <p class="text-[9px] text-muted uppercase tracking-wide mb-1 text-center">Applied</p>
                      <div class="flex flex-col gap-0.5 overflow-hidden">
                        {#if skin.stickers}
                          {#each skin.stickers as sticker}
                            <span class="text-[10px] text-primary truncate px-1">{sticker.name}</span>
                          {/each}
                        {/if}
                        {#if skin.charm}
                          <span class="text-[10px] text-highlight truncate px-1">🔮 {skin.charm}</span>
                        {/if}
                      </div>
                    </div>
                  {/if}
                  {#if skin.isStatTrak}
                    <span
                      class="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 bg-warning/20 text-warning rounded"
                    >
                      ST
                    </span>
                  {/if}
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
{/if}
