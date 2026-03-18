import { test, expect } from "@playwright/test";
import { loginUser } from "./helpers/authHelper.js";

test("user can logout and redirected to /login page", async ({ page }) => {
  await loginUser(page, "TM", "TheresaMay");
  await expect(page).toHaveURL(/dashboard/);
  await page.click("text=Logout");

  const token = await page.evaluate(() => localStorage.getItem("loggedIn"));
  expect(token).toBeNull();

  await expect(page).toHaveURL(/\/$/);
});
