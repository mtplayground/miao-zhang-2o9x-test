const FILTERS = new Set(["all", "active", "completed"]);

let currentTasks = [];
let activeFilter = "all";

function normalizeTasks(tasks) {
  return Array.isArray(tasks) ? tasks : [];
}

function normalizeFilter(filter) {
  return FILTERS.has(filter) ? filter : "all";
}

function getTaskText(task) {
  return String(task.text ?? task.title ?? "").trim();
}

function getElements() {
  if (typeof document === "undefined") {
    return null;
  }

  const list = document.getElementById("todo-list");
  const counter = document.getElementById("todo-count");
  const clearButton = document.getElementById("clear-completed");

  if (!list || !counter || !clearButton) {
    return null;
  }

  return {
    list,
    counter,
    clearButton,
    filterButtons: [...document.querySelectorAll(".filter-button")],
  };
}

function getVisibleTasks(tasks, filter) {
  if (filter === "active") {
    return tasks.filter((task) => !task.completed);
  }

  if (filter === "completed") {
    return tasks.filter((task) => task.completed);
  }

  return tasks;
}

function getEmptyMessage(tasks, filter) {
  if (tasks.length === 0) {
    return "No tasks yet.";
  }

  if (filter === "active") {
    return "No active tasks.";
  }

  if (filter === "completed") {
    return "No completed tasks.";
  }

  return "No tasks to show.";
}

function formatCounter(activeCount) {
  return `${activeCount} ${activeCount === 1 ? "item" : "items"} left`;
}

function createEmptyState(message) {
  const item = document.createElement("li");
  item.className = "empty-state";
  item.textContent = message;

  return item;
}

function createTaskRow(task) {
  const item = document.createElement("li");
  const taskId = String(task.id ?? "");
  const taskText = getTaskText(task);

  item.className = task.completed ? "task-row is-completed" : "task-row";
  item.dataset.id = taskId;

  const label = document.createElement("label");
  label.className = "task-label";

  const checkbox = document.createElement("input");
  checkbox.className = "task-checkbox";
  checkbox.type = "checkbox";
  checkbox.checked = Boolean(task.completed);
  checkbox.dataset.action = "toggle";
  checkbox.setAttribute("aria-label", `Toggle ${taskText || "task"}`);

  const text = document.createElement("span");
  text.className = "task-text";
  text.textContent = taskText;

  const deleteButton = document.createElement("button");
  deleteButton.className = "task-delete";
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", `Delete ${taskText || "task"}`);

  label.append(checkbox, text);
  item.append(label, deleteButton);

  return item;
}

export function setTasks(tasks) {
  currentTasks = normalizeTasks(tasks);

  return currentTasks;
}

export function getTasks() {
  return currentTasks;
}

export function setActiveFilter(filter) {
  activeFilter = normalizeFilter(filter);
  render();
}

export function getActiveFilter() {
  return activeFilter;
}

export function render(tasks = currentTasks, filter = activeFilter) {
  currentTasks = normalizeTasks(tasks);
  activeFilter = normalizeFilter(filter);

  const elements = getElements();

  if (!elements) {
    return;
  }

  const visibleTasks = getVisibleTasks(currentTasks, activeFilter);
  const activeCount = currentTasks.filter((task) => !task.completed).length;
  const hasCompletedTasks = currentTasks.some((task) => task.completed);
  const rows = visibleTasks.length > 0
    ? visibleTasks.map(createTaskRow)
    : [createEmptyState(getEmptyMessage(currentTasks, activeFilter))];

  elements.list.replaceChildren(...rows);
  elements.counter.textContent = formatCounter(activeCount);
  elements.clearButton.hidden = !hasCompletedTasks;

  for (const button of elements.filterButtons) {
    button.setAttribute("aria-pressed", String(button.dataset.filter === activeFilter));
  }
}
