import { css } from "@emotion/css"
import { AuthState } from "../../State"
import { JSX } from "react"
import Header from "./Auth/Header"
import { theme, layoutSize } from "../Theme"

type Props = { authState: AuthState; Page: React.FC<{ authState: AuthState }> }
export function AuthLayout(props: Props): JSX.Element {
  const { authState, Page } = props

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerWrap}>
          <Header authState={authState} />
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.bodyWrap}>
          <Page authState={authState} />
        </div>
      </div>
    </div>
  )
}

const styles = {
  container: css({
    width: "100dvw",
    height: "100dvh",
    display: "flex",
    flexDirection: "column",
  }),
  header: css({
    display: "flex",
    justifyContent: "center",
    backgroundColor: theme.color.neutral0,
    position: "sticky",
  }),
  headerWrap: css({
    width: "100%",
    maxWidth: layoutSize.maxWidth,
  }),
  body: css({
    height: "100%",
    display: "flex",
    justifyContent: "center",
    overflowY: "auto",
    backgroundColor: theme.color.secondary20,
  }),
  bodyWrap: css({
    width: "100%",
    maxWidth: layoutSize.maxWidth,
  }),
}
