// import { tasks } from '$stores/TaskList.svelte';

// export const actions = {
//   add: async ({ request }) => {
// 		const data = await request.formData();
// 		const name = data.get('name');
// 		const description = data.get('description');

//     const newTask = {
//       id: crypto.randomUUID(),
//       name,
//       description,
//       elapsedTime: 0,
//       timeStamp: new Date()
//     }
    
//     tasks.tasks = [...tasks.tasks, newTask];
//     console.log(newTask);
//     return { success: true };
//   }
// };