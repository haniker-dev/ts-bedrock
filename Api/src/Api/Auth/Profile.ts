import * as API from "../../../../Core/Api/Auth/Profile"
import { NoBodyParams } from "../../../../Core/Data/Api"
import { Either, right } from "../../../../Core/Data/Either"
import { AuthUser } from "../AuthApi"

export const contract = API.contract

export async function handler(
  user: AuthUser,
  _params: NoBodyParams,
): Promise<Either<null, API.Payload>> {
  return right({ user })
}
