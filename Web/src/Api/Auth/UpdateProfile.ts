import { authApi, apiErrorString, ApiError, ApiResponse } from "../AuthApi"
import {
  contract,
  ErrorCode,
  Payload,
  BodyParams,
} from "../../../../Core/Api/Auth/UpdateProfile"

export type { ErrorCode, Payload, BodyParams }
export type Response = ApiResponse<ErrorCode, Payload>

export const paramsDecoder = contract.bodyDecoder

export async function call(params: BodyParams): Promise<Response> {
  return authApi(contract, {}, params)
}

export function errorString(code: ApiError<ErrorCode>): string {
  return apiErrorString(code, (errorCode) => {
    switch (errorCode) {
      case "INVALID_PASSWORD":
        return "Password is incorrect. Please try again."
      case "EMAIL_ALREADY_EXISTS":
        return "Email is already in use."
    }
  })
}
