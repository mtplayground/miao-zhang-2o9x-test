import { saveTasks } from "./storage.js";

let renderTasks = () => {};

function normalizeTasks(tasks) {
  return Array.isArray(tasks) ? tasks : [];
}

function commitTasks(tasks) {
  saveTasks(tasks);
  renderTasks(tasks);

  return tasks;
}

export function setRender(render) {
  renderTasks = typeof render === "function" ? render : () => {};
}

export function generateTaskId() {
  try {
    if (typeof globalThis.crypto?.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }
  } catch {
    // Fall through to a local ID when crypto access is unavailable.
  }

  return `task-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createTask(text) {
  return {
    id: generateTaskId(),
    text: String(text ?? "").trim(),
    completed: false,
  };
}

export function addTask(tasks, text) {
  const normalizedText = String(text ?? "").trim();
  const currentTasks = normalizeTasks(tasks);

  if (!normalizedText) {
    return currentTasks;
  }

  return commitTasks([...currentTasks, createTask(normalizedText)]);
}

export function toggleTask(tasks, id) {
  const nextTasks = normalizeTasks(tasks).map((task) => {
    if (task.id !== id) {
      return task;
    }

    return {
      ...task,
      completed: !task.completed,
    };
  });

  return commitTasks(nextTasks);
}

export function deleteTask(tasks, id) {
  const nextTasks = normalizeTasks(tasks).filter((task) => task.id !== id);

  return commitTasks(nextTasks);
}

export function clearCompleted(tasks) {
  const nextTasks = normalizeTasks(tasks).filter((task) => !task.completed);

  return commitTasks(nextTasks);
}
