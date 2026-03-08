import { useSuspenseQuery } from "@tanstack/react-query";
import { bookSearchQueryOptions } from "@/queries/bookQueries";
import type { BookSearchParams } from "@/types/book";

export function useBookSearchQuery(params: BookSearchParams) {
  return useSuspenseQuery(bookSearchQueryOptions(params));
}
