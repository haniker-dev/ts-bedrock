import * as JD from "decoders"
import { User, userDecoder } from "../../App/User"
import { AuthApi, authResponseDecoder } from "../../Data/Api/Auth"
import { NoUrlParams, noUrlParamsDecoder } from "../../Data/Api"
import { Name, nameDecoder } from "../../App/User/Name"
import { Email, emailDecoder } from "../../Data/User/Email"
import { Password, passwordDecoder } from "../../App/User/Password"
import { Maybe, maybeDecoder } from "../../Data/Maybe"

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
