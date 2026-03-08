import { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { AnimatePresence, motion } from "framer-motion";
import popupCloseIconUrl from "@/assets/icons/icon-popup-close.png";
import arrowIconUrl from "@/assets/icons/icon-arrow.svg";
import type { SearchTarget } from "@/types/book";
import { Button } from "@/components/ui/Button";

type BookDetailSearchPopupProps = {
  open: boolean;
  query: string;
  target: SearchTarget;
  onClose: () => void;
  onSubmit: () => void;
  onQueryChange: (query: string) => void;
  onTargetChange: (target: SearchTarget) => void;
};

const targetOptions = [
  { label: "제목", value: "title" },
  { label: "저자명", value: "authors" },
  { label: "출판사", value: "publisher" },
] satisfies Array<{ label: string; value: SearchTarget }>;

function getTargetLabel(target: SearchTarget) {
  return (
    targetOptions.find((option) => option.value === target)?.label ?? "제목"
  );
}

export function BookDetailSearchPopup({
  open,
  query,
  target,
  onClose,
  onSubmit,
  onQueryChange,
  onTargetChange,
}: BookDetailSearchPopupProps) {
  const [targetOptionsOpen, setTargetOptionsOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setTargetOptionsOpen(false);
    }
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <PopupRoot
          initial={{ opacity: 0, y: -6, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.98 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          <CloseButton
            type="button"
            aria-label="close-detail-search"
            onClick={onClose}
          >
            <CloseIcon src={popupCloseIconUrl} alt="" />
          </CloseButton>

          <PopupContent>
            <Row>
              <TargetField>
                <TargetButton
                  type="button"
                  onClick={() => setTargetOptionsOpen((previous) => !previous)}
                >
                  <span>{getTargetLabel(target)}</span>
                  <ArrowIcon
                    src={arrowIconUrl}
                    alt=""
                    animate={{ rotate: targetOptionsOpen ? 180 : 0 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                  />
                </TargetButton>

                <AnimatePresence>
                  {targetOptionsOpen ? (
                    <TargetOptions
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.14, ease: "easeOut" }}
                    >
                      {targetOptions
                        .filter((option) => option.value !== target)
                        .map((option) => (
                          <TargetOption
                            key={option.value}
                            type="button"
                            onClick={() => {
                              onTargetChange(option.value);
                              setTargetOptionsOpen(false);
                            }}
                          >
                            {option.label}
                          </TargetOption>
                        ))}
                    </TargetOptions>
                  ) : null}
                </AnimatePresence>
              </TargetField>

              <DetailInput
                placeholder="검색어 입력"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter") {
                    return;
                  }

                  if (event.nativeEvent.isComposing) {
                    return;
                  }

                  event.preventDefault();
                  onSubmit();
                }}
              />
            </Row>

            <SubmitButton size="full" onClick={onSubmit}>
              검색하기
            </SubmitButton>
          </PopupContent>
        </PopupRoot>
      ) : null}
    </AnimatePresence>
  );
}

const PopupRoot = styled(motion.div)(({ theme }) => ({
  zIndex: 30,
  width: 360,
  left: "50%",
  display: "grid",
  marginLeft: -180,
  position: "absolute",
  top: "calc(100% + 1rem)",
  padding: "44px 24px 36px",
  borderRadius: theme.radius.sm,
  backgroundColor: theme.color.white,
  boxShadow: "0 4px 14px 6px rgba(151, 151, 151, 0.15)",
}));

const CloseButton = styled.button({
  top: 8,
  right: 8,
  width: 20,
  padding: 0,
  height: 20,
  border: "none",
  display: "flex",
  cursor: "pointer",
  position: "absolute",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "transparent",
});

const CloseIcon = styled.img({
  width: 12,
  height: 12,
});

const PopupContent = styled.div({
  gap: 16,
  display: "grid",
});

const Row = styled.div({
  gap: 4,
  display: "flex",
  alignItems: "flex-start",
});

const TargetField = styled.div({
  width: 100,
  flexShrink: 0,
  position: "relative",
});

const TargetButton = styled.button(({ theme }) => ({
  gap: 8,
  height: 36,
  width: "100%",
  border: "none",
  display: "flex",
  padding: "0 8px",
  cursor: "pointer",
  textAlign: "left",
  alignItems: "center",
  color: theme.textColor.primary,
  backgroundColor: "transparent",
  justifyContent: "space-between",
  fontSize: theme.typography.body2Bold.size,
  fontWeight: theme.typography.body2Bold.weight,
  lineHeight: theme.typography.body2Bold.lineHeight,
  borderBottom: `1px solid ${theme.color.borderSoft}`,
}));

const ArrowIcon = styled(motion.img)({
  width: 16,
  height: 8,
  opacity: 0.5,
});

const TargetOptions = styled(motion.div)(({ theme }) => ({
  top: 40,
  left: 0,
  width: 100,
  zIndex: 30,
  display: "grid",
  overflow: "hidden",
  position: "absolute",
  backgroundColor: theme.color.white,
  boxShadow: "0 1px 3px rgba(0, 0, 0, 0.12)",
}));

const TargetOption = styled.button(({ theme }) => ({
  height: 32,
  width: "100%",
  border: "none",
  display: "flex",
  padding: "0 8px",
  cursor: "pointer",
  textAlign: "left",
  alignItems: "center",
  backgroundColor: "transparent",
  color: theme.textColor.subtitle,
  fontSize: theme.typography.caption.size,
  transition: "background-color 160ms ease",
  fontWeight: theme.typography.caption.weight,
  lineHeight: theme.typography.caption.lineHeight,

  "&:hover": {
    backgroundColor: theme.color.lightgray,
  },
}));

const DetailInput = styled.input(({ theme }) => ({
  width: 208,
  height: 36,
  paddingLeft: 8,
  border: "none",
  outline: "none",
  color: theme.textColor.primary,
  fontSize: theme.typography.caption.size,
  fontWeight: theme.typography.caption.weight,
  lineHeight: theme.typography.caption.lineHeight,
  borderBottom: `1px solid ${theme.color.primary}`,

  "&::placeholder": {
    color: theme.textColor.subtitle,
    fontSize: theme.typography.caption.size,
    fontWeight: theme.typography.caption.weight,
    lineHeight: theme.typography.caption.lineHeight,
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  height: 36,
  fontSize: theme.typography.caption.size,
  fontWeight: theme.typography.caption.weight,
  lineHeight: theme.typography.caption.lineHeight,
}));
