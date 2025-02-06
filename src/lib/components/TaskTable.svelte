<script>
  import { tasks } from '$stores/TaskList.svelte';
  import { formatTime } from '$utils';
	import EditTaskDialog from './EditTaskDialog.svelte';
  import PlayIcon from '$assets/svg/play.svg?raw';
  import PauseIcon from '$assets/svg/pause.svg?raw';
  import DeleteIcon from '$assets/svg/delete.svg?raw';
  import EditIcon from '$assets/svg/edit.svg?raw';

  let taskData = $state({
    id: null,
    name: null,
    description: null,
    elapsedTime: null,
    timestamp: null
  });
  let editTaskIsOpen = $state(false);

  function removeTask(taskId) {
    tasks.remove = taskId;
  }

  function editTask(task) {
    taskData = task;
    editTaskIsOpen = true;
  }
</script>


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
            <button class="bg-[#28a745]" onclick={() => tasks.stopTimer()}>{@html PauseIcon}</button>
          {:else}
            <button onclick={() => tasks.startTimer(task)}>{@html PlayIcon}</button>
          {/if}
          <button onclick={() => removeTask(task.id)}>{@html DeleteIcon}</button>
          <button onclick={() => editTask(task)}>{@html EditIcon}</button>
        </td>
      </tr>
    {/each}
  </tbody>
</table>

{#if tasks.sortedTasks.length === 0}
  You currently have no tasks to display...
{/if}

{#if editTaskIsOpen}
  <EditTaskDialog task={taskData} bind:isOpen={editTaskIsOpen} />
  <div class="fixed top-0 left-0 w-full h-full bg-black/60 z-10" onclick={() => editTaskIsOpen = false} aria-hidden={editTaskIsOpen}></div>
{/if}
