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
      }, 200);
    }
  }
  set chartElement(element) {
    this.#chartElement = element;
  }
  set tasks(task) {
    this.#tasks.push(task);
    this.updateLocalStorage();
    this.updateChart();
    // this.initializeChart();
  }
  // create a setter method that will update a single task in this.#tasks by the parameter taskId 
  set updateTask(task) {
    const index = this.#tasks.map(task => task.id).indexOf(task.id);
    this.#tasks[index] = task;
    this.updateLocalStorage();
    this.updateChart();
    // this.initializeChart();
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
    this.updateChart();
    // this.initializeChart();
  }
  edit(task) {
    const index = this.#tasks.map(task => task.id).indexOf(task.id);
    this.#tasks[index] = task;
    this.updateLocalStorage();
    this.updateChart();
    // this.initializeChart();
  }
  getTaskById(taskId) {
    return this.#tasks.find(task => task.id === taskId);
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
      this.updateChart();
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
    this.updateChart();
    // this.initializeChart();
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
    const formattedData = Object.values(this.taskTime).map(timestamp => formatTime(timestamp));
    const data = {
      labels: Object.keys(this.taskTime),
      datasets: [{
        // label: 'Time',
        data: Object.values(this.taskTime),
        // data: formattedData,
        hoverOffset: 4
      }],
    };
    this.chart?.destroy();
    if (this.#chartElement) {
      this.chart = new Chart(
        this.#chartElement,
        {
          type: 'doughnut',
          data: data
        }
      );
    }
    this.updateChart();
  }
  updateChart() {
    const newLabels = Object.keys(this.taskTime);
    const newData = Object.values(this.taskTime);
    if (this.chart) {
      this.chart.data.labels = newLabels;
      this.chart.data.datasets.forEach((dataset) => {
        dataset.data = newData;
      });
      this.chart.update();
    }
    // this.initializeChart();
  }
}

export const tasks = new TaskList();