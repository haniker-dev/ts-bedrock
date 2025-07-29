import * as API from "../../../../Core/Api/Public/Login"
import { Either, left, right } from "../../../../Core/Data/Either"
import * as UserRow from "../../Database/UserRow"
import * as RefreshTokenRow from "../../Database/RefreshTokenRow"
import * as Hash from "../../Data/Hash"
import * as AccessToken from "../../App/AccessToken"
import { toUser } from "../../App/User"

export const contract = API.contract

export async function handler(
  params: API.BodyParams,
): Promise<Either<API.ErrorCode, API.Payload>> {
  const { email, password } = params

  const userRow = await UserRow.getByEmail(email)
  if (userRow == null) {
    return left("USER_NOT_FOUND")
  }

  const isValidPassword = await Hash.verify(password.unwrap(), userRow.password)
  if (isValidPassword === false) return left("INVALID_PASSWORD")

  return right(await loginPayload(userRow))
}

/**
 * Exported for other handlers to use such as register
 */
export async function loginPayload(
  userRow: UserRow.UserRow,
): Promise<API.Payload> {
  const user = toUser(userRow)
  const [accessToken, refreshToken] = await Promise.all([
    AccessToken.issue(userRow.id),
    RefreshTokenRow.create(userRow.id),
  ])

  return { user, accessToken, refreshToken }
}
