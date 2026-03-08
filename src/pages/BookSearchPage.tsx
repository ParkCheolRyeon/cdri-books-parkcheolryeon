import { Suspense, useCallback, useDeferredValue } from "react";
import styled from "@emotion/styled";
import { useSearchParams } from "react-router-dom";
import BookList from "@/components/book/BookList";
import BookListSkeleton from "@/components/book/BookListSkeleton";
import { BookSearchForm } from "@/components/book/BookSearhForm";
import { Fallback } from "@/components/ui/Fallback";
import { Pagination } from "@/components/ui/Pagination";
import { QueryErrorBoundary } from "@/components/ui/QueryErrorBoundary";
import { useBookSearchQuery } from "@/hooks/useBookSearchQuery";
import { useFavorites } from "@/hooks/useFavorites";
import { useRecentSearches } from "@/hooks/useRecentSearches";
import { buildSearchParams, parseTarget } from "@/lib/searchParams";
import { media } from "@/styles/breakpoints";
import type { BookSearchParams, SearchTarget } from "@/types/book";

type SearchResultsProps = {
  params: BookSearchParams;
  onPageChange: (page: number) => void;
};

function SearchResults({ params, onPageChange }: SearchResultsProps) {
  const deferredParams = useDeferredValue(params);
  const { data } = useBookSearchQuery(deferredParams);
  const { isFavorite, toggleFavorite } = useFavorites();

  const totalPages = Math.max(
    1,
    Math.ceil(Math.min(data.pageableCount, 500) / params.size),
  );

  if (!data.documents.length) {
    return <EmptyFallback description="검색된 결과가 없습니다." />;
  }

  return (
    <ResultsGrid>
      <ResultHeader>
        <ResultLabel>도서 검색 결과</ResultLabel>
        <ResultCount>
          <ResultText>총 </ResultText>
          <ResultValue>{data.pageableCount}</ResultValue>
          <ResultText>건</ResultText>
        </ResultCount>
      </ResultHeader>

      <BookList
        books={data.documents}
        isFavorite={isFavorite}
        onToggleFavorite={toggleFavorite}
      />

      <Pagination
        currentPage={params.page}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />
    </ResultsGrid>
  );
}

export function BookSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const parsedParams = buildSearchParams(searchParams);
  const { recentSearches, addRecentSearch, removeRecentSearch } =
    useRecentSearches();

  function updateParams(next: {
    query?: string;
    page?: number;
    target?: SearchTarget;
  }) {
    const updated = new URLSearchParams(searchParams);

    if (next.query) {
      updated.set("query", next.query.trim());
      updated.set("page", String(next.page ?? 1));
    } else {
      updated.delete("query");
      updated.delete("page");
    }

    if (next.target) {
      updated.set("target", next.target);
    } else {
      updated.delete("target");
    }

    setSearchParams(updated);
  }

  function handleSearch(query: string) {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      updateParams({});
      return;
    }

    addRecentSearch(normalizedQuery);
    updateParams({
      page: 1,
      query: normalizedQuery,
      target: undefined,
    });
  }

  const handlePageChange = useCallback(
    (page: number) => {
      if (!parsedParams) return;
      updateParams({
        page,
        query: parsedParams.query,
        target: parsedParams.target,
      });
    },
    [parsedParams?.query, parsedParams?.target],
  );

  function handleDetailedSearch(query: string, target: SearchTarget) {
    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      updateParams({});
      return;
    }

    addRecentSearch(normalizedQuery);
    updateParams({
      page: 1,
      query: normalizedQuery,
      target,
    });
  }

  return (
    <PageSection>
      <BookSearchForm
        defaultQuery={searchParams.get("query") ?? ""}
        defaultTarget={parseTarget(searchParams.get("target"))}
        recentSearches={recentSearches}
        onSearch={handleSearch}
        onDetailedSearch={handleDetailedSearch}
        onRemoveRecentSearch={removeRecentSearch}
        onReset={() => updateParams({})}
      />

      {!parsedParams ? (
        <EmptyFallback description="검색된 결과가 없습니다." />
      ) : (
        <Suspense fallback={<BookListSkeleton />}>
          <QueryErrorBoundary
            resetKey={`${parsedParams.query}-${parsedParams.page}-${parsedParams.target ?? "all"}`}
            title="검색 결과를 불러오지 못했습니다"
          >
            <SearchResults
              params={parsedParams}
              onPageChange={handlePageChange}
            />
          </QueryErrorBoundary>
        </Suspense>
      )}
    </PageSection>
  );
}

export default BookSearchPage;

const PageSection = styled.section({
  gap: 24,
  flex: 1,
  width: "100%",
  maxWidth: 960,
  display: "flex",
  paddingBottom: 64,
  marginInline: "auto",
  flexDirection: "column",

  [media.md]: {
    maxWidth: "100%",
    paddingInline: 16,
  },
  [media.xsm]: {
    gap: 20,
    paddingInline: 12,
    paddingBottom: 48,
  },
});

const ResultsGrid = styled.div({
  gap: 24,
  display: "flex",
  flexDirection: "column",

  [media.xsm]: {
    gap: 20,
  },
});

const ResultHeader = styled.div(({ theme }) => ({
  gap: 16,
  display: "flex",
  alignItems: "center",
  color: theme.textColor.primary,
  fontSize: theme.typography.caption.size,
  fontWeight: theme.typography.caption.weight,
  lineHeight: theme.typography.caption.lineHeight,

  [media.sm]: {
    gap: 8,
    flexDirection: "column",
    alignItems: "flex-start",
  },
}));

const ResultLabel = styled.span({
  whiteSpace: "nowrap",

  [media.sm]: {
    whiteSpace: "normal",
  },
});

const ResultCount = styled.p({
  fontSize: 0,
  lineHeight: 1,

  [media.sm]: {
    textAlign: "left",
  },
});

const ResultText = styled.span(({ theme }) => ({
  color: theme.textColor.primary,
  fontSize: theme.typography.caption.size,
  fontWeight: theme.typography.caption.weight,
  lineHeight: theme.typography.caption.lineHeight,
}));

const ResultValue = styled(ResultText)(({ theme }) => ({
  color: theme.color.primary,
}));

const EmptyFallback = styled(Fallback)({
  minHeight: 420,

  [media.sm]: {
    minHeight: 360,
  },
  [media.xsm]: {
    minHeight: 300,
  },
});
