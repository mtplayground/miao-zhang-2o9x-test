# miao-zhang-2o9x-test
A simple test project

## Manual QA Checklist

Run the app with a static server, then verify:

- Submitting an empty or whitespace-only task is rejected, leaves the list unchanged, clears the input, and returns focus to the input.
- Submitting text with leading or trailing spaces adds one task with the displayed text trimmed.
- Toggling a task updates its completed state, then the same state is still shown after a page reload.
- Deleting a task removes it from the list, then it remains removed after a page reload.
- The Clear completed button is hidden when there are no completed tasks.
- The Clear completed button appears when at least one task is completed and removes only completed tasks.
- The All, Active, and Completed filters each reflect the current task state and update the visible list and active filter styling.
- Corrupting `localStorage["simple-todo:v1"]` with invalid JSON falls back to an empty list on reload instead of breaking the app.
