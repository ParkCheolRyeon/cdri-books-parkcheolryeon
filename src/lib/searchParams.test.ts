import { describe, expect, it } from "vitest";
import {
  SEARCH_PAGE_SIZE,
  buildSearchParams,
  parsePositivePage,
} from "./searchParams";

describe("parsePositivePage", () => {
  it("유효하지 않은 값이면 1을 반환한다", () => {
    expect(parsePositivePage(null)).toBe(1);
    expect(parsePositivePage("0")).toBe(1);
    expect(parsePositivePage("-5")).toBe(1);
    expect(parsePositivePage("abc")).toBe(1);
  });

  it("소수 입력은 버림하여 양의 정수 페이지를 반환한다", () => {
    expect(parsePositivePage("2.9")).toBe(2);
  });
});

describe("buildSearchParams", () => {
  it("query가 비어 있으면 null을 반환한다", () => {
    const params = new URLSearchParams({
      query: "   ",
      page: "3",
      target: "title",
    });

    expect(buildSearchParams(params)).toBeNull();
  });

  it("query/page/target을 파싱해 검색 파라미터를 구성한다", () => {
    const params = new URLSearchParams({
      query: " 클린 코드 ",
      page: "4",
      target: "person",
    });

    expect(buildSearchParams(params)).toEqual({
      query: "클린 코드",
      page: 4,
      size: SEARCH_PAGE_SIZE,
      target: "authors",
    });
  });
});
