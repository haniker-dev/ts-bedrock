import * as API from "../../../../core/Api/Auth/Logout"
import { Either, right } from "../../../../core/Data/Either"
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
