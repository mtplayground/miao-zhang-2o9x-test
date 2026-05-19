const { expect, test } = require("@playwright/test");

test("todo smoke flow", async ({ page }) => {
  const rowFor = (text) => page.locator(".task-row", { hasText: text });

  await page.goto("/");
  await page.evaluate(() => localStorage.clear());
  await page.reload();

  await expect(page.getByText("No tasks yet.")).toBeVisible();

  await page.getByLabel("New todo").fill("  First task  ");
  await page.getByRole("button", { name: "Add" }).click();

  await expect(rowFor("First task")).toBeVisible();
  await expect(page.getByLabel("New todo")).toHaveValue("");

  await rowFor("First task").getByRole("checkbox", { name: "Toggle First task" }).click();
  await expect(rowFor("First task")).toHaveClass(/is-completed/);
  await expect(page.getByText("0 items left")).toBeVisible();

  await page.reload();
  await expect(rowFor("First task")).toHaveClass(/is-completed/);
  await expect(rowFor("First task").getByRole("checkbox", { name: "Toggle First task" })).toBeChecked();

  await rowFor("First task").getByRole("button", { name: "Delete First task" }).click();
  await expect(rowFor("First task")).toHaveCount(0);

  await page.reload();
  await expect(rowFor("First task")).toHaveCount(0);
  await expect(page.getByText("No tasks yet.")).toBeVisible();

  await page.getByLabel("New todo").fill("Keep me");
  await page.getByRole("button", { name: "Add" }).click();
  await page.getByLabel("New todo").fill("Clear me");
  await page.getByRole("button", { name: "Add" }).click();

  await rowFor("Clear me").getByRole("checkbox", { name: "Toggle Clear me" }).click();
  await page.getByRole("button", { name: "Clear completed" }).click();

  await expect(rowFor("Keep me")).toBeVisible();
  await expect(rowFor("Clear me")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Clear completed" })).toBeHidden();
});
