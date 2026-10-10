import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.getByTestId("board")).toBeVisible({ timeout: 15000 });
});

test("loads with dummy data", async ({ page }) => {
  await expect(page.getByRole("heading", { name: "Project Board" })).toBeVisible();
  await expect(page.getByText("Research competitors")).toBeVisible();
  await expect(page.getByText("Project scaffolding")).toBeVisible();
  await expect(page.getByTestId("column-col-1")).toBeVisible();
  await expect(page.getByTestId("column-col-5")).toBeVisible();
});

test("renames a column", async ({ page }) => {
  await page.getByTestId("column-title-col-1").click();
  const input = page.getByTestId("column-title-input-col-1");
  await input.fill("Ideas");
  await input.press("Enter");

  await expect(page.getByTestId("column-title-col-1")).toHaveText("Ideas");
});

test("adds a new card", async ({ page }) => {
  await page.getByTestId("add-card-button-col-2").click();
  await page.getByTestId("add-card-title-col-2").fill("E2E test card");
  await page.getByTestId("add-card-details-col-2").fill("Created by Playwright");
  await page.getByTestId("add-card-submit-col-2").click();

  await expect(page.getByText("E2E test card")).toBeVisible();
  await expect(page.getByText("Created by Playwright")).toBeVisible();
});

test("deletes a card", async ({ page }) => {
  const card = page.getByTestId("card-card-1");
  await expect(card).toBeVisible();
  await card.hover();
  await page.getByTestId("delete-card-card-1").click();
  await expect(page.getByTestId("card-card-1")).not.toBeVisible();
});

test("drags a card to another column", async ({ page }) => {
  const card = page.getByTestId("card-card-2");
  const targetColumn = page.getByTestId("column-col-3");

  await expect(card).toBeVisible();
  await expect(targetColumn).toBeVisible();

  const cardBox = await card.boundingBox();
  const targetBox = await targetColumn.boundingBox();
  if (!cardBox || !targetBox) throw new Error("Missing bounding boxes");

  const startX = cardBox.x + cardBox.width / 2;
  const startY = cardBox.y + cardBox.height / 2;
  const endX = targetBox.x + targetBox.width / 2;
  const endY = targetBox.y + 120;

  await page.mouse.move(startX, startY);
  await page.mouse.down();
  await page.mouse.move(startX + 20, startY, { steps: 5 });
  await page.mouse.move(endX, endY, { steps: 15 });
  await page.mouse.up();

  await expect(targetColumn.getByTestId("card-card-2")).toBeVisible();
});
