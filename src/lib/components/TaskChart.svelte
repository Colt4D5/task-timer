<script>
  import { tasks } from '$stores/TaskList.svelte';
  import { formatTime } from '$utils';

  let chart = $state(null);

  $effect(() => {
    tasks.chartElement = chart;
  })
</script>

<div class="max-w-64 text-center">
  <canvas id="task-chart" bind:this={chart}></canvas>
  <p class="mb-0">Total tracked time: {formatTime(tasks.totalTrackedTime)}</p>
</div>