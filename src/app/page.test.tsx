import { expect, test } from "@playwright/test";

test("home", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toContainText("JobTrackr");
});
