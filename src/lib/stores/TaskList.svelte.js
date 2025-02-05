import { browser } from '$app/environment';

class TaskList {
  #tasks = $state([]);
  #activeTask = $state(null);
  #startTime = $state(null);
  #isRunning = $state(false);
  #intervalId = $state(null);
  #documentTitle = $state('Time Tracker™');
  constructor() {
    if (browser) {
      this.initializeTasksFromLocalStorage();
    }
  }
  set tasks(task) {
    this.#tasks.push(task);
    this.updateLocalStorage();
  }
  get tasks() {
    return this.#tasks;
  }
  get activeTask() {
    return this.#activeTask;
  }
  get sortedTasks() {
    const tasks = this.#tasks.map(task => task);
    return tasks.sort((a, b) => b.timestamp - a.timestamp);
  }
  set remove(taskId) {
    const index = this.tasks.map(task => task.id).indexOf(taskId);
    this.#tasks.splice(index, 1);
    this.updateLocalStorage();
  }
  startTimer(task) {
    this.stopTimer();
    this.#activeTask = task;
    this.#isRunning = true;
    this.#startTime = task.elapsedTime;
    let elapsedTime = this.#startTime;
    this.#intervalId = setInterval(() => {
      elapsedTime += 1000;
      this.#activeTask.elapsedTime = elapsedTime;
      this.updateDocumentTitle(`${new Date(elapsedTime).toISOString().slice(11, 19)} - ${this.#activeTask.name}`);
    }, 1000);
  }
  stopTimer() {
    clearInterval(this.#intervalId);
    this.updateLocalStorage();
    this.#activeTask = null;
    this.#startTime = null;
    this.#isRunning = false;
    this.#intervalId = null;
    this.updateDocumentTitle('Time Tracker™');
  }
  updateLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.#tasks));
  }
  initializeTasksFromLocalStorage() {
    if (localStorage) {
      const tasks = localStorage.getItem('tasks') || [];
      this.#tasks = JSON.parse(tasks);
    }
  }
  updateDocumentTitle(title) {
    this.#documentTitle = title;
    document.title = this.#documentTitle;
  }
}

export const tasks = new TaskList();