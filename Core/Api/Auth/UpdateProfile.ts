import * as JD from "decoders"
import type { User } from "../../App/User"
import { userDecoder } from "../../App/User"
import type { AuthApi } from "../../Data/Api/Auth"
import { authResponseDecoder } from "../../Data/Api/Auth"
import type { NoUrlParams } from "../../Data/Api"
import { noUrlParamsDecoder } from "../../Data/Api"
import type { Name } from "../../App/User/Name"
import { nameDecoder } from "../../App/User/Name"
import type { Email } from "../../Data/User/Email"
import { emailDecoder } from "../../Data/User/Email"
import type { Password } from "../../App/User/Password"
import { passwordDecoder } from "../../App/User/Password"
import type { Maybe } from "../../Data/Maybe"
import { maybeDecoder } from "../../Data/Maybe"

export type Contract = AuthApi<
  "PUT",
  "/update-profile",
  NoUrlParams,
  BodyParams,
  ErrorCode,
  Payload
>

export type BodyParams = {
  name: Name
  email: Email
  newPassword: Maybe<Password>
  currentPassword: Password
}
export type ErrorCode = "INVALID_PASSWORD" | "EMAIL_ALREADY_EXISTS"

export type Payload = {
  user: User
}

export const payloadDecoder: JD.Decoder<Payload> = JD.object({
  user: userDecoder,
})

export const errorCodeDecoder: JD.Decoder<ErrorCode> = JD.oneOf([
  "INVALID_PASSWORD",
  "EMAIL_ALREADY_EXISTS",
])

export const bodyParamsDecoder: JD.Decoder<BodyParams> = JD.object({
  name: nameDecoder,
  email: emailDecoder,
  newPassword: maybeDecoder(passwordDecoder),
  currentPassword: passwordDecoder,
})

export const contract: Contract = {
  method: "PUT",
  route: "/update-profile",
  urlDecoder: noUrlParamsDecoder,
  bodyDecoder: bodyParamsDecoder,
  responseDecoder: authResponseDecoder(errorCodeDecoder, payloadDecoder),
}
