import * as JD from "decoders"
import { responseDecoder, Api } from "../Data/Api"
import { Timestamp, timestampDecoder } from "../Data/Time/Timestamp"
import { User, userDecoder } from "../App/User"

export type Contract = Api<
  "POST",
  "/sample/:pathVar/page?queryVar=:queryVar",
  UrlParams,
  BodyParams,
  ErrorCode,
  Payload
>

export type UrlParams = {
  pathVar: "PATH1" | "PATH2"
  queryVar: "QUERY1" | "QUERY2"
}

export type BodyParams = {
  loadFrom: Timestamp
}

export type ErrorCode = "INVALID_FUTURE_TIMESTAMP"

export type Payload = {
  user: User
}

export const urlParamsDecoder: JD.Decoder<UrlParams> = JD.object({
  pathVar: JD.oneOf(["PATH1", "PATH2"]),
  queryVar: JD.oneOf(["QUERY1", "QUERY2"]),
})

export const payloadDecoder: JD.Decoder<Payload> = JD.object({
  user: userDecoder,
})

export const errorCodeDecoder: JD.Decoder<ErrorCode> = JD.oneOf([
  "INVALID_FUTURE_TIMESTAMP",
])

export const bodyParamsDecoder: JD.Decoder<BodyParams> = JD.object({
  loadFrom: timestampDecoder,
})

export const contract: Contract = {
  method: "POST",
  route: "/sample/:pathVar/page?queryVar=:queryVar",
  urlDecoder: urlParamsDecoder,
  bodyDecoder: bodyParamsDecoder,
  responseDecoder: responseDecoder(errorCodeDecoder, payloadDecoder),
}
