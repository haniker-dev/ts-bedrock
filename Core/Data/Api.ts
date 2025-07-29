import * as JD from "decoders"
import { UrlRecord } from "./UrlToken"

/** Base type to describe an API endpoint
 * You can use this for public APIs
 * but you would probably use AuthApi for authenticated APIs
 * or create your own AdminApi from this
 */
export type Api<
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
  ) => JD.Decoder<ResponseJson<ErrorCode, Payload>>
}

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
export type HttpStatus = 200 | 400 | 500

export type ApiError = "PAYLOAD_TOO_LARGE"
export type Ok200<D> = { _t: "Ok"; data: D }
export type Err400<E> = { _t: "Err"; code: E | ApiError }
export type InternalErr500 = { _t: "ServerError"; errorID: string }
export type ResponseJson<E, D> = Ok200<D> | Err400<E> | InternalErr500

export type NoUrlParams = Record<string, never>
export type NoBodyParams = Record<string, never>
export type NoErrorCode = null
export type NoPayload = Record<string, never>

export function responseDecoder<E, T>(
  errorDecoder: JD.Decoder<E>,
  dataDecoder: JD.Decoder<T>,
) {
  return function (status: HttpStatus): JD.Decoder<ResponseJson<E, T>> {
    switch (status) {
      case 200:
        return ok200Decoder(dataDecoder)
      case 400:
        return err400Decoder(errorDecoder)
      case 500:
        return internalErr500Decoder()
    }
  }
}

export function ok200Decoder<D>(
  dataDecoder: JD.Decoder<D>,
): JD.Decoder<Ok200<D>> {
  return JD.object({
    _t: JD.constant("Ok"),
    data: JD.unknown, // Issue here https://github.com/nvie/decoders/issues/930
  }).transform(({ _t, data }) => ({ _t, data: dataDecoder.verify(data) }))
}

export function err400Decoder<E>(
  errorDecoder: JD.Decoder<E>,
): JD.Decoder<Err400<E>> {
  return JD.object({
    _t: JD.constant("Err"),
    code: JD.unknown, // Issue here https://github.com/nvie/decoders/issues/930
  }).transform(({ _t, code }) => ({
    _t,
    code: JD.either(apiErrorDecoder, errorDecoder).verify(code),
  }))
}

export const apiErrorDecoder: JD.Decoder<ApiError> = JD.oneOf([
  "PAYLOAD_TOO_LARGE",
])

export function internalErr500Decoder(): JD.Decoder<InternalErr500> {
  return JD.object({
    _t: JD.constant("ServerError"),
    errorID: JD.string,
  })
}

export const httpStatusDecoder: JD.Decoder<HttpStatus> = JD.oneOf([
  200, 400, 500,
])

export const noUrlParamsDecoder: JD.Decoder<NoUrlParams> = JD.always({})
export const noBodyParamsDecoder: JD.Decoder<NoBodyParams> = JD.always({})
export const noErrorCodeDecoder: JD.Decoder<NoErrorCode> = JD.null_
export const noPayloadDecoder: JD.Decoder<NoPayload> = JD.always({})
