// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import { ThemeProvider } from "@emotion/react";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./Pagination";
import { theme } from "@/styles/tokens";

describe("Pagination", () => {
  it("총 페이지가 1이어도 이전/페이지 번호/다음을 렌더한다", () => {
    render(
      <ThemeProvider theme={theme}>
        <Pagination
          currentPage={1}
          totalPages={1}
          onPageChange={vi.fn()}
        />
      </ThemeProvider>,
    );

    expect(screen.getByText("이전")).toBeTruthy();
    expect(screen.getByText("1")).toBeTruthy();
    expect(screen.getByText("다음")).toBeTruthy();
  });
});
