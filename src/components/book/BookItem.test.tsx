import { isValidElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import type { Book } from "@/types/book";
import { BookItem } from "./BookItem";

const sampleBook: Book = {
  id: "book-1",
  isbn: "9781234567890",
  title: "테스트 도서",
  authors: ["홍길동"],
  publisher: "테스트 출판사",
  contents: "테스트 책 소개",
  salePrice: 12000,
  price: 15000,
  thumbnail: "",
  url: "https://example.com/book-1",
  status: "정상판매",
};

function countText(node: ReactNode, target: string): number {
  if (node == null || typeof node === "boolean") {
    return 0;
  }

  if (typeof node === "string") {
    return node === target ? 1 : 0;
  }

  if (typeof node === "number") {
    return String(node) === target ? 1 : 0;
  }

  if (Array.isArray(node)) {
    return node.reduce((sum, child) => sum + countText(child, target), 0);
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return countText(node.props.children, target);
  }

  return 0;
}

describe("BookItem", () => {
  it("상세보기 트리거 문구를 한 번만 렌더한다", () => {
    const element = BookItem({
      book: sampleBook,
      isFavorite: false,
      onToggleFavorite: vi.fn(),
    });

    expect(countText(element, "상세보기")).toBe(1);
  });
});

