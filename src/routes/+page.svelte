<script>
  import { tasks } from '$stores/TaskList.svelte';
  import { enhance } from '$app/forms';
	import TaskChart from '$components/TaskChart.svelte';
	import AddTaskForm from '$components/AddTaskForm.svelte';
	import TaskTable from '$components/TaskTable.svelte';
</script>

<svelte:head>
	<title>{tasks.documentTitle}</title>
</svelte:head>

<h1>Time Tracker™</h1>

<div id="form-graph-container" class="flex items-end gap-4 mb-8">
  <AddTaskForm />

  <TaskChart />
</div>

<TaskTable />