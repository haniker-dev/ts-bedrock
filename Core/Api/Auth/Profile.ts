import * as JD from "decoders"
import type { User } from "../../App/User"
import { userDecoder } from "../../App/User"
import type { AuthApi } from "../../Data/Api/Auth"
import { authResponseDecoder } from "../../Data/Api/Auth"
import type { NoBodyParams, NoErrorCode, NoUrlParams } from "../../Data/Api"
import {
  noBodyParamsDecoder,
  noErrorCodeDecoder,
  noUrlParamsDecoder,
} from "../../Data/Api"

export type Contract = AuthApi<
  "GET",
  "/profile",
  NoUrlParams,
  NoBodyParams,
  NoErrorCode,
  Payload
>

export type BodyParams = NoBodyParams
export type ErrorCode = NoErrorCode

export type Payload = {
  user: User
}

export const payloadDecoder: JD.Decoder<Payload> = JD.object({
  user: userDecoder,
})

export const contract: Contract = {
  method: "GET",
  route: "/profile",
  urlDecoder: noUrlParamsDecoder,
  bodyDecoder: noBodyParamsDecoder,
  responseDecoder: authResponseDecoder(noErrorCodeDecoder, payloadDecoder),
}
