import { test, expect, type Page } from "@playwright/test";

/**
 * Full learner journey, exercised against a production build.
 * Everything here is a real server action writing to the SQLite database.
 */

const stamp = Date.now().toString(36);

function freshAccount() {
  return {
    name: "QA Builder",
    username: `qa_${stamp}_${Math.floor(Math.random() * 1e6).toString(36)}`,
    email: `qa_${stamp}_${Math.floor(Math.random() * 1e6).toString(36)}@example.com`,
    password: "Password123",
  };
}

async function signup(page: Page) {
  const account = freshAccount();
  await page.goto("/signup");
  await page.getByLabel("Your name").fill(account.name);
  await page.getByLabel("Username").fill(account.username);
  await page.getByLabel("Email").fill(account.email);
  await page.getByLabel("Password", { exact: true }).fill(account.password);
  await page.getByRole("button", { name: "Create my Builder account" }).click();
  await page.waitForURL("**/dashboard");
  await expect(page.getByRole("heading", { name: /Welcome back/ })).toBeVisible();
}

test.describe("BuilderVerse", () => {
  test("landing page sells the platform", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("portfolio you built");
    await expect(page.getByRole("link", { name: "Start building free" })).toBeVisible();

    // theme toggle works on the public pages too
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.getByRole("link", { name: "Browse lessons" }).click();
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    await page.goto("/about");
    await page.getByRole("button", { name: "Switch to light theme" }).click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });

  test("protected routes redirect anonymous visitors", async ({ page }) => {
    await page.goto("/dashboard");
    await page.waitForURL("**/login");
    await expect(page.getByRole("button", { name: "Log in" })).toBeVisible();
  });

  test("full learner journey", async ({ page }) => {
    await signup(page);

    // ---------------------------------------------------------- dashboard
    await expect(page.getByText("Today's mission", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Mark mission complete" }).click();
    await expect(page.getByText("Mission complete")).toBeVisible();

    // ------------------------------------------------------------ lesson
    await page.goto("/learn/html/html-your-first-page");
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();

    const fieldsets = page.locator("fieldset");
    const questionCount = await fieldsets.count();
    expect(questionCount).toBeGreaterThan(0);
    for (let i = 0; i < questionCount; i += 1) {
      await fieldsets.nth(i).locator('input[type="radio"]').first().check();
    }
    await page.getByRole("button", { name: "Submit answers" }).click();
    await expect(page.getByText(/XP earned/)).toBeVisible();
    await expect(page.getByText("Lesson complete. Nicely done.")).toBeVisible();

    // ------------------------------------------------------------ course
    await page.goto("/learn/html");
    await expect(page.getByText(/of \d+ lessons/).first()).toBeVisible();

    // ------------------------------------------------------ thinking gym
    await page.goto("/think");
    await expect(page.getByRole("heading", { name: "Thinking Gym" })).toBeVisible();
    await page.getByRole("link", { name: /Three switches, one bulb/ }).click();
    await expect(page.getByRole("heading", { name: "Your answer" })).toBeVisible();
    await page.getByRole("textbox", { name: "Your answer" }).fill("I would use heat from the bulb to tell which switch.");
    await page.getByRole("button", { name: "Submit answer" }).click();
    await expect(page.locator('p[role="status"]').first()).toBeVisible();

    // ------------------------------------------------------------- debug
    await page.goto("/debug/typo-in-variable");
    await expect(page.getByText("nam is not defined")).toBeVisible();
    await page.getByRole("button", { name: "Reveal the fix" }).click();
    await expect(page.getByText("What happened:")).toBeVisible();
    await expect(page.getByText("Fix summary:")).toBeVisible();

    // ----------------------------------------------------------- project
    await page.goto("/build/calculator");
    const firstStep = page.locator('section[aria-labelledby="checklist-heading"] button').first();
    await firstStep.click();
    await expect(firstStep).toHaveAttribute("aria-pressed", "true");

    // ------------------------------------------------------------- ideas
    await page.goto("/ideas");
    const firstIdeaCard = page.locator("div.grid.gap-4 > div").first();
    const bookmark = firstIdeaCard.locator("button[aria-pressed]");
    await bookmark.click();
    await expect(bookmark).toHaveAttribute("aria-pressed", "true");

    // -------------------------------------------------------- portfolio
    await page.goto("/profile#portfolio");
    await page.locator('input[name="name"]').fill("My Notes App");
    await page.locator('input[name="tech"]').fill("React, CSS");
    await page.locator('textarea[name="description"]').fill("A small notes app with local storage and markdown rendering.");
    await page.getByRole("button", { name: "Add to portfolio" }).click();
    await expect(page.getByRole("heading", { name: "My Notes App" })).toBeVisible();

    // ---------------------------------------------------------- settings
    await page.goto("/settings");
    await page.getByLabel("Headline").fill("Building things with React.");
    await page.getByRole("button", { name: "Save profile" }).click();
    await expect(page.getByText("Profile saved.")).toBeVisible();

    await page.goto("/profile");
    await expect(page.getByText("Building things with React.")).toBeVisible();

    // ------------------------------------------------------------ logout
    await page.getByRole("button", { name: "Log out" }).click();
    await page.waitForURL("**/");
    await page.goto("/dashboard");
    await page.waitForURL("**/login");
  });

  test("mobile shell, dark mode and search", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await signup(page);

    await expect(page.locator('nav[aria-label="Mobile"]')).toBeVisible();
    await expect(page.locator("aside")).toBeHidden();

    const theme = page.getByRole("button", { name: "Switch to dark theme" });
    await theme.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    expect(await page.evaluate(() => localStorage.getItem("bv-theme"))).toBe("dark");
    await page.reload();
    await expect(page.locator("html")).toHaveClass(/dark/);

    await page.goto("/search?q=fetch");
    await expect(page.getByRole("heading", { name: "Find your next step" })).toBeVisible();
    const searchBox = page.getByLabel("Search BuilderVerse content");
    await searchBox.fill("dom");
    await searchBox.press("Enter");
    await page.waitForURL(/\/search\?q=dom/);
  });

  test("every page has exactly one h1", async ({ page }) => {
    await signup(page);

    const routes = [
      "/dashboard",
      "/learn",
      "/learn/html",
      "/learn/html/html-your-first-page",
      "/think",
      "/think/three-buttons-one-bulb",
      "/debug",
      "/debug/typo-in-variable",
      "/build",
      "/build/calculator",
      "/ideas",
      "/ideas/student-study-planner",
      "/assistant",
      "/search?q=flexbox",
      "/profile",
      "/settings",
    ];

    for (const route of routes) {
      await page.goto(route);
      const count = await page.locator("h1").count();
      expect(count, `${route} should render exactly one h1`).toBe(1);
    }
  });
});