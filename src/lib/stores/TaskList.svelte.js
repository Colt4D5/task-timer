import { browser } from '$app/environment';
import { formatTime } from '$utils';
import Chart from 'chart.js/auto';

class TaskList {
  #tasks = $state([]);
  #activeTask = $state(null);
  #startTime = $state(null);
  #isRunning = $state(false);
  #intervalId = $state(null);
  documentTitle = $state('Time Tracker™');
  #chartElement = $state(null);
  chart = $state(null);
  constructor() {
    if (browser) {
      this.updateDocumentTitle('Time Tracker™');
      this.initializeTasksFromLocalStorage();
      window.addEventListener('beforeunload', () => {
        this.stopTimer();
      });
      setTimeout(() => {
        if (this.#chartElement) {
          this.initializeChart();
        }
      }, 1000);
    }
  }
  set chartElement(element) {
    this.#chartElement = element;
  }
  set tasks(task) {
    this.#tasks.push(task);
    this.updateLocalStorage();
    this.initializeChart();
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
  get uniqueTasks() {
    // get unique tasks by name
    const uniqueTasks = [];
    this.#tasks.forEach(task => {
      if (!uniqueTasks.find(uniqueTask => uniqueTask.name === task.name)) {
        uniqueTasks.push(task);
      }
    });
    return uniqueTasks;
  }
  get totalTrackedTime() {
    return this.#tasks.reduce((total, task) => total + task.elapsedTime, 0);
  }
  set remove(taskId) {
    const index = this.tasks.map(task => task.id).indexOf(taskId);
    this.#tasks.splice(index, 1);
    this.updateLocalStorage();
    this.initializeChart();
  }
  startTimer(task) {
    if (this.#isRunning) {
      this.stopTimer();
    }
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
    this.initializeChart();
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
    this.documentTitle = title;
  }
  get taskTime() {
    const taskTime = this.#tasks.reduce((acc, task) => {
      if (acc[task.name]) {
        acc[task.name] += task.elapsedTime;
      } else {
        acc[task.name] = task.elapsedTime;
      }
      return acc;
    }, {});
    return taskTime;
  }
  initializeChart() {
    const data = {
      labels: Object.keys(this.taskTime),
      datasets: [{
        label: 'Tasks',
        data: Object.values(this.taskTime),
        hoverOffset: 4
      }],
      // options: {
      //   plugins: {
      //     datalabels: {
      //       formatter: function(value, context) {
      //         console.log(value, context);
      //         return context.chart.data.labels[context.dataIndex];
      //       }
      //     }
      //   }
      // }
    };
    this.chart?.destroy();
    if (this.#chartElement) {
      this.chart = new Chart(
        this.#chartElement,
        {
          type: 'pie',
          data: data
        }
      );
    }
  }
  updateChart() {
    this.initializeChart();
  }
}

export const tasks = new TaskList();