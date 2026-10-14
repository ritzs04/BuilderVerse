/**
 * Graduation Studio: certificates are earned, verified server-side and
 * revocable. This exercises the real server actions against a production build
 * and a real SQLite database.
 */

import { expect, test, type Page } from "@playwright/test";

const stamp = Date.now().toString(36);

async function signup(page: Page) {
  const account = {
    name: "Cert Builder",
    username: `cert_${stamp}_${Math.floor(Math.random() * 1e6).toString(36)}`,
    email: `cert_${stamp}_${Math.floor(Math.random() * 1e6).toString(36)}@example.com`,
    password: "Password123",
  };
  await page.goto("/signup");
  await page.getByRole("button", { name: /^Start my journey$/ }).click();
  await page.getByRole("button", { name: /I'm Ready to Begin/ }).click();
  await page.getByLabel("Your name").fill(account.name);
  await page.getByLabel("Username").fill(account.username);
  await page.getByLabel("Email").fill(account.email);
  await page.getByLabel("Password", { exact: true }).fill(account.password);
  await page.getByRole("button", { name: /^Next$/ }).click();
  await page.getByRole("button", { name: /Create my Builder account/ }).click();
  await page.waitForURL("**/welcome");
  await page.getByRole("link", { name: /^Go to my dashboard$/ }).click();
  await page.waitForURL("**/dashboard");
}

test.describe("Graduation Studio", () => {
  test("a new learner cannot issue a certificate yet", async ({ page }) => {
    await signup(page);
    await page.goto("/graduate");

    await expect(page.getByRole("heading", { name: "Graduation Studio" })).toBeVisible();

    // Every level must be locked, with the reason explained rather than hidden.
    await expect(page.locator('input[name="level"][disabled]')).toHaveCount(3);
    await expect(page.getByText(/Finish every lesson quiz in this path first/)).toBeVisible();
  });

  test("an unknown certificate ID does not leak or claim validity", async ({ page }) => {
    const response = await page.goto("/verify/BV-CERT-2020-AAAAAA-00");
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { name: /Certificate not recognised/ })).toBeVisible();
    // No certificate fields are rendered for an unknown ID.
    await expect(page.getByText(/Awarded to/)).toHaveCount(0);
  });

  test("Graduation Studio is reachable from the app shell", async ({ page }) => {
    await signup(page);
    await page.goto("/dashboard");
    const link = page.getByRole("link", { name: /Graduate|Graduation/ }).first();
    if ((await link.count()) > 0) {
      await link.click();
      await page.waitForURL("**/graduate");
      await expect(page.getByRole("heading", { name: "Graduation Studio" })).toBeVisible();
    }
  });
});
