<script>
  import { tasks } from '$stores/TaskList.svelte';

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
    name = '';
    description = '';
  }
</script>

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