import { describe, expect, it } from "vitest";
import { bookSearchQueryOptions } from "./bookQueries";
import type { KakaoApiError } from "@/types/book";

function createApiError(retryable: boolean): KakaoApiError {
  const error = new Error("test error") as KakaoApiError;
  error.kind = retryable ? "retryable" : "unknown";
  error.retryable = retryable;
  return error;
}

describe("bookSearchQueryOptions", () => {
  it("queryKey를 books/search + params 구조로 생성한다", () => {
    const params = { query: "react", page: 2, size: 10, target: "title" } as const;
    const options = bookSearchQueryOptions(params);

    expect(options.queryKey).toEqual(["books", "search", params]);
  });

  it("retryable 에러일 때만 최대 2회까지 재시도한다", () => {
    const options = bookSearchQueryOptions({
      query: "react",
      page: 1,
      size: 10,
    });
    const retry = options.retry as (failureCount: number, error: unknown) => boolean;

    expect(retry(0, createApiError(true))).toBe(true);
    expect(retry(1, createApiError(true))).toBe(true);
    expect(retry(2, createApiError(true))).toBe(false);
    expect(retry(0, createApiError(false))).toBe(false);
  });
});
