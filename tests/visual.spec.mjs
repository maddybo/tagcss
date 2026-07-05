import { expect, test } from "@playwright/test";

test.describe("TagCss demo", () => {
  test("renders the semantic demo page", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("body > header")).toBeVisible();
    await expect(page.locator("main")).toBeVisible();
    await expect(page.locator("form")).toBeVisible();
    await expect(page.locator("table")).toBeVisible();
    await expect(page).toHaveScreenshot("tagcss-demo.png", {
      fullPage: true,
      animations: "disabled"
    });
  });

  test("renders dark rose accent", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      document.documentElement.dataset.theme = "dark";
      document.documentElement.dataset.accent = "rose";
    });
    await expect(page.locator("main")).toBeVisible();
    await expect(page).toHaveScreenshot("tagcss-demo-dark.png", {
      fullPage: true,
      animations: "disabled"
    });
  });
});
