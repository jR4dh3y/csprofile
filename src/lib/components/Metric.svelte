<script lang="ts">
  import type { ProfileMetric } from '$lib/types';

  export let metric: ProfileMetric;

  function getAccentColor(label: string): string {
    const lower = label.toLowerCase();
    if (lower.includes('premier') || lower.includes('rank')) return 'text-primary';
    if (lower.includes('rating') || lower.includes('hltv')) return 'text-highlight';
    if (lower.includes('aim') || lower.includes('k/d')) return 'text-error';
    if (lower.includes('positioning')) return 'text-secondary';
    if (lower.includes('utility')) return 'text-primary';
    if (lower.includes('win')) return 'text-warning';
    return 'text-text';
  }
</script>

<div class="text-center p-4 rounded-lg transition-colors bg-surface border border-border">
  <p class="text-2xl font-mono font-medium {getAccentColor(metric.label)}">{metric.value}</p>
  <p class="text-xs uppercase tracking-wider mt-1.5 text-muted">{metric.label}</p>
  {#if metric.subtext}
    <p class="text-xs mt-1 text-muted">{metric.subtext}</p>
  {/if}
</div>
