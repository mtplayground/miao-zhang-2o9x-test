# Product Contract

## What This Is

`miao-zhang-2o9x-test` is a dependency-light, browser-only todo app shipped as a static `index.html` with ES modules under `src/`.

## Current Behavior

- Users can add todo tasks through the form.
- Empty or whitespace-only submissions are ignored; valid submissions are trimmed.
- Tasks can be toggled completed, deleted individually, and cleared in bulk when completed.
- The list supports All, Active, and Completed filters.
- The counter shows active items remaining.
- Task state persists across reloads in `localStorage` under `simple-todo:v1`.
- Missing, unavailable, blocked, corrupt, or non-array storage data falls back to an empty list.

## Architecture

- `index.html` contains the static semantic markup and inline styles for the app shell, list, filters, and task rows.
- `src/main.js` bootstraps on DOM readiness, loads stored tasks, wires events, and renders the initial All view.
- `src/storage.js` owns safe `loadTasks()` and `saveTasks(tasks)` persistence.
- `src/state.js` owns task creation, ID generation, and immutable task mutations; mutations persist and call the registered render callback.
- `src/render.js` rebuilds the task list from current task/filter state and updates counters, filter button state, empty states, and Clear completed visibility.
- `src/events.js` wires form submission, delegated list clicks, filter buttons, and Clear completed.

## Conventions

- No frontend framework or build step is required for the product.
- Task IDs prefer `crypto.randomUUID()` and fall back to a timestamp/random local ID.
- User text is written with DOM APIs and `textContent`, not HTML string interpolation.
- The shipped product remains static files; Node tooling is only for tests.

## Quality Checks

- Manual QA steps live in `README.md`.
- Playwright smoke coverage lives in `tests/e2e/todo.spec.js`.
- Run e2e checks with `npm run test:e2e`; the Playwright config serves the app on `0.0.0.0:8080`.
