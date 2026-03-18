import { test, expect } from "@playwright/test";
import { loginUser } from "./helpers/authHelper.js";

test("user can log in and redirected to dashboard", async ({ page }) => {
  await loginUser(page, "TM", "TheresaMay");

  await expect(page.getByText(/hi, tm/i)).toBeVisible();
  await expect(page).toHaveURL(/dashboard/);
});

test("should display error message with invalid login credentials", async ({
  page,
}) => {
  await page.goto("http://localhost:5173/");

  await page.fill('input[name="emailOrUsername"]', "TM");
  await page.fill('input[name="password"]', "wrongpassword");

  await page.getByRole("button", { name: /login/i }).click();

  const error = page.locator(
    "text=Invalid email/username or password. Please try again.",
  );

  await expect(error).toBeVisible();
});
