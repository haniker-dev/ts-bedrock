import * as API from "../../../../Core/Api/Auth/Profile"
import type { NoBodyParams } from "../../../../Core/Data/Api"
import type { Result } from "../../../../Core/Data/Result"
import { ok } from "../../../../Core/Data/Result"
import type { AuthUser } from "../AuthApi"

export const contract = API.contract

export async function handler(
  user: AuthUser,
  _params: NoBodyParams,
): Promise<Result<null, API.Payload>> {
  return ok({ user })
}
