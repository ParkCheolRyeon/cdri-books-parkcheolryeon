import { memo } from "react";
import styled from "@emotion/styled";
import { Button } from "./Button";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function buildPageNumbers(currentPage: number, totalPages: number) {
  const maxVisiblePages = 5;
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, start + maxVisiblePages - 1);
  const adjustedStart = Math.max(1, end - maxVisiblePages + 1);
  return Array.from(
    { length: end - adjustedStart + 1 },
    (_, index) => adjustedStart + index,
  );
}

export const Pagination = memo(function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const pages = buildPageNumbers(currentPage, totalPages);

  return (
    <Container>
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        style={{ padding: "6px 8px" }}
      >
        이전
      </Button>
      {pages.map((page) => (
        <Button
          key={page}
          variant={page === currentPage ? "primary" : "gray"}
          size="sm"
          onClick={() => onPageChange(page)}
          style={{ padding: "6px 8px" }}
        >
          {page}
        </Button>
      ))}
      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        다음
      </Button>
    </Container>
  );
});

const Container = styled.div({
  gap: 8,
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center",
});
