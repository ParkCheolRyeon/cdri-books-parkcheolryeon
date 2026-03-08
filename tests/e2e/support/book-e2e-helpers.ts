import { expect, type Page } from "@playwright/test";

export const SEARCH_PAGE_SIZE = 10;
export const MAIN_SEARCH_INPUT_PLACEHOLDER = "검색어를 입력하세요";
export const DETAIL_SEARCH_INPUT_PLACEHOLDER = "검색어 입력";

type DetailTargetValue = "title" | "authors" | "publisher";

type DetailTargetLabel = "제목" | "저자명" | "출판사";

type MockKakaoBook = {
  title: string;
  contents: string;
  url: string;
  isbn: string;
  datetime: string;
  authors: string[];
  publisher: string;
  translators: string[];
  price: number;
  sale_price: number;
  thumbnail: string;
  status: string;
};

export const ALL_SEARCH_BOOKS = createMockBooks({
  total: 12,
  prefix: "테스트 도서",
  seedOffset: 0,
});

export const TEST2_BOOKS = createMockBooks({
  total: 4,
  prefix: "테스트2 도서",
  seedOffset: 100,
});

export const TEST3_BOOKS = createMockBooks({
  total: 3,
  prefix: "테스트3 도서",
  seedOffset: 200,
});

export const TITLE_DETAIL_BOOKS = createMockBooks({
  total: 2,
  prefix: "테스트4 제목",
  seedOffset: 300,
});

export const AUTHOR_DETAIL_BOOKS = createMockBooks({
  total: 2,
  prefix: "무라카미 하루키 작품",
  seedOffset: 400,
  authors: ["무라카미 하루키"],
});

export const PUBLISHER_DETAIL_BOOKS = createMockBooks({
  total: 2,
  prefix: "미래 출판 도서",
  seedOffset: 500,
  publisher: "미래",
});

const QUERY_FIXTURES = new Map<string, MockKakaoBook[]>([
  ["all::테스트", ALL_SEARCH_BOOKS],
  ["all::테스트2", TEST2_BOOKS],
  ["all::테스트3", TEST3_BOOKS],
  ["title::테스트4", TITLE_DETAIL_BOOKS],
  ["person::무라카미 하루키", AUTHOR_DETAIL_BOOKS],
  ["publisher::미래", PUBLISHER_DETAIL_BOOKS],
]);

export async function clearLocalStorageOnStart(page: Page) {
  await page.addInitScript(() => {
    window.localStorage.clear();
  });
}

export async function installKakaoBookSearchMock(page: Page) {
  await page.route("https://dapi.kakao.com/v3/search/book**", async (route) => {
    const requestUrl = new URL(route.request().url());
    const query = requestUrl.searchParams.get("query")?.trim() ?? "";
    const target = requestUrl.searchParams.get("target") ?? "all";
    const pageParam = Number(requestUrl.searchParams.get("page") ?? "1");
    const size = Number(requestUrl.searchParams.get("size") ?? SEARCH_PAGE_SIZE);
    const fixtureKey = `${target}::${query}`;
    const allBooks = QUERY_FIXTURES.get(fixtureKey) ?? [];
    const pageBooks = paginateBooks(allBooks, pageParam, size);

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        meta: {
          total_count: allBooks.length,
          pageable_count: allBooks.length,
          is_end: pageParam * size >= allBooks.length,
        },
        documents: pageBooks,
      }),
    });
  });
}

export async function prepareBookSearchScenario(page: Page) {
  await clearLocalStorageOnStart(page);
  await installKakaoBookSearchMock(page);
}

export async function runMainSearch(
  page: Page,
  keyword: string,
  expectedListTitle: string,
) {
  const input = page.getByPlaceholder(MAIN_SEARCH_INPUT_PLACEHOLDER);
  await input.fill(keyword);
  await input.press("Enter");

  await expect.poll(() => getCurrentQueryParam(page, "query")).toBe(keyword);
  await expect.poll(() => getCurrentQueryParam(page, "target")).toBe(null);
  await expect(page.getByText("도서 검색 결과")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: expectedListTitle, level: 3 }).first(),
  ).toBeVisible();
}

export async function openDetailSearchPopup(page: Page) {
  await page.getByRole("button", { name: "상세검색", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "close-detail-search", exact: true }),
  ).toBeVisible();
  await expect(page.getByPlaceholder(DETAIL_SEARCH_INPUT_PLACEHOLDER)).toBeVisible();
}

export async function runDetailSearch(options: {
  page: Page;
  keyword: string;
  expectedListTitle: string;
  expectedUrlTarget: DetailTargetValue;
  currentTargetLabel?: DetailTargetLabel;
  nextTargetLabel?: DetailTargetLabel;
}) {
  const {
    page,
    keyword,
    expectedListTitle,
    expectedUrlTarget,
    currentTargetLabel,
    nextTargetLabel,
  } = options;

  await openDetailSearchPopup(page);
  const popup = page
    .locator("div")
    .filter({
      has: page.getByRole("button", {
        name: "close-detail-search",
        exact: true,
      }),
    })
    .first();

  if (currentTargetLabel && nextTargetLabel) {
    await popup
      .getByRole("button", { name: currentTargetLabel, exact: true })
      .first()
      .click();
    await popup
      .getByRole("button", { name: nextTargetLabel, exact: true })
      .last()
      .click();
  }

  await popup.getByPlaceholder(DETAIL_SEARCH_INPUT_PLACEHOLDER).fill(keyword);
  await popup.getByRole("button", { name: "검색하기", exact: true }).click();

  await expect.poll(() => getCurrentQueryParam(page, "query")).toBe(keyword);
  await expect.poll(() => getCurrentQueryParam(page, "target")).toBe(expectedUrlTarget);
  await expect(page.getByText("도서 검색 결과")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: expectedListTitle, level: 3 }).first(),
  ).toBeVisible();
}

export async function toggleFavoriteFromBookRow(
  page: Page,
  rowIndex: number,
  ariaLabel: "add-favorite" | "remove-favorite",
) {
  const detailToggleButton = page
    .getByRole("button", { name: "상세보기", exact: true })
    .nth(rowIndex);

  await detailToggleButton.scrollIntoViewIfNeeded();
  await detailToggleButton.click();

  const openBookItem = page.locator('[data-state="open"]').last();
  const favoriteButton = openBookItem
    .locator(`button[aria-label="${ariaLabel}"]`)
    .last();

  await expect(favoriteButton).toBeVisible();
  await favoriteButton.click();
}

export function getCurrentQueryParam(page: Page, key: string) {
  return new URL(page.url()).searchParams.get(key);
}

function createMockBooks(options: {
  total: number;
  prefix: string;
  seedOffset: number;
  authors?: string[];
  publisher?: string;
}): MockKakaoBook[] {
  const { total, prefix, seedOffset, authors, publisher } = options;

  return Array.from({ length: total }, (_, index) => {
    const seed = seedOffset + index + 1;
    const title = `${prefix} ${index + 1}`;
    return {
      title,
      contents: `${title} 소개`,
      url: `https://example.com/books/${seed}`,
      isbn: `978${String(seed).padStart(10, "0")}`,
      datetime: "2026-01-01T00:00:00.000+09:00",
      authors: authors ?? [`저자 ${seed}`],
      publisher: publisher ?? `출판사 ${seed}`,
      translators: [],
      price: 20_000 + seed,
      sale_price: 15_000 + seed,
      thumbnail: "",
      status: "정상판매",
    };
  });
}

function paginateBooks(books: MockKakaoBook[], page: number, size: number) {
  const startIndex = Math.max(0, (page - 1) * size);
  return books.slice(startIndex, startIndex + size);
}
