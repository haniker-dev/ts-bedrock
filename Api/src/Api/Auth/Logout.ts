import * as API from "../../../../Core/Api/Auth/Logout"
import { Either, right } from "../../../../Core/Data/Either"
import { AuthUser } from "../AuthApi"
import * as RefreshTokenRow from "../../Database/RefreshTokenRow"

export const contract = API.contract

export async function handler(
  currentUser: AuthUser,
  _params: API.BodyParams,
): Promise<Either<API.ErrorCode, API.Payload>> {
  await RefreshTokenRow.removeAllByUser(currentUser.id)

  return right({})
}
