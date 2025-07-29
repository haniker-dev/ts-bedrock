import { cmd, type Cmd } from "../Action"
import { parseRoute } from "../Route"
import { _AuthState, _PublicState, State } from "../State"
import * as ProfileAction from "./Profile"

export function onUrlChange(s: State): [State, Cmd] {
  const route = parseRoute(window.location.href)
  const state = _PublicState(s, { route })

  switch (route._t) {
    case "Home":
    case "Login":
    case "NotFound":
      return [state, cmd()]
    case "Profile":
      return _AuthState(ProfileAction.onEnterRoute, state)
  }
}
