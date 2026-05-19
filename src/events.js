import {
  addTask,
  clearCompleted,
  deleteTask,
  setRender,
  toggleTask,
} from "./state.js";
import { getTasks, render, setActiveFilter } from "./render.js";

function getElements() {
  if (typeof document === "undefined") {
    return null;
  }

  const form = document.getElementById("todo-form");
  const input = document.getElementById("todo-input");
  const list = document.getElementById("todo-list");
  const filters = document.querySelector(".filters");
  const clearButton = document.getElementById("clear-completed");

  if (!form || !input || !list || !filters || !clearButton) {
    return null;
  }

  return {
    form,
    input,
    list,
    filters,
    clearButton,
  };
}

function closestElement(target, selector) {
  return typeof target?.closest === "function" ? target.closest(selector) : null;
}

function getTaskIdFromTarget(target, list) {
  const row = closestElement(target, ".task-row");

  if (!row || !list.contains(row)) {
    return null;
  }

  return row.dataset.id || null;
}

function shouldToggleTask(target, row) {
  if (closestElement(target, ".task-checkbox, [data-action='toggle']")) {
    return true;
  }

  return target === row;
}

export function wireEvents() {
  const elements = getElements();

  if (!elements) {
    return () => {};
  }

  setRender(render);

  const handleSubmit = (event) => {
    event.preventDefault();

    const text = elements.input.value.trim();

    if (!text) {
      elements.input.value = "";
      elements.input.focus();
      return;
    }

    addTask(getTasks(), text);
    elements.input.value = "";
    elements.input.focus();
  };

  const handleListClick = (event) => {
    const target = event.target;
    const row = closestElement(target, ".task-row");

    if (!row || !elements.list.contains(row)) {
      return;
    }

    const taskId = getTaskIdFromTarget(target, elements.list);

    if (!taskId) {
      return;
    }

    if (closestElement(target, ".delete, [data-action='delete']")) {
      deleteTask(getTasks(), taskId);
      return;
    }

    if (!shouldToggleTask(target, row)) {
      return;
    }

    event.preventDefault();
    toggleTask(getTasks(), taskId);
  };

  const handleFilterClick = (event) => {
    const button = closestElement(event.target, ".filter-button");

    if (!button || !elements.filters.contains(button)) {
      return;
    }

    setActiveFilter(button.dataset.filter);
  };

  const handleClearCompleted = () => {
    clearCompleted(getTasks());
  };

  elements.form.addEventListener("submit", handleSubmit);
  elements.list.addEventListener("click", handleListClick);
  elements.filters.addEventListener("click", handleFilterClick);
  elements.clearButton.addEventListener("click", handleClearCompleted);

  return () => {
    elements.form.removeEventListener("submit", handleSubmit);
    elements.list.removeEventListener("click", handleListClick);
    elements.filters.removeEventListener("click", handleFilterClick);
    elements.clearButton.removeEventListener("click", handleClearCompleted);
  };
}
