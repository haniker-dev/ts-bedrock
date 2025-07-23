import * as JD from "decoders"
import {
  responseDecoder,
  Api,
  NoUrlParams,
  noUrlParamsDecoder,
} from "../../Data/Api"
import { User, userDecoder } from "../../App/User"
import { Email, emailDecoder } from "../../Data/User/Email"
import { Password, passwordDecoder } from "../../App/User/Password"
import { AccessToken, accessTokenDecoder } from "../../App/User/AccessToken"
import {
  RefreshToken,
  refreshTokenDecoder,
} from "../../Data/Security/RefreshToken"

export type Contract = Api<
  "POST",
  "/login",
  NoUrlParams,
  BodyParams,
  ErrorCode,
  Payload
>

export type BodyParams = {
  email: Email
  password: Password
}

export type ErrorCode = "USER_NOT_FOUND" | "INVALID_PASSWORD"

export type Payload = {
  user: User
  accessToken: AccessToken
  refreshToken: RefreshToken
}

export const payloadDecoder: JD.Decoder<Payload> = JD.object({
  user: userDecoder,
  accessToken: accessTokenDecoder,
  refreshToken: refreshTokenDecoder,
})

export const errorCodeDecoder: JD.Decoder<ErrorCode> = JD.oneOf([
  "USER_NOT_FOUND",
  "INVALID_PASSWORD",
])

export const bodyParamsDecoder: JD.Decoder<BodyParams> = JD.object({
  email: emailDecoder,
  password: passwordDecoder,
})

export const contract: Contract = {
  method: "POST",
  route: "/login",
  urlDecoder: noUrlParamsDecoder,
  bodyDecoder: bodyParamsDecoder,
  responseDecoder: responseDecoder(errorCodeDecoder, payloadDecoder),
}
