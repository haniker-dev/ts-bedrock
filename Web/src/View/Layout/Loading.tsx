import { css } from "@emotion/css"
import { color, font, theme } from "../Theme"
import { localImage } from "../ImageLocalSrc"
import { JSX } from "react"
import { spin } from "../Theme/Keyframe"

export function LoadingLayout(): JSX.Element {
  return (
    <div className={styles.loading}>
      <img
        className={styles.loadingImg}
        src={localImage.circleLoading.unwrap()}
      />
      <div className={styles.loadingText}>Loading...</div>
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
    animation: `${spin} linear 2s infinite`,
  }),
  loadingText: css({
    ...font.regularH4_24,
    color: color.secondary500,
  }),
}
