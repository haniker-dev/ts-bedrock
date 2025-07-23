import { JSX } from "react"
import { css } from "@emotion/css"
import { State } from "../State"
import { color, font, theme } from "../View/Theme"

export type Props = { state: State }
export default function NotFoundPage(_props: Props): JSX.Element {
  return (
    <div className={styles.loading}>
      <div className={styles.loadingText}>NotFound</div>
    </div>
  )
}

const styles = {
  loading: css({
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100dvw",
    height: "100dvh",
    overflow: "hidden",
  }),
  loadingImg: css({
    maxWidth: theme.s82,
  }),
  loadingText: css({
    ...font.regular17,
    color: color.secondary500,
  }),
}
