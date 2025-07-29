import { Action, cmd } from "../Action"
import {
  _UpdateProfileState,
  initUpdateProfileState,
} from "../State/UpdateProfile"
import * as FieldString from "../../../Core/Data/Form/FieldString"
import * as UpdateProfileApi from "../Api/Auth/UpdateProfile"
import * as RD from "../../../Core/Data/RemoteData"
import { _AuthState, AuthState } from "../State"

export function onChangeName(value: string): Action {
  return (state) =>
    _AuthState((authState: AuthState) => {
      const { name } = authState.updateProfile
      return [
        _UpdateProfileState(authState, {
          name: FieldString.changeAndParse(value, name),
        }),
        cmd(),
      ]
    }, state)
}

export function onChangeEmail(value: string): Action {
  return (state) =>
    _AuthState((authState: AuthState) => {
      const { email } = authState.updateProfile
      return [
        _UpdateProfileState(authState, {
          email: FieldString.changeAndParse(value, email),
        }),
        cmd(),
      ]
    }, state)
}

export function onChangeCurrentPassword(value: string): Action {
  return (state) =>
    _AuthState((authState: AuthState) => {
      const { currentPassword } = authState.updateProfile
      return [
        _UpdateProfileState(authState, {
          currentPassword: FieldString.changeAndParse(value, currentPassword),
        }),
        cmd(),
      ]
    }, state)
}

export function onChangeNewPassword(value: string): Action {
  return (state) =>
    _AuthState((authState: AuthState) => {
      const { newPassword } = authState.updateProfile
      return [
        _UpdateProfileState(authState, {
          newPassword: FieldString.changeAndParse(value, newPassword),
        }),
        cmd(),
      ]
    }, state)
}

export function onChangeConfirmPassword(value: string): Action {
  return (state) =>
    _AuthState((authState: AuthState) => {
      const { confirmPassword } = authState.updateProfile
      return [
        _UpdateProfileState(authState, {
          confirmPassword: FieldString.changeAndParse(value, confirmPassword),
        }),
        cmd(),
      ]
    }, state)
}

export function onSubmit(params: UpdateProfileApi.BodyParams): Action {
  return (state) =>
    _AuthState((authState: AuthState) => {
      return [
        _UpdateProfileState(authState, { updateResponse: RD.loading() }),
        cmd(UpdateProfileApi.call(params).then(onSubmitResponse)),
      ]
    }, state)
}

function onSubmitResponse(response: UpdateProfileApi.Response): Action {
  return (state) =>
    _AuthState((authState: AuthState) => {
      if (response._t === "Left") {
        return [
          _UpdateProfileState(authState, {
            updateResponse: RD.failure(response.error),
          }),
          cmd(),
        ]
      }

      const { user } = response.value
      return [
        _UpdateProfileState(
          { ...authState, profile: user },
          {
            ...initUpdateProfileState(user),
            updateResponse: RD.success(response.value),
          },
        ),
        cmd(),
      ]
    }, state)
}
