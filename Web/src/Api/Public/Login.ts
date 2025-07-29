import { publicApi, apiErrorString, ApiError, ApiResponse } from "../PublicApi"
import {
  contract,
  ErrorCode,
  Payload,
  BodyParams,
} from "../../../../Core/Api/Public/Login"

export type { ErrorCode, Payload, BodyParams }
export type Response = ApiResponse<ErrorCode, Payload>

export const paramsDecoder = contract.bodyDecoder

export async function call(params: BodyParams): Promise<Response> {
  return publicApi(contract, {}, params)
}

export function errorString(code: ApiError<ErrorCode>): string {
  return apiErrorString(code, (errorCode) => {
    switch (errorCode) {
      case "USER_NOT_FOUND":
        return "User is not found."
      case "INVALID_PASSWORD":
        return "Password is incorrect. Please try again."
    }
  })
}
