import type { BookSearchParams, SearchTarget } from "@/types/book";

export const SEARCH_PAGE_SIZE = 10;

export function parsePositivePage(value: string | null) {
  const page = Number(value);
  if (!Number.isFinite(page) || page < 1) {
    return 1;
  }

  return Math.trunc(page);
}

export function parseTarget(value: string | null): SearchTarget | undefined {
  if (
    value === "title" ||
    value === "authors" ||
    value === "publisher" ||
    value === "isbn"
  ) {
    return value;
  }

  if (value === "person") {
    return "authors";
  }

  return undefined;
}

export function buildSearchParams(
  searchParams: URLSearchParams,
): BookSearchParams | null {
  const query = searchParams.get("query")?.trim() ?? "";
  if (!query) {
    return null;
  }

  return {
    query,
    page: parsePositivePage(searchParams.get("page")),
    size: SEARCH_PAGE_SIZE,
    target: parseTarget(searchParams.get("target")),
  };
}
