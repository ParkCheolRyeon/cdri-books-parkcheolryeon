import { expect, test } from "@playwright/test";
import { clearLocalStorageOnStart } from "./support/book-e2e-helpers";

test.beforeEach(async ({ page }) => {
  await clearLocalStorageOnStart(page);
});

test("init: 1~2 시나리오", async ({ page }) => {
  await test.step("1. root 접근 시 /book-search로 리디렉션", async () => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/book-search$/);
  });

  await test.step("2. 탭 이동: 도서 검색 <-> 내가 찜한 책", async () => {
    await page.getByRole("link", { name: "내가 찜한 책", exact: true }).click();
    await expect(page).toHaveURL(/\/favorites$/);
    await expect(page.getByText("찜한 책이 없습니다.")).toBeVisible();

    await page.getByRole("link", { name: "도서 검색", exact: true }).click();
    await expect(page).toHaveURL(/\/book-search$/);
  });
});
