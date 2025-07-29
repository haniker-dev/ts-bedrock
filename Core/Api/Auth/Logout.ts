import { AuthApi, authResponseDecoder } from "../../Data/Api/Auth"
import {
  NoBodyParams,
  noBodyParamsDecoder,
  NoErrorCode,
  noErrorCodeDecoder,
  NoPayload,
  noPayloadDecoder,
  NoUrlParams,
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
