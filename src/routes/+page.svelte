<script>
  import { tasks } from '$stores/TaskList.svelte';
  import { enhance } from '$app/forms';
  import { formatTime } from '$utils';
	import TaskChart from '$components/TaskChart.svelte';

  let name = $state('');
  let description = $state('');

  function onsubmit(e) {
    e.preventDefault();
    const newTask = {
      id: crypto.randomUUID(),
      name,
      description,
      elapsedTime: 0,
      timestamp: new Date(),
    }
    tasks.tasks = newTask;
    clearInputFields();
  }

  function removeTask(taskId) {
    tasks.remove = taskId;
  }

  function clearInputFields() {
    name = '';
    description = '';
  }
</script>

<svelte:head>
	<title>{tasks.documentTitle}</title>
</svelte:head>

<h1>Time Tracker™</h1>

<div id="form-graph-container" class="flex items-end">
  <form {onsubmit} class="w-full">
    <fieldset class="mb-0">
      <input
        name="name"
        placeholder="Task name"
        bind:value={name}
      />
      <input
        name="description"
        placeholder="Task Description (optional)"
        bind:value={description}
      />
      
      <input
        type="submit"
        value="Add Task"
        class="!mb-0"
      />
    </fieldset>
  </form>

  <TaskChart />
</div>

<table class="w-full">
  <thead>
    <tr>
      <th class="w-2/12" scope="col">Name</th>
      <th class="w-5/12" scope="col">Description</th>
      <th class="w-2/12 text-right" scope="col">Time elapsed</th>
      <th class="w-3/12" scope="col"></th>
    </tr>
  </thead>
  <tbody>
    {#each tasks.sortedTasks as task}
      <tr data-id={`task-${task.id}`}>
        <th scope="row">{task.name}</th>
        <td>{task.description}</td>
        <td class="text-right">{formatTime(task.elapsedTime)}</td>
        <td class="text-center">
          {#if tasks?.activeTask?.id === task?.id}
            <button class="bg-[#28a745]" onclick={() => tasks.stopTimer()}>Stop</button>
          {:else}
            <button onclick={() => tasks.startTimer(task)}>Start</button>
          {/if}
          <button onclick={() => removeTask(task.id)}>delete</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#if tasks.sortedTasks.length === 0}
  You currently have no tasks to display...
{/if}