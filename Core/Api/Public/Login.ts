import * as JD from "decoders"
import type { Api, NoUrlParams } from "../../Data/Api"
import { responseDecoder, noUrlParamsDecoder } from "../../Data/Api"
import type { User } from "../../App/User"
import { userDecoder } from "../../App/User"
import type { Email } from "../../Data/User/Email"
import { emailDecoder } from "../../Data/User/Email"
import type { Password } from "../../App/User/Password"
import { passwordDecoder } from "../../App/User/Password"
import type { AccessToken } from "../../App/User/AccessToken"
import { accessTokenDecoder } from "../../App/User/AccessToken"
import type { RefreshToken } from "../../Data/Security/RefreshToken"
import { refreshTokenDecoder } from "../../Data/Security/RefreshToken"

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
