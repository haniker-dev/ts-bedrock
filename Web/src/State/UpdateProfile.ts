import type * as UpdateProfileApi from "../../../Core/Api/Auth/UpdateProfile"
import type { User } from "../../../Core/App/User"
import type { ErrorName, Name } from "../../../Core/App/User/Name"
import { createNameE } from "../../../Core/App/User/Name"
import type { ErrorPassword, Password } from "../../../Core/App/User/Password"
import { createPasswordE } from "../../../Core/App/User/Password"
import * as FieldString from "../../../Core/Data/Form/FieldString"
import type { Maybe } from "../../../Core/Data/Maybe"
import * as RD from "../../../Core/Data/RemoteData"
import type { Email, ErrorEmail } from "../../../Core/Data/User/Email"
import { createEmailE } from "../../../Core/Data/User/Email"
import type { ApiError } from "../Api"
import type { AuthState } from "../State"

export type UpdateProfileState = {
  name: FieldString.FieldString<ErrorName, Name>
  email: FieldString.FieldString<ErrorEmail, Email>
  newPassword: FieldString.FieldString<ErrorPassword, Password>
  confirmPassword: FieldString.FieldString<ErrorPassword, Password>
  currentPassword: FieldString.FieldString<ErrorPassword, Password>
  updateResponse: RD.RemoteData<
    ApiError<UpdateProfileApi.ErrorCode>,
    UpdateProfileApi.Payload
  >
}

export function initUpdateProfileState(profile: User): UpdateProfileState {
  return {
    name: FieldString.parse(
      FieldString.init(profile.name.unwrap(), createNameE),
    ),
    email: FieldString.parse(
      FieldString.init(profile.email.unwrap(), createEmailE),
    ),
    newPassword: FieldString.init("", createPasswordE),
    confirmPassword: FieldString.init("", createPasswordE),
    currentPassword: FieldString.init("", createPasswordE),
    updateResponse: RD.notAsked(),
  }
}

export function _UpdateProfileState(
  authState: AuthState,
  updateProfile: Partial<UpdateProfileState>,
): AuthState {
  return {
    ...authState,
    updateProfile: { ...authState.updateProfile, ...updateProfile },
  }
}

export function parseNotValidate(
  updateProfileState: UpdateProfileState,
): Maybe<UpdateProfileApi.BodyParams> {
  const { name, email, newPassword, confirmPassword, currentPassword } =
    updateProfileState
  const nameM = FieldString.value(name)
  const emailM = FieldString.value(email)
  const currentPasswordM = FieldString.value(currentPassword)
  const newPasswordM = FieldString.value(newPassword)
  const confirmPasswordM = FieldString.value(confirmPassword)

  if (nameM == null || emailM == null || currentPasswordM == null) {
    return null
  }

  const params: UpdateProfileApi.BodyParams = {
    name: nameM,
    email: emailM,
    currentPassword: currentPasswordM,
    newPassword: null,
  }

  const newPasswordStr = newPassword.unwrap()
  const confirmPasswordStr = confirmPassword.unwrap()
  if (newPasswordStr !== "" || confirmPasswordStr !== "") {
    return newPasswordM == null ||
      confirmPasswordM == null ||
      newPasswordM.unwrap() !== confirmPasswordM.unwrap()
      ? null
      : { ...params, newPassword: newPasswordM }
  } else {
    return params
  }
}
