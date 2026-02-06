<script lang="ts">
  import { UI_TEXT } from '$lib/config';

  export let clutch1v1: number | null;
  export let clutch1v2: number | null;
  export let clutch1v3: number | null;

  $: clutches = [
    { label: '1v1', value: clutch1v1 },
    { label: '1v2', value: clutch1v2 },
    { label: '1v3', value: clutch1v3 }
  ].filter((c) => c.value !== null);
</script>

{#if clutches.length > 0}
  <div class="p-3 sm:p-5 rounded-lg col-span-2 sm:col-span-3 bg-surface border border-border">
    <p class="text-xs uppercase tracking-wider mb-3 sm:mb-4 text-muted">{UI_TEXT.clutchSuccess}</p>
    <div class="flex items-center justify-around gap-4 sm:gap-6">
      {#each clutches as clutch (clutch.label)}
        <div class="text-center">
          <p class="text-xl sm:text-2xl font-mono font-medium text-warning">{clutch.value}%</p>
          <p class="text-xs text-muted mt-1">{clutch.label}</p>
        </div>
      {/each}
    </div>
  </div>
{/if}
