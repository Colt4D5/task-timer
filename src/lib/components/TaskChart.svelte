<script>
  import { tasks } from '$stores/TaskList.svelte';
  import { formatTime } from '$utils';

  let chart = $state(null);

  $effect(() => {
    tasks.chartElement = chart;
  })
</script>

<div class="max-w-64">
  <canvas id="task-chart" bind:this={chart}></canvas>
</div>

<!-- {#each tasks.uniqueTasks as project}
  <p>{project.name}</p>
{/each}

<p>Total tracked time: {formatTime(tasks.totalTrackedTime)}</p> -->