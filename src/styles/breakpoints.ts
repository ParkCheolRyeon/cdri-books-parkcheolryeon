export const breakpoints = {
  xsm: 360,
  sm: 768,
  md: 1024,
  lg: 1920,
} as const;

export const media = {
  xsm: `@media (max-width: ${breakpoints.xsm}px)`,
  sm: `@media (max-width: ${breakpoints.sm}px)`,
  md: `@media (max-width: ${breakpoints.md}px)`,
  lg: `@media (max-width: ${breakpoints.lg}px)`,
} as const;
