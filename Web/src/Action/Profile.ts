import { Action, cmd, Cmd } from "../Action"
import { _AuthState, AuthState, State } from "../State"
import * as ProfileApi from "../Api/Auth/Profile"

// This onEnterRoute just for presentation purposes
export function onEnterRoute(authState: AuthState): [State, Cmd] {
  return [authState, cmd(ProfileApi.call().then(profileResponse))]
}

function profileResponse(response: ProfileApi.Response): Action {
  return (state) =>
    _AuthState((authState: AuthState) => {
      return response._t === "Left"
        ? [authState, cmd()]
        : [{ ...authState, profile: response.value.user }, cmd()]
    }, state)
}
