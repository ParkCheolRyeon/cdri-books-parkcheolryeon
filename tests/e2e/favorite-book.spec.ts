import { expect, test } from "@playwright/test";
import {
  ALL_SEARCH_BOOKS,
  getCurrentQueryParam,
  prepareBookSearchScenario,
  runMainSearch,
  toggleFavoriteFromBookRow,
} from "./support/book-e2e-helpers";

test.beforeEach(async ({ page }) => {
  await prepareBookSearchScenario(page);
});

test("favorite-book: 9~11 시나리오", async ({ page }) => {
  await page.goto("/book-search");

  await test.step(
    "9. 도서 검색 후 찜하기: 1페이지 전체 + 2페이지 상위 2개",
    async () => {
      await runMainSearch(page, "테스트", ALL_SEARCH_BOOKS[0].title);

      await expect(
        page.getByRole("button", { name: "상세보기", exact: true }),
      ).toHaveCount(10);

      for (let index = 0; index < 10; index += 1) {
        await toggleFavoriteFromBookRow(page, index, "add-favorite");
      }

      await page.getByRole("button", { name: "2", exact: true }).click();
      await expect.poll(() => getCurrentQueryParam(page, "page")).toBe("2");
      await expect(
        page.getByRole("button", { name: "상세보기", exact: true }),
      ).toHaveCount(2);

      for (let index = 0; index < 2; index += 1) {
        await toggleFavoriteFromBookRow(page, index, "add-favorite");
      }
    },
  );

  await test.step("10. 내가 찜한 책 페이지네이션 검증", async () => {
    await page.getByRole("link", { name: "내가 찜한 책", exact: true }).click();
    await expect(page).toHaveURL(/\/favorites$/);

    await expect(page.locator("body")).toContainText(/찜한 책 총\s*12권/);
    await expect(
      page.getByRole("button", { name: "상세보기", exact: true }),
    ).toHaveCount(10);

    await page.getByRole("button", { name: "2", exact: true }).click();
    await expect.poll(() => getCurrentQueryParam(page, "page")).toBe("2");
    await expect(
      page.getByRole("button", { name: "상세보기", exact: true }),
    ).toHaveCount(2);
  });

  await test.step("11. 찜하기 취소 후 페이지네이션 축소 확인", async () => {
    await toggleFavoriteFromBookRow(page, 0, "remove-favorite");
    await expect(
      page.getByRole("button", { name: "상세보기", exact: true }),
    ).toHaveCount(1);

    await toggleFavoriteFromBookRow(page, 0, "remove-favorite");

    await expect.poll(() => getCurrentQueryParam(page, "page")).toBe(null);
    await expect(page).toHaveURL(/\/favorites$/);
    await expect(
      page.getByRole("button", { name: "상세보기", exact: true }),
    ).toHaveCount(10);
    await expect(page.getByRole("button", { name: "2", exact: true })).toHaveCount(
      0,
    );
  });
});
