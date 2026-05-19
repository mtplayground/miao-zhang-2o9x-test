export const STORAGE_KEY = "simple-todo:v1";

function getStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

export function loadTasks() {
  const storage = getStorage();

  if (!storage) {
    return [];
  }

  try {
    const savedTasks = storage.getItem(STORAGE_KEY);

    if (savedTasks === null) {
      return [];
    }

    const tasks = JSON.parse(savedTasks);

    return Array.isArray(tasks) ? tasks : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Saving should never block the in-memory app state from continuing.
  }
}
