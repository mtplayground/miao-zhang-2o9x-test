import { wireEvents } from "./events.js";
import { render, setTasks } from "./render.js";
import { loadTasks } from "./storage.js";

function bootstrap() {
  const tasks = loadTasks();

  setTasks(tasks);
  wireEvents();
  render(tasks, "all");
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootstrap, { once: true });
} else {
  bootstrap();
}
