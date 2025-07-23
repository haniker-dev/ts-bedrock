import { JSX } from "react"
import { css } from "@emotion/css"
import { color, font, theme } from "../Theme"

type Theme = "Blue" | "Red" | "Green"

type Props = {
  theme_: Theme
  size: "L" | "M" | "S"
  label: string
  onClick: () => void
  disabled?: boolean
}
function View({ size, theme_, label, onClick, disabled }: Props): JSX.Element {
  const disabled_ = disabled || false
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={styles.container(size, theme_, disabled_)}
    >
      <div className={styles.label(size, theme_, disabled_)}>{label}</div>
    </button>
  )
}

function containerStyle(size: Props["size"]) {
  switch (size) {
    case "L":
      return {
        height: theme.s13,
        gap: theme.s2,
        borderRadius: theme.br4,
        padding: `0 ${theme.s5}`,
      }
    case "M":
      return {
        height: theme.s10,
        gap: theme.s2,
        borderRadius: theme.br3,
        padding: `0 ${theme.s4}`,
      }
    case "S":
      return {
        height: theme.s8,
        gap: theme.s1,
        borderRadius: theme.br2,
        padding: `0 ${theme.s4}`,
      }
  }
}

function containerColor(theme_: Props["theme_"], disabled: boolean) {
  if (disabled) return { backgroundColor: color.neutral50 }

  switch (theme_) {
    case "Blue":
      return { backgroundColor: color.secondary500 }
    case "Red":
      return { backgroundColor: color.semantics.error.red500 }
    case "Green":
      return { backgroundColor: color.semantics.success.green500 }
  }
}

function labelFont(size: Props["size"]) {
  switch (size) {
    case "L":
      return font.medium17
    case "M":
      return font.medium14
    case "S":
      return font.medium12
  }
}

function labelColor(theme_: Props["theme_"], disabled: boolean) {
  if (disabled) return { color: color.neutral200 }

  switch (theme_) {
    case "Blue":
      return { color: color.neutral0 }
    case "Red":
      return { color: color.neutral0 }
    case "Green":
      return { color: color.neutral0 }
  }
}

const styles = {
  container: (
    size: Props["size"],
    theme_: Props["theme_"],
    disabled: boolean,
  ) =>
    css({
      width: "100%",
      background: "none",
      border: "none",
      boxSizing: "border-box",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      cursor: disabled ? "unset" : "pointer",
      ...containerStyle(size),
      ...containerColor(theme_, disabled),
    }),
  label: (size: Props["size"], theme_: Props["theme_"], disabled: boolean) =>
    css({
      ...labelFont(size),
      ...labelColor(theme_, disabled),
      lineHeight: "100%",
      whiteSpace: "nowrap",
    }),
}

export default View
