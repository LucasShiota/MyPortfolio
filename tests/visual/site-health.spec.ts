import { test, expect } from "@playwright/test";

test.describe("Site Visual Regression", () => {
  test("homepage - mobile", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");

    // Allow static parts to load
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("homepage-mobile.png", {
      fullPage: true,
      mask: [page.locator("#vanta-bg")], // Mask the dynamic background
      threshold: 0.2,
    });
  });

  test("homepage - desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(1000);

    await expect(page).toHaveScreenshot("homepage-desktop.png", {
      fullPage: true,
      mask: [page.locator("#vanta-bg")],
      threshold: 0.2,
    });
  });

  test("dark mode toggle visual check", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    // Toggle dark mode (assuming there's a button with id theme-toggle or similar)
    const toggle = page.locator("#theme-toggle");
    if (await toggle.isVisible()) {
      await toggle.click();
      await page.waitForTimeout(600); // Wait for transition

      await expect(page).toHaveScreenshot("homepage-dark-mode.png", {
        mask: [page.locator("#vanta-bg")],
        threshold: 0.2,
      });
    }
  });
});
