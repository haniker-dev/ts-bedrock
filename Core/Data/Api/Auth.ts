import * as JD from "decoders"
import { HttpStatus, Method } from "../Api"
import { UrlRecord } from "../UrlToken"

/** Auth APIs requires a request header "authorization: Bearer <JWT-Token>"
 * and returns AuthResponseJson
 */
export type AuthApi<
  M extends Method,
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  RequestBody,
  ErrorCode,
  Payload,
> = {
  method: M
  route: Route
  urlDecoder: JD.Decoder<UrlParams>
  bodyDecoder: JD.Decoder<RequestBody>
  responseDecoder: (
    status: HttpStatus,
  ) => JD.Decoder<AuthResponseJson<ErrorCode, Payload>>
}

export type AuthApiError = "UNAUTHORISED"
export type AuthOk200<D> = { _t: "AuthOk"; data: D }
export type AuthErr400<E> = { _t: "AuthErr"; code: E | AuthApiError }
export type AuthInternalErr500 = { _t: "AuthServerError"; errorID: string }
export type AuthResponseJson<E, D> =
  | AuthOk200<D>
  | AuthErr400<E>
  | AuthInternalErr500

export function authResponseDecoder<E, T>(
  errorDecoder: JD.Decoder<E>,
  dataDecoder: JD.Decoder<T>,
) {
  return function (status: HttpStatus): JD.Decoder<AuthResponseJson<E, T>> {
    switch (status) {
      case 200:
        return authOk200Decoder(dataDecoder)
      case 400:
        return authErr400Decoder(errorDecoder)
      case 500:
        return authInternalErr500Decoder()
    }
  }
}

export function authOk200Decoder<D>(
  dataDecoder: JD.Decoder<D>,
): JD.Decoder<AuthOk200<D>> {
  return JD.object({
    _t: JD.constant("AuthOk"),
    data: JD.unknown, // Issue here https://github.com/nvie/decoders/issues/930
  }).transform(({ _t, data }) => ({ _t, data: dataDecoder.verify(data) }))
}

export function authErr400Decoder<E>(
  errorDecoder: JD.Decoder<E>,
): JD.Decoder<AuthErr400<E>> {
  return JD.object({
    _t: JD.constant("AuthErr"),
    code: JD.unknown, // Issue here https://github.com/nvie/decoders/issues/930
  }).transform(({ _t, code }) => ({
    _t,
    code: JD.either(authApiErrorDecoder, errorDecoder).verify(code),
  }))
}

export function authInternalErr500Decoder(): JD.Decoder<AuthInternalErr500> {
  return JD.object({
    _t: JD.constant("AuthServerError"),
    errorID: JD.string,
  })
}

export const authApiErrorDecoder: JD.Decoder<AuthApiError> = JD.oneOf([
  "UNAUTHORISED",
])
