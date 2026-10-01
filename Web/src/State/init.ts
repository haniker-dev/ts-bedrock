import type { Route } from "../Route"
import type { AuthState, State } from "../State"
import * as AuthToken from "../App/AuthToken"
import { initLoginState } from "./Login"
import type { User } from "../../../Core/App/User"
import { initUpdateProfileState } from "./UpdateProfile"

export function initState(route: Route): State {
  const token = AuthToken.get()
  return {
    _t: token == null ? "Public" : "LoadingAuth",
    route,
    login: initLoginState(),
  }
}

export function initAuthState(profile: User, state: State): AuthState {
  return {
    ...state,
    _t: "Auth",
    updateProfile: initUpdateProfileState(profile),
    profile,
  }
}
