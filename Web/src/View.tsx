import { JSX } from "react"
import { AuthState, State } from "./State"
import { LoadingLayout } from "./View/Layout/Loading"
import { EmptyLayout } from "./View/Layout/Empty"
import { AuthLayout } from "./View/Layout/Auth"
import ProfilePage from "./Page/Profile"
import NotFoundPage from "./Page/NotFound"
import LoginPage from "./Page/Login"
import HomePage from "./Page/Home"

type Props = { state: State }
export default function View(props: Props): JSX.Element {
  const { state } = props
  if (state._t === "LoadingAuth") {
    return <LoadingLayout />
  }

  switch (state.route._t) {
    case "Home":
      return withAuthLayout(state, HomePage)
    case "NotFound":
      return (
        <EmptyLayout
          state={state}
          Page={NotFoundPage}
        />
      )
    case "Login":
      return (
        <EmptyLayout
          state={state}
          Page={LoginPage}
        />
      )
    case "Profile":
      return withAuthLayout(state, ProfilePage)
  }
}

function withAuthLayout(
  state: State,
  Page: React.FC<{ authState: AuthState }>,
): JSX.Element {
  return state._t !== "Auth" ? (
    <EmptyLayout
      state={state}
      Page={LoginPage}
    />
  ) : (
    <AuthLayout
      authState={state}
      Page={Page}
    />
  )
}
