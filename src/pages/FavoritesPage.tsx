import BookList from "@/components/book/BookList";
import { Fallback } from "@/components/ui/Fallback";
import { Pagination } from "@/components/ui/Pagination";
import { useFavorites } from "@/hooks/useFavorites";
import { parsePositivePage } from "@/lib/searchParams";
import { media } from "@/styles/breakpoints";
import { useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styled from "@emotion/styled";
import { getFavoritesPagination } from "./favoritesPagination";

export function FavoritesPage() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPage = parsePositivePage(searchParams.get("page"));
  const { totalCount, totalPages, currentPage, currentItems } =
    getFavoritesPagination(favorites, requestedPage);

  useEffect(() => {
    if (requestedPage === currentPage) {
      return;
    }

    const updated = new URLSearchParams(searchParams);
    if (currentPage === 1) {
      updated.delete("page");
    } else {
      updated.set("page", String(currentPage));
    }
    setSearchParams(updated, { replace: true });
  }, [currentPage, requestedPage, searchParams, setSearchParams]);

  const handlePageChange = useCallback(
    (page: number) => {
      const updated = new URLSearchParams(searchParams);
      if (page === 1) {
        updated.delete("page");
      } else {
        updated.set("page", String(page));
      }
      setSearchParams(updated);
    },
    [searchParams, setSearchParams],
  );

  return (
    <PageSection>
      <ResultHeader>
        <ResultLabel>내가 찜한 책</ResultLabel>
        <ResultCount>
          <ResultText>찜한 책 총 </ResultText>
          <ResultValue>{totalCount}</ResultValue>
          <ResultText>권</ResultText>
        </ResultCount>
      </ResultHeader>

      {totalCount ? (
        <>
          <BookList
            books={currentItems}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      ) : (
        <EmptyFallback description="찜한 책이 없습니다." />
      )}
    </PageSection>
  );
}

const PageSection = styled.section({
  gap: 24,
  flex: 1,
  width: "100%",
  paddingTop: 8,
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

const ResultHeader = styled.div(({ theme }) => ({
  gap: 16,
  display: "flex",
  alignItems: "start",
  flexDirection: "column",
  justifyContent: "center",
  color: theme.textColor.primary,
  fontSize: theme.typography.caption.size,
  fontWeight: theme.typography.caption.weight,
  lineHeight: theme.typography.caption.lineHeight,

  [media.sm]: {
    gap: 12,
  },
  [media.xsm]: {
    gap: 8,
  },
}));

const ResultLabel = styled.span(({ theme }) => ({
  fontSize: theme.typography.title1.size,
  fontWeight: theme.typography.title1.weight,
  lineHeight: theme.typography.title1.lineHeight,
  whiteSpace: "nowrap",

  [media.xsm]: {
    fontSize: "20px",
    lineHeight: "20px",
    whiteSpace: "normal",
  },
}));

const ResultCount = styled.p({
  fontSize: 0,
  lineHeight: 1,
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
