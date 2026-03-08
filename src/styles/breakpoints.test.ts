import { describe, expect, it } from "vitest";
import { breakpoints, media } from "./breakpoints";

describe("breakpoints", () => {
  it("defines responsive breakpoint values", () => {
    expect(breakpoints).toEqual({
      xsm: 360,
      sm: 768,
      md: 1024,
      lg: 1920,
    });
  });

  it("creates max-width media query strings", () => {
    expect(media.xsm).toBe("@media (max-width: 360px)");
    expect(media.sm).toBe("@media (max-width: 768px)");
    expect(media.md).toBe("@media (max-width: 1024px)");
    expect(media.lg).toBe("@media (max-width: 1920px)");
  });
});
