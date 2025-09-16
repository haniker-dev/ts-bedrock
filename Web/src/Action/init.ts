import { Action, cmd, Cmd } from "../Action"
import * as ProfileApi from "../Api/Auth/Profile"
import { State } from "../State"
import * as AuthToken from "../App/AuthToken"
import { onUrlChange } from "./Route"
import { initAuthState } from "../State/init"

export function initCmd(): Cmd {
  const authToken = AuthToken.get()
  return authToken == null ? initPublicCmd() : initAuthCmd()
}

function initPublicCmd(): Cmd {
  return cmd()
}

function initAuthCmd(): Cmd {
  return cmd(ProfileApi.call().then(profileResponse))
}

function profileResponse(response: ProfileApi.Response): Action {
  return (state: State) => {
    if (response._t === "Err") {
      return [{ ...state, _t: "Public" }, cmd()]
    }
    const authState = initAuthState(response.value.user, state)

    // We call the onUrlChange function
    // to reinitialize the state of the application
    // since we have a new AuthState
    return onUrlChange(authState)
  }
}
