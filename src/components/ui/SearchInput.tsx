import {
  type ChangeEvent,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type InputHTMLAttributes,
  type MouseEvent,
} from "react";
import styled from "@emotion/styled";
import { AnimatePresence } from "framer-motion";
import searchIconUrl from "@/assets/icons/icon-search.svg";
import clearIconUrl from "@/assets/icons/icon-search-record-close.svg";
import { RecentSearchList } from "@/components/book/RecentSearchList";

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  onClear?: () => void;
  recentSearches?: string[];
  onSelectRecentSearch?: (keyword: string) => void;
  onRemoveRecentSearch?: (keyword: string) => void;
};

function hasInputValue(value: SearchInputProps["value"]) {
  if (value == null) {
    return false;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (typeof value === "number") {
    return true;
  }

  return value.length > 0;
}

export function SearchInput({
  className,
  onBlur,
  onChange,
  onClear,
  onFocus,
  onRemoveRecentSearch,
  onSelectRecentSearch,
  recentSearches = [],
  value,
  ...props
}: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const orderedRecentSearches = useMemo(
    () => [...recentSearches].reverse(),
    [recentSearches],
  );

  const isPanelOpen = isFocused && orderedRecentSearches.length > 0;
  const canClear = hasInputValue(value) && typeof onClear === "function";

  function keepInputFocus(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
  }

  function handleInputFocus(event: FocusEvent<HTMLInputElement>) {
    setIsFocused(true);
    onFocus?.(event);
  }

  function handleInputBlur(event: FocusEvent<HTMLInputElement>) {
    const nextTarget = event.relatedTarget;
    if (
      nextTarget instanceof Node &&
      containerRef.current?.contains(nextTarget)
    ) {
      onBlur?.(event);
      return;
    }

    setIsFocused(false);
    onBlur?.(event);
  }

  function handleSelectRecentSearch(keyword: string) {
    onSelectRecentSearch?.(keyword);
    setIsFocused(false);
    inputRef.current?.blur();
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.value.length === 0 && orderedRecentSearches.length > 0) {
      setIsFocused(false);
    } else if (event.target.value.length > 0) {
      setIsFocused(true);
    }

    onChange?.(event);
  }

  function handleClearClick() {
    if (orderedRecentSearches.length > 0) {
      setIsFocused(false);
    }

    onClear?.();
  }

  return (
    <Container ref={containerRef} className={className}>
      <InputRow $open={isPanelOpen}>
        <SearchIcon src={searchIconUrl} alt="" />
        <SearchField
          ref={inputRef}
          value={value}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onChange={handleInputChange}
          {...props}
        />
        {canClear ? (
          <ClearButton
            type="button"
            aria-label="clear-search-input"
            onMouseDown={keepInputFocus}
            onClick={handleClearClick}
          >
            <ClearIcon src={clearIconUrl} alt="" />
          </ClearButton>
        ) : null}
      </InputRow>

      <AnimatePresence initial={false}>
        {isPanelOpen ? (
          <RecentSearchList
            recentSearches={orderedRecentSearches}
            onMouseDownItem={keepInputFocus}
            onSelectRecentSearch={handleSelectRecentSearch}
            onRemoveRecentSearch={onRemoveRecentSearch}
          />
        ) : null}
      </AnimatePresence>
    </Container>
  );
}

const Container = styled.div({
  zIndex: 40,
  width: "100%",
  position: "relative",
});

const InputRow = styled.div<{ $open: boolean }>(({ theme, $open }) => ({
  zIndex: 2,
  height: 40,
  width: "100%",
  display: "flex",
  overflow: "hidden",
  position: "relative",
  alignItems: "center",
  borderTopLeftRadius: theme.radius.xl,
  borderTopRightRadius: theme.radius.xl,
  backgroundColor: theme.color.lightgray,
  borderBottomLeftRadius: $open ? 0 : theme.radius.xl,
  borderBottomRightRadius: $open ? 0 : theme.radius.xl,
  transition:
    "border-bottom-left-radius 140ms ease, border-bottom-right-radius 140ms ease",
}));

const SearchIcon = styled.img({
  left: 10,
  width: 30,
  height: 30,
  padding: 5,
  top: "50%",
  position: "absolute",
  transform: "translateY(-50%)",
  pointerEvents: "none",
});

const SearchField = styled.input(({ theme }) => ({
  height: 40,
  width: "100%",
  border: "none",
  outline: "none",
  paddingLeft: 41,
  paddingRight: 40,
  backgroundColor: "transparent",
  color: theme.textColor.primary,
  transition: "box-shadow 200ms ease",
  fontSize: theme.typography.caption.size,
  fontWeight: theme.typography.caption.weight,
  lineHeight: theme.typography.caption.lineHeight,
  "&::placeholder": {
    color: theme.textColor.secondary,
    fontSize: theme.typography.caption.size,
    lineHeight: theme.typography.caption.lineHeight,
    fontWeight: theme.typography.caption.weight,
  },
}));

const IconButton = styled.button(({ theme }) => ({
  width: 24,
  height: 24,
  padding: 0,
  flexShrink: 0,
  border: "none",
  display: "flex",
  borderRadius: 9999,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "transparent",
  transition: "background-color 160ms ease",
  "&:hover": {
    backgroundColor: theme.color.gray80,
  },
}));

const ClearButton = styled(IconButton)({
  right: 10,
  top: "50%",
  position: "absolute",
  transform: "translateY(-50%)",
  ":hover": {
    backgroundColor: "transparent",
  },
});

const ClearIcon = styled.img({
  width: 16,
  height: 16,
});
