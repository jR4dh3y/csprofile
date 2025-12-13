<script lang="ts">
  import type { ProfileMetric } from '$lib/types';
  import { METRIC_COLOR_MAP, METRIC_DEFAULT_COLOR } from '$lib/config';

  export let metric: ProfileMetric;

  function getAccentColor(label: string): string {
    const lower = label.toLowerCase();
    for (const { keywords, colorClass } of METRIC_COLOR_MAP) {
      if (keywords.some(kw => lower.includes(kw))) return colorClass;
    }
    return METRIC_DEFAULT_COLOR;
  }
</script>

<div class="text-center p-4 rounded-lg transition-colors bg-surface border border-border">
  <p class="text-2xl font-mono font-medium {getAccentColor(metric.label)}">{metric.value}</p>
  <p class="text-xs uppercase tracking-wider mt-1.5 text-muted">{metric.label}</p>
  {#if metric.subtext}
    <p class="text-xs mt-1 text-muted">{metric.subtext}</p>
  {/if}
</div>
