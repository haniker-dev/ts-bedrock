import * as LoginApi from "../../../Core/Api/Public/Login"
import {
  createPasswordE,
  ErrorPassword,
  Password,
} from "../../../Core/App/User/Password"
import * as FieldString from "../../../Core/Data/Form/FieldString"
import { Maybe } from "../../../Core/Data/Maybe"
import * as RD from "../../../Core/Data/RemoteData"
import { createEmailE, Email, ErrorEmail } from "../../../Core/Data/User/Email"
import { ApiError } from "../Api"
import type { State } from "../State"

export type LoginState = {
  email: FieldString.FieldString<ErrorEmail, Email>
  password: FieldString.FieldString<ErrorPassword, Password>
  loginResponse: RD.RemoteData<ApiError<LoginApi.ErrorCode>, LoginApi.Payload>
}

export function initLoginState(): LoginState {
  return {
    email: FieldString.init("", createEmailE),
    password: FieldString.init("", createPasswordE),
    loginResponse: RD.notAsked(),
  }
}

export function _LoginState(state: State, login: Partial<LoginState>): State {
  return { ...state, login: { ...state.login, ...login } }
}

export function parseNotValidate(
  loginState: LoginState,
): Maybe<LoginApi.BodyParams> {
  const { email, password } = loginState
  const emailM = FieldString.value(email)
  const passwordM = FieldString.value(password)

  return emailM == null || passwordM == null
    ? null
    : { email: emailM, password: passwordM }
}
