import { test, expect } from "@playwright/test";

test("successful signup without hitting the DB", async ({ page }) => {
  // 1. Mock the GET request (Pretend no users exist yet)
  await page.route("http://localhost:4000/api/users/", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([]), // Empty array = no duplicates found
    });
  });

  // 2. Mock the POST request (Pretend the user was created)
  await page.route("http://localhost:4000/api/signup/", async (route) => {
    await route.fulfill({
      status: 201,
      contentType: "application/json",
      body: JSON.stringify({ message: "Success" }),
    });

    await page.fill('input[name="username]', "testuser");
    await page.fill('input[name="email]', "testuser@test.com");
    await page.fill('input[name="password]', "password123");
    await page.fill('input[name="confirmPassword]', "password123");

    await page.click('button:has-text("Create Account")');
    await expect(page).toHaveURL(/\/$/);
  });
});
