import { describe, expect, it } from "vitest";
import type { Book } from "@/types/book";
import { FAVORITES_PAGE_SIZE, getFavoritesPagination } from "./favoritesPagination";

function createBook(id: number): Book {
  return {
    id: String(id),
    isbn: "",
    title: `Book ${id}`,
    authors: [],
    publisher: "",
    contents: "",
    salePrice: null,
    price: 0,
    thumbnail: "",
    url: "",
    status: "",
  };
}

describe("getFavoritesPagination", () => {
  it("한 페이지에 10권만 노출한다", () => {
    const favorites = Array.from({ length: FAVORITES_PAGE_SIZE + 2 }, (_, index) =>
      createBook(index + 1),
    );

    const result = getFavoritesPagination(favorites, 1);

    expect(result.totalPages).toBe(2);
    expect(result.currentPage).toBe(1);
    expect(result.currentItems).toHaveLength(FAVORITES_PAGE_SIZE);
    expect(result.currentItems[0]?.id).toBe("1");
    expect(result.currentItems.at(-1)?.id).toBe("10");
  });

  it("요청한 페이지가 총 페이지 수보다 크면 마지막 페이지로 보정한다", () => {
    const favorites = Array.from({ length: 23 }, (_, index) =>
      createBook(index + 1),
    );

    const result = getFavoritesPagination(favorites, 999);

    expect(result.totalPages).toBe(3);
    expect(result.currentPage).toBe(3);
    expect(result.currentItems).toHaveLength(3);
    expect(result.currentItems[0]?.id).toBe("21");
  });

  it("찜한 책이 없을 때도 기본 페이지는 1로 유지한다", () => {
    const result = getFavoritesPagination([], 7);

    expect(result.totalCount).toBe(0);
    expect(result.totalPages).toBe(1);
    expect(result.currentPage).toBe(1);
    expect(result.currentItems).toHaveLength(0);
  });
});
