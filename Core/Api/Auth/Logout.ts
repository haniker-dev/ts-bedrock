import type { AuthApi } from "../../Data/Api/Auth"
import { authResponseDecoder } from "../../Data/Api/Auth"
import type {
  NoBodyParams,
  NoErrorCode,
  NoPayload,
  NoUrlParams,
} from "../../Data/Api"
import {
  noBodyParamsDecoder,
  noErrorCodeDecoder,
  noPayloadDecoder,
  noUrlParamsDecoder,
} from "../../Data/Api"

/** Logs out ALL sessions of a user
 * We don't show any error if logout somehow fails
 * **/
export type Contract = AuthApi<
  "POST",
  "/logout",
  NoUrlParams,
  NoBodyParams,
  ErrorCode,
  Payload
>

export type BodyParams = NoBodyParams
export type Payload = NoPayload
export type ErrorCode = NoErrorCode

export const contract: Contract = {
  method: "POST",
  route: "/logout",
  urlDecoder: noUrlParamsDecoder,
  bodyDecoder: noBodyParamsDecoder,
  responseDecoder: authResponseDecoder(noErrorCodeDecoder, noPayloadDecoder),
}
