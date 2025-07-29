/**
 * This file contains the common functions used to define API and handlers
 * You probably want to see /Api/AuthApi.ts or /Api/PublicApi.ts instead
 *
 */
import * as JD from "decoders"
import * as Logger from "./Logger"
import Env from "./Env"
import {
  HttpStatus,
  httpStatusDecoder,
  Method,
  ApiError as PublicApiError,
} from "../../Core/Data/Api"
import { AuthApiError } from "../../Core/Data/Api/Auth"
import { FetchResult } from "./Data/Fetch"
import { Either, left, right } from "../../Core/Data/Either"

/** For convenience, we merge public api response
 * and auth api response into one type
 */
export type ApiResponse<E, D> = Either<ApiError<E>, D>

/** For convenience, we merge public api error
 * and auth api error into one type
 */
export type ApiError<E> =
  | PublicApiError
  | AuthApiError
  | "SERVER_ERROR"
  | "NETWORK_ERROR"
  | "DECODE_ERROR"
  | E

export function apiErrorString<E>(
  error: ApiError<E>,
  fn: (e: E) => string,
): string {
  switch (error) {
    case "PAYLOAD_TOO_LARGE":
      return "Request payload is too large."
    case "UNAUTHORISED":
      return "Please log out and log in again to continue."
    case "SERVER_ERROR":
      return "Oops! Something went wrong with the server."
    case "NETWORK_ERROR":
      return "Internet is unavailable."
    case "DECODE_ERROR":
      return "Something is wrong with the server. Please try again later."
    default:
      return fn(error)
  }
}

/** A helper function to handle the fetch result
 * and decoder as per the response
 */
export function decodeFetchResult<T>(
  responseDecoder: (status: HttpStatus) => JD.Decoder<T>,
  fetchResult: FetchResult,
): Either<"SERVER_ERROR" | "NETWORK_ERROR" | "DECODE_ERROR", T> {
  if (fetchResult._t === "Left") {
    return left(fetchResult.error)
  }

  const { httpStatus, data } = fetchResult.value
  const httpStatusM = httpStatusDecoder.decode(httpStatus)
  if (httpStatusM.ok === false) {
    Logger.error(`Unknown HTTP status: ${httpStatus}`)
    return left("SERVER_ERROR")
  }

  const payloadM = responseDecoder(httpStatusM.value).decode(data)
  if (payloadM.ok === false) {
    Logger.error(payloadM.error.text)
    return left("DECODE_ERROR")
  }

  return right(payloadM.value)
}

export function makePath(endpoint: string): string {
  return `${location.protocol}//${Env.API_HOST}${endpoint}`
}

export function jsonHeaders(headers: Headers): Headers {
  headers.append("Content-Type", "application/json")
  return headers
}

export function isNoBodyMethod(method: Method): boolean {
  return ["GET", "DELETE"].includes(method)
}
