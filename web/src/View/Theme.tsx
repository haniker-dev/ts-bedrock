import { Breakpoint } from "./Theme/Breakpoint"
import { Color } from "./Theme/Color"
import { Font } from "./Theme/Font"
import { Space } from "./Theme/Space"

export const bp = Breakpoint
export const color = Color
export const font = Font
export const space = Space

/** A giant object that contains all the theme values */
export const theme = {
  ...space,
  bp,
  color,
  font,
}

export const layoutSize = { maxWidth: 1140 }
