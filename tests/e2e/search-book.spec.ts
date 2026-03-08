import { expect, test } from "@playwright/test";
import {
  AUTHOR_DETAIL_BOOKS,
  DETAIL_SEARCH_INPUT_PLACEHOLDER,
  MAIN_SEARCH_INPUT_PLACEHOLDER,
  PUBLISHER_DETAIL_BOOKS,
  TEST2_BOOKS,
  TEST3_BOOKS,
  TITLE_DETAIL_BOOKS,
  ALL_SEARCH_BOOKS,
  openDetailSearchPopup,
  prepareBookSearchScenario,
  runDetailSearch,
  runMainSearch,
} from "./support/book-e2e-helpers";

test.beforeEach(async ({ page }) => {
  await prepareBookSearchScenario(page);
});

test("search-book: 3~8 시나리오", async ({ page }) => {
  await page.goto("/book-search");

  await test.step(
    '3. 도서 검색 테스트: "테스트", "테스트2", "테스트3"',
    async () => {
      await runMainSearch(page, "테스트", ALL_SEARCH_BOOKS[0].title);
      await runMainSearch(page, "테스트2", TEST2_BOOKS[0].title);
      await runMainSearch(page, "테스트3", TEST3_BOOKS[0].title);
    },
  );

  await test.step("4. 최근 검색어 테스트", async () => {
    const input = page.getByPlaceholder(MAIN_SEARCH_INPUT_PLACEHOLDER);
    await input.click();

    for (const keyword of ["테스트", "테스트2", "테스트3"]) {
      await expect(
        page.getByRole("button", { name: keyword, exact: true }),
      ).toBeVisible();
    }
  });

  await test.step("5. 최근 검색어 삭제", async () => {
    for (let index = 0; index < 3; index += 1) {
      await page
        .getByRole("button", { name: "remove-recent-search", exact: true })
        .first()
        .click();
    }

    for (const keyword of ["테스트", "테스트2", "테스트3"]) {
      await expect(
        page.getByRole("button", { name: keyword, exact: true }),
      ).toHaveCount(0);
    }
  });

  await test.step("6. 상세검색 팝업 오픈", async () => {
    await openDetailSearchPopup(page);
    await page
      .getByRole("button", { name: "close-detail-search", exact: true })
      .click();
    await expect(
      page.getByRole("button", { name: "close-detail-search", exact: true }),
    ).toHaveCount(0);
    await expect(page.getByPlaceholder(DETAIL_SEARCH_INPUT_PLACEHOLDER)).toHaveCount(
      0,
    );
  });

  await test.step("7. 상세 검색 테스트", async () => {
    await runDetailSearch({
      page,
      keyword: "테스트4",
      expectedListTitle: TITLE_DETAIL_BOOKS[0].title,
      expectedUrlTarget: "title",
    });

    await runDetailSearch({
      page,
      currentTargetLabel: "제목",
      nextTargetLabel: "저자명",
      keyword: "무라카미 하루키",
      expectedListTitle: AUTHOR_DETAIL_BOOKS[0].title,
      expectedUrlTarget: "authors",
    });

    await runDetailSearch({
      page,
      currentTargetLabel: "저자명",
      nextTargetLabel: "출판사",
      keyword: "미래",
      expectedListTitle: PUBLISHER_DETAIL_BOOKS[0].title,
      expectedUrlTarget: "publisher",
    });
  });

  await test.step("8. 상세 검색 동작 시 전체 검색 input 초기화", async () => {
    await expect(page.getByPlaceholder(MAIN_SEARCH_INPUT_PLACEHOLDER)).toHaveValue(
      "",
    );
  });
});
