import { css } from "@emotion/css"

// @emotion/css does not export css function parameter directly
// so we have to coax it out this way
type CSSInterpolation = Parameters<typeof css>[0]

export const Breakpoint = {
  sm: (a: CSSInterpolation) => ({
    "@media (min-width: 640px)": a,
  }),
  md: (a: CSSInterpolation) => ({
    "@media (min-width: 768px)": a,
  }),
  lg: (a: CSSInterpolation) => ({
    "@media (min-width: 1024px)": a,
  }),
  xl: (a: CSSInterpolation) => ({
    "@media (min-width: 1280px)": a,
  }),
}
