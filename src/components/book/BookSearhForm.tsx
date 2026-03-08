import { useEffect, useEffectEvent, useRef, useState } from "react";
import styled from "@emotion/styled";
import type { SearchTarget } from "@/types/book";
import { BookDetailSearchPopup } from "./BookDetailSearchPopup";
import { SearchInput } from "@/components/ui/SearchInput";
import { Button } from "@/components/ui/Button";

type BookSearchFormProps = {
  defaultQuery: string;
  defaultTarget?: SearchTarget;
  recentSearches: string[];
  onSearch: (query: string) => void;
  onDetailedSearch: (query: string, target: SearchTarget) => void;
  onRemoveRecentSearch: (keyword: string) => void;
  onReset: () => void;
};

export function BookSearchForm({
  defaultQuery,
  defaultTarget,
  recentSearches,
  onSearch,
  onDetailedSearch,
  onRemoveRecentSearch,
  onReset,
}: BookSearchFormProps) {
  const [query, setQuery] = useState(defaultTarget ? "" : defaultQuery);
  const [detailQuery, setDetailQuery] = useState(defaultQuery);
  const [target, setTarget] = useState<SearchTarget>(defaultTarget ?? "title");
  const [popupOpen, setPopupOpen] = useState(false);
  const detailSearchWrapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (defaultTarget) {
      setQuery("");
      return;
    }

    setQuery(defaultQuery);
  }, [defaultQuery, defaultTarget]);

  useEffect(() => {
    if (defaultTarget) {
      setTarget(defaultTarget);
      setDetailQuery(defaultQuery);
      return;
    }

    setTarget("title");
    setDetailQuery("");
  }, [defaultQuery, defaultTarget]);

  const closePopup = useEffectEvent(() => {
    setPopupOpen(false);
  });

  useEffect(() => {
    if (!popupOpen) {
      return;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closePopup();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [popupOpen, closePopup]);

  useEffect(() => {
    if (!popupOpen) {
      return;
    }

    function handleDocumentMouseDown(event: MouseEvent) {
      const targetNode = event.target;
      if (!(targetNode instanceof Node)) {
        return;
      }

      if (detailSearchWrapRef.current?.contains(targetNode)) {
        return;
      }

      closePopup();
    }

    document.addEventListener("mousedown", handleDocumentMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleDocumentMouseDown);
    };
  }, [popupOpen, closePopup]);

  useEffect(() => {
    if (!popupOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
    };
  }, [popupOpen]);

  function submitSearch(keyword: string) {
    setTarget("title");
    setDetailQuery("");
    closePopup();
    onSearch(keyword.trim());
  }

  function submitDetailedSearch() {
    const normalizedQuery = detailQuery.trim();

    closePopup();
    onDetailedSearch(normalizedQuery, target);
  }

  function handleDetailQueryChange(nextQuery: string) {
    setDetailQuery(nextQuery);
    setQuery("");
  }

  function handleDetailTargetChange(nextTarget: SearchTarget) {
    setTarget(nextTarget);
    setQuery("");
  }

  return (
    <FormRoot>
      <Heading>도서 검색</Heading>
      <Row>
        <InputWrap>
          <SearchInput
            placeholder="검색어를 입력하세요"
            recentSearches={recentSearches}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== "Enter") {
                return;
              }

              if (event.nativeEvent.isComposing) {
                return;
              }

              event.preventDefault();
              submitSearch(event.currentTarget.value);
              event.currentTarget.blur();
            }}
            onSelectRecentSearch={(keyword) => {
              setQuery(keyword);
              submitSearch(keyword);
            }}
            onRemoveRecentSearch={onRemoveRecentSearch}
            onClear={() => {
              setQuery("");
              setTarget("title");
              setDetailQuery("");
              closePopup();
              onReset();
            }}
          />
        </InputWrap>

        <DetailSearchWrap ref={detailSearchWrapRef}>
          <DetailSearchButton
            variant="ghost"
            size="sm"
            onClick={() => setPopupOpen((previous) => !previous)}
          >
            상세검색
          </DetailSearchButton>

          <BookDetailSearchPopup
            open={popupOpen}
            query={detailQuery}
            target={target}
            onClose={closePopup}
            onSubmit={submitDetailedSearch}
            onQueryChange={handleDetailQueryChange}
            onTargetChange={handleDetailTargetChange}
          />
        </DetailSearchWrap>
      </Row>
    </FormRoot>
  );
}

const FormRoot = styled.div({
  gap: 24,
  width: "100%",
  maxWidth: 480,
  display: "grid",
});

const Heading = styled.h2(({ theme }) => ({
  color: "#1a1e27",
  fontSize: theme.typography.title2.size,
  fontWeight: theme.typography.title2.weight,
  lineHeight: theme.typography.title2.lineHeight,
}));

const Row = styled.div({
  gap: 12,
  display: "flex",
  alignItems: "center",
});

const InputWrap = styled.div({
  flex: 1,
  minWidth: 0,
});

const DetailSearchWrap = styled.div({
  flexShrink: 0,
  display: "flex",
  position: "relative",
  alignItems: "center",
});

const DetailSearchButton = styled(Button)(({ theme }) => ({
  height: 36,
  borderRadius: theme.radius.sm,
  color: theme.textColor.subtitle,
  fontSize: theme.typography.body2.size,
  transition: "background-color 180ms ease",
  fontWeight: theme.typography.body2.weight,
  lineHeight: theme.typography.body2.lineHeight,
  border: `1px solid ${theme.textColor.subtitle}`,

  "&:hover": {
    backgroundColor: "rgba(141, 148, 160, 0.1)",
  },
}));
