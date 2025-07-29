import { JSX } from "react"
import { css } from "@emotion/css"
import { color, font, theme } from "../Theme"

type Props = {
  value: string
  placeholder?: string
  onChange: (value: string) => void
  onBlur?: (value: string) => void
  disabled?: boolean
  invalid?: boolean
  changed?: boolean
  type?: "text" | "password" | "email" | "number" | "tel" | "url"
}
function View({
  value,
  placeholder,
  onChange,
  onBlur,
  disabled,
  invalid,
  changed,
  type,
}: Props): JSX.Element {
  const disabled_ = disabled || false
  const invalid_ = invalid || false
  const changed_ = changed || false
  return (
    <div className={styles.container(disabled_, invalid_, changed_)}>
      <input
        value={value}
        placeholder={placeholder}
        disabled={disabled_}
        onChange={(e) => {
          onChange(e.target.value)
        }}
        onBlur={(e) => {
          if (onBlur) onBlur(e.target.value)
        }}
        className={styles.input(disabled_, invalid_)}
        type={type}
      />
    </div>
  )
}

const styles = {
  container: (disabled: boolean, invalid: boolean, changed: boolean) =>
    css({
      display: "flex",
      gap: theme.s2,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: theme.br2,
      padding: theme.s2,
      background: disabled ? color.neutral20 : color.neutral0,
      border: `1px solid ${invalid ? color.semantics.error.red500 : changed ? color.semantics.warning.yellow500 : color.neutral100}`,
      boxSizing: "border-box",
    }),
  input: (disabled: boolean, invalid: boolean) =>
    css({
      ...font.regular14,
      width: "100%",
      border: "none",
      background: "none",
      outline: "none",
      color: invalid
        ? color.semantics.error.red500
        : disabled
          ? color.neutral300
          : color.neutral900,
      "::placeholder": {
        color: invalid ? color.semantics.error.red500 : color.neutral300,
      },
    }),
}

export default View
