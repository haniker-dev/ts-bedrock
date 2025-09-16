import * as API from "../../../../Core/Api/Auth/Home"
import { NoBodyParams } from "../../../../Core/Data/Api"
import { Result, ok } from "../../../../Core/Data/Result"
import { AuthUser } from "../AuthApi"

export const contract = API.contract

export async function handler(
  user: AuthUser,
  _params: NoBodyParams,
): Promise<Result<null, API.Payload>> {
  return ok({ user })
}
