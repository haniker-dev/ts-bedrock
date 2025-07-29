import * as API from "../../../../Core/Api/Auth/UpdateProfile"
import { Either, left, right } from "../../../../Core/Data/Either"
import { AuthUser } from "../AuthApi"
import * as Hash from "../../Data/Hash"
import * as UserRow from "../../Database/UserRow"

export const contract = API.contract

export async function handler(
  user: AuthUser,
  params: API.BodyParams,
): Promise<Either<API.ErrorCode, API.Payload>> {
  const { email, name, currentPassword, newPassword } = params

  const isValidPassword = await Hash.verify(
    currentPassword.unwrap(),
    user.password,
  )
  if (isValidPassword === false) return left("INVALID_PASSWORD")

  const existedEmail = await UserRow.getByEmail(email)
  if (existedEmail != null && existedEmail.id.unwrap() !== user.id.unwrap()) {
    return left("EMAIL_ALREADY_EXISTS")
  }

  const newHashedPassword =
    newPassword != null ? await Hash.issue(newPassword.unwrap()) : null

  return right({
    user: await UserRow.update(user.id, {
      name,
      email,
      newHashedPassword,
    }),
  })
}
