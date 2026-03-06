import { test, expect } from "@playwright/test";

test("homepage visual health check", async ({ page }) => {
  await page.goto("/");
  // Wait for heavy animations like Vanta to stabilize if possible,
  // or use a threshold.
  await page.waitForTimeout(2000);

  await expect(page).toHaveScreenshot("homepage.png", {
    maxDiffPixelRatio: 0.1, // Allow small pixel differences for dynamic background
    fullPage: true,
  });
});
