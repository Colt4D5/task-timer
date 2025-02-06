<script>
	import { tasks } from "$stores/TaskList.svelte";
	import { formatTime } from "$utils";
  let { task, isOpen = $bindable() } = $props();

  const taskData = $state({
    id: task.id,
    name: task.name,
    description: task.description,
    elapsedTime: +task.elapsedTime,
    timestamp: +task.timestamp
  });
  
  function onsubmit(e) {
    e.preventDefault();
    tasks.edit({...taskData, elapsedTime: +taskData.elapsedTime});
    isOpen = false;
  }
</script>

<div class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-[var(--pico-background-color)] rounded-lg p-8">
  <h2>Edit task</h2>
  <form {onsubmit}>
    <fieldset>
      <input type="hidden" name="id" bind:value={taskData.id}>
      <input type="hidden" name="timestamp" bind:value={taskData.timestamp}>
      <label>
        Task Name:
        <input
          name="name"
          placeholder="Task name"
          autocomplete="task-name"
          bind:value={taskData.name}
        />
      </label>
      <label>
        Task Description:
        <input
          name="description"
          placeholder="Task description"
          autocomplete="task-description"
          bind:value={taskData.description}
        />
      </label>
      <label class="mb-0">
        Elapsed time:
        <input
          name="elapsedTime"
          placeholder="Elapsed time"
          autocomplete="elapsed-time"
          bind:value={taskData.elapsedTime}
          class="!mb-0"
        />
      </label>
      <p class="text-sm italic">Equivalent to: {formatTime(taskData.elapsedTime)}</p>
    </fieldset>
  
    <input
      type="submit"
      value="Save"
    />
  </form>

</div>