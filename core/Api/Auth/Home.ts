import * as JD from "decoders"
import { User, userDecoder } from "../../App/User"
import { AuthApi, authResponseDecoder } from "../../Data/Api/Auth"
import {
  NoBodyParams,
  noBodyParamsDecoder,
  NoErrorCode,
  noErrorCodeDecoder,
  NoUrlParams,
  noUrlParamsDecoder,
} from "../../Data/Api"

export type Contract = AuthApi<
  "GET",
  "/home",
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
  route: "/home",
  urlDecoder: noUrlParamsDecoder,
  bodyDecoder: noBodyParamsDecoder,
  responseDecoder: authResponseDecoder(noErrorCodeDecoder, payloadDecoder),
}
