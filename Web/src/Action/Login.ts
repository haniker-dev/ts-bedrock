import { Action, cmd, perform } from "../Action"
import { _LoginState } from "../State/Login"
import * as LoginApi from "../Api/Public/Login"
import * as LogoutApi from "../Api/Auth/Logout"
import * as RD from "../../../Core/Data/RemoteData"
import * as AuthToken from "../App/AuthToken"
import { navigateTo, toRoute } from "../Route"
import { initAuthState, initState } from "../State/init"
import * as FieldString from "../../../Core/Data/Form/FieldString"

export function onChangeEmail(value: string): Action {
  return (state) => {
    const { email } = state.login
    return [
      _LoginState(state, { email: FieldString.changeAndParse(value, email) }),
      cmd(),
    ]
  }
}

export function onChangePassword(value: string): Action {
  return (state) => {
    const { password } = state.login
    return [
      _LoginState(state, {
        password: FieldString.changeAndParse(value, password),
      }),
      cmd(),
    ]
  }
}

export function logout(): Action {
  return (state) => {
    return [state, cmd(LogoutApi.call().then(AuthToken.remove).then(onLogout))]
  }
}

function onLogout(): Action {
  return (_state) => {
    return [initState(toRoute("Login", { redirect: null })), cmd()]
  }
}

export function onSubmit(params: LoginApi.BodyParams): Action {
  return (state) => {
    return [
      _LoginState(state, { loginResponse: RD.loading() }),
      cmd(LoginApi.call(params).then(onSubmitResponse)),
    ]
  }
}

function onSubmitResponse(response: LoginApi.Response): Action {
  return (state) => {
    if (response._t === "Err") {
      return [
        _LoginState(state, {
          loginResponse: RD.failure(response.error),
        }),
        cmd(),
      ]
    }

    const { user, accessToken, refreshToken } = response.value

    AuthToken.set({
      userID: user.id,
      accessToken,
      refreshToken,
    })

    return [
      _LoginState(initAuthState(user, state), {
        loginResponse: RD.success(response.value),
      }),
      cmd(perform(navigateTo(toRoute("Home", {})))),
    ]
  }
}
