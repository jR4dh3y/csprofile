<script lang="ts">
  import type { ProfileMetric } from '$lib/types';
  import Metric from './Metric.svelte';

  export let metrics: ProfileMetric[];
</script>

<div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
  {#each metrics as metric (metric.label)}
    <Metric {metric} />
  {/each}
</div>
