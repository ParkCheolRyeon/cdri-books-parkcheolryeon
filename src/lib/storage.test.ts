import { afterEach, describe, expect, it, vi } from "vitest";
import {
  pushRecentSearch,
  readStorage,
  removeStorage,
  writeStorage,
} from "./storage";

function createMockStorage() {
  const values = new Map<string, string>();
  return {
    getItem: vi.fn((key: string) => values.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      values.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      values.delete(key);
    }),
  };
}

function withWindow(
  localStorage: ReturnType<typeof createMockStorage>,
  callback: () => void,
) {
  const previousWindow = (globalThis as { window?: unknown }).window;
  (globalThis as { window: unknown }).window = { localStorage };

  try {
    callback();
  } finally {
    if (typeof previousWindow === "undefined") {
      delete (globalThis as { window?: unknown }).window;
    } else {
      (globalThis as { window: unknown }).window = previousWindow;
    }
  }
}

afterEach(() => {
  delete (globalThis as { window?: unknown }).window;
});

describe("readStorage", () => {
  it("window가 없으면 fallback을 반환한다", () => {
    expect(readStorage("favorites", ["fallback"])).toEqual(["fallback"]);
  });

  it("JSON 파싱에 실패하면 fallback을 반환한다", () => {
    const localStorage = createMockStorage();
    localStorage.getItem.mockReturnValueOnce("{invalid");

    withWindow(localStorage, () => {
      expect(readStorage("favorites", ["fallback"])).toEqual(["fallback"]);
    });
  });
});

describe("writeStorage/removeStorage", () => {
  it("localStorage에 직렬화하여 쓰고 삭제한다", () => {
    const localStorage = createMockStorage();

    withWindow(localStorage, () => {
      writeStorage("recent", ["a", "b"]);
      removeStorage("recent");
    });

    expect(localStorage.setItem).toHaveBeenCalledWith("recent", '["a","b"]');
    expect(localStorage.removeItem).toHaveBeenCalledWith("recent");
  });
});

describe("pushRecentSearch", () => {
  it("trim + 중복 제거 + 최대 8개 유지 규칙을 적용한다", () => {
    const initial = ["a", "b", "c", "d", "e", "f", "g", "h"];
    expect(pushRecentSearch(initial, " b ")).toEqual([
      "a",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "b",
    ]);
    expect(pushRecentSearch(initial, "new")).toEqual([
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "new",
    ]);
  });
});
