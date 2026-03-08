import { queryOptions } from "@tanstack/react-query";
import { searchBooks } from "@/api/booksApi";
import type { BookSearchParams, KakaoApiError } from "@/types/book";

export function bookSearchQueryOptions(params: BookSearchParams) {
  return queryOptions({
    queryKey: ["books", "search", params] as const,
    queryFn: () => searchBooks(params),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    retry(failureCount, error) {
      const apiError = error as KakaoApiError;
      if (!apiError.retryable) {
        return false;
      }

      return failureCount < 2;
    },
  });
}
