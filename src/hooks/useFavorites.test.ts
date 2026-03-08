// @vitest-environment jsdom
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach } from "vitest";
import { useFavorites } from "./useFavorites";
import type { Book } from "@/types/book";

const mockBook: Book = {
  id: "test-book-1",
  isbn: "1234567890",
  title: "Test Book",
  authors: ["Author"],
  publisher: "Publisher",
  contents: "Contents",
  salePrice: 10000,
  price: 12000,
  thumbnail: "",
  url: "https://example.com",
  status: "",
};

const mockBook2: Book = {
  ...mockBook,
  id: "test-book-2",
  title: "Test Book 2",
};

describe("useFavorites", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("isFavorite returns false for non-favorited book", () => {
    const { result } = renderHook(() => useFavorites());
    expect(result.current.isFavorite("non-existent")).toBe(false);
  });

  it("isFavorite returns true after toggling favorite", () => {
    const { result } = renderHook(() => useFavorites());
    act(() => {
      result.current.toggleFavorite(mockBook);
    });
    expect(result.current.isFavorite(mockBook.id)).toBe(true);
  });

  it("isFavorite returns false after toggling favorite twice", () => {
    const { result } = renderHook(() => useFavorites());
    act(() => {
      result.current.toggleFavorite(mockBook);
    });
    act(() => {
      result.current.toggleFavorite(mockBook);
    });
    expect(result.current.isFavorite(mockBook.id)).toBe(false);
  });

  it("isFavorite is stable reference when favorites don't change", () => {
    const { result, rerender } = renderHook(() => useFavorites());
    const first = result.current.isFavorite;
    rerender();
    expect(result.current.isFavorite).toBe(first);
  });
});
