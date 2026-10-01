import * as API from "../../../../Core/Api/Auth/Logout"
import type { Result } from "../../../../Core/Data/Result"
import { ok } from "../../../../Core/Data/Result"
import type { AuthUser } from "../AuthApi"
import * as RefreshTokenRow from "../../Database/RefreshTokenRow"

export const contract = API.contract

export async function handler(
  currentUser: AuthUser,
  _params: API.BodyParams,
): Promise<Result<API.ErrorCode, API.Payload>> {
  await RefreshTokenRow.removeAllByUser(currentUser.id)

  return ok({})
}
