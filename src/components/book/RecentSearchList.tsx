import type { MouseEvent } from "react";
import styled from "@emotion/styled";
import { motion } from "framer-motion";
import clearIconUrl from "@/assets/icons/icon-search-record-close.svg";

type RecentSearchListProps = {
  recentSearches: string[];
  onSelectRecentSearch?: (keyword: string) => void;
  onRemoveRecentSearch?: (keyword: string) => void;
  onMouseDownItem?: (event: MouseEvent<HTMLButtonElement>) => void;
};

export function RecentSearchList({
  recentSearches,
  onSelectRecentSearch,
  onRemoveRecentSearch,
  onMouseDownItem,
}: RecentSearchListProps) {
  return (
    <HistoryPanel
      key="search-history-panel"
      initial={{ opacity: 0, scaleY: 0.98 }}
      animate={{ opacity: 1, scaleY: 1 }}
      exit={{ opacity: 0, scaleY: 0.98 }}
      transition={{ duration: 0.14, ease: "easeOut" }}
    >
      <HistoryList>
        {recentSearches.map((keyword) => (
          <HistoryRow key={keyword}>
            <HistoryTextButton
              type="button"
              onMouseDown={onMouseDownItem}
              onClick={() => onSelectRecentSearch?.(keyword)}
            >
              {keyword}
            </HistoryTextButton>
            <RemoveButton
              type="button"
              aria-label="remove-recent-search"
              onMouseDown={onMouseDownItem}
              onClick={() => onRemoveRecentSearch?.(keyword)}
            >
              <ClearIcon src={clearIconUrl} alt="" />
            </RemoveButton>
          </HistoryRow>
        ))}
      </HistoryList>
    </HistoryPanel>
  );
}

const HistoryPanel = styled(motion.div)(({ theme }) => ({
  top: 40,
  left: 0,
  right: 0,
  zIndex: 3,
  overflow: "clip",
  position: "absolute",
  transformOrigin: "top",
  boxShadow: theme.shadow.floating,
  backgroundColor: theme.color.lightgray,
  borderBottomLeftRadius: theme.radius.lg,
  borderBottomRightRadius: theme.radius.lg,
}));

const HistoryList = styled.div({
  gap: 4,
  display: "flex",
  padding: "10px 8px",
  flexDirection: "column",
});

const HistoryRow = styled.div({
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
});

const HistoryTextButton = styled.button(({ theme }) => ({
  flex: 1,
  border: "none",
  cursor: "pointer",
  textAlign: "left",
  overflow: "hidden",
  padding: "8px 10px",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  borderRadius: theme.radius.xs,
  backgroundColor: "transparent",
  color: theme.textColor.secondary,
  fontSize: theme.typography.caption.size,
  fontWeight: theme.typography.caption.weight,
  lineHeight: theme.typography.caption.lineHeight,
  transition: "background-color 160ms ease, color 160ms ease",
  "&:hover": {
    color: theme.textColor.primary,
    backgroundColor: theme.color.gray60,
  },
}));

const RemoveButton = styled.button(({}) => ({
  width: 24,
  height: 24,
  padding: 4,
  flexShrink: 0,
  border: "none",
  display: "flex",
  cursor: "pointer",
  borderRadius: 9999,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "transparent",
  transition: "background-color 160ms ease",
  "&:hover": {
    backgroundColor: "transparent",
  },
}));

const ClearIcon = styled.img({
  width: 16,
  height: 16,
});
