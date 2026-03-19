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

test("display modal when '+Add Board' button is clicked", async ({ page }) => {
  await loginUser(page, "TM", "TheresaMay");

  await page.getByRole("button", { name: "+Add New Board" }).click();

  await expect(page.getByText(/board name/i)).toBeVisible();
  await expect(page.getByText(/description/i)).toBeVisible();
});

test("user can click a dynamic board and navigate to the task view", async ({
  page,
}) => {
  // Mock the API call that fetches boards for the current user
  const mockBoard = { _id: "65f8c123abc456def7890123", name: "Project1" };

  await page.route("http://localhost:4000/api/boards/", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([mockBoard]), // Pretend this user has one board
    });
  });

  await loginUser(page, "TM", "TheresaMay");

  // Find the dynamic board by its name and click it
  const boardCard = page.getByRole("link", {
    name: /Project1/,
  });
  //   await expect(page.getByText(/project1/i)).toBeVisible();
  await expect(boardCard).toBeVisible();
  await boardCard.click();

  // Verify the URL contains the dynamic ID from the mock
  await expect(page).toHaveURL(new RegExp(`/board/${mockBoard._id}`));

  // Verify we are on the task page (e.g., checking for an "Add Task" button)
  await expect(
    page.getByRole("button", { name: /Add New Task/i }),
  ).toBeVisible();
});
