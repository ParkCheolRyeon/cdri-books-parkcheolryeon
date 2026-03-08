import { SEARCH_PAGE_SIZE } from "@/lib/searchParams";
import type { Book } from "@/types/book";

export const FAVORITES_PAGE_SIZE = SEARCH_PAGE_SIZE;

export function getFavoritesPagination(favorites: Book[], requestedPage: number) {
  const totalCount = favorites.length;
  const totalPages = Math.max(
    1,
    Math.ceil(totalCount / FAVORITES_PAGE_SIZE),
  );
  const currentPage = Math.min(Math.max(1, requestedPage), totalPages);
  const startIndex = (currentPage - 1) * FAVORITES_PAGE_SIZE;
  const currentItems = favorites.slice(startIndex, startIndex + FAVORITES_PAGE_SIZE);

  return {
    totalCount,
    totalPages,
    currentPage,
    currentItems,
  };
}
