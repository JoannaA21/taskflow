export const loginUser = async (page, emailOrUsername, password) => {
  //Go to login page
  await page.goto("http://localhost:5173/");

  // fill in input fields
  await page.fill('input[name="emailOrUsername"]', emailOrUsername);
  await page.fill('input[name="password"]', password);

  //click login button
  await page.click('button:has-text("Login")');
};
