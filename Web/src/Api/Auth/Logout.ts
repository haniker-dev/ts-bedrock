import type { ApiError, ApiResponse } from "../AuthApi"
import { authApi, apiErrorString } from "../AuthApi"
import type { ErrorCode, Payload } from "../../../../Core/Api/Auth/Logout"
import { contract } from "../../../../Core/Api/Auth/Logout"

export type { ErrorCode, Payload }
export type Response = ApiResponse<ErrorCode, Payload>

export async function call(): Promise<Response> {
  return authApi(contract, {}, {})
}

export function errorString(code: ApiError<ErrorCode>): string {
  return apiErrorString(code, (errorCode) => {
    switch (errorCode) {
      case null:
        // Impossible case
        return "An error occurred."
    }
  })
}
