/**
 * This file contains the common functions used to define API and handlers
 * You probably want to see /Api/AuthApi.ts or /Api/PublicApi.ts instead
 *
 */
import * as JD from "decoders"
import * as Express from "express"
import { md5 } from "pure-md5"
import { Err400, InternalErr500, Ok200 } from "../../Core/Data/Api"
import { Either, left, right } from "../../Core/Data/Either"
import { Annotation, fromDecodeResult } from "../../Core/Data/Decoder"
import * as Logger from "./Logger"
import {
  AuthApiError,
  AuthErr400,
  AuthInternalErr500,
  AuthOk200,
} from "../../Core/Data/Api/Auth"

export function removeQuery(route: string): string {
  return route.split("?")[0] || ""
}

/** An error thrown in a callback cannot be caught in the same closure
 * Hence, we have to wrapped the function itself in a try..catch
 * and return it as a higher-order function to be used as a callback
 ***/
export function catchCallback(
  fn: (req: Express.Request, res: Express.Response) => void,
) {
  return function (req: Express.Request, res: Express.Response) {
    try {
      return fn(req, res)
    } catch (error) {
      return internalErr500(
        res,
        error,
        internalErrMessage("API Uncaught Exception", req.query, error),
      )
    }
  }
}

export function decodeParams<UrlParams, RequestBody>(
  req: Express.Request,
  urlDecoder: JD.Decoder<UrlParams>,
  bodyDecoder: JD.Decoder<RequestBody>,
): Either<Annotation, UrlParams & RequestBody> {
  const urlResult = fromDecodeResult(
    urlDecoder.decode({ ...req.query, ...req.params }),
  )
  if (urlResult._t === "Left") return left(urlResult.error)

  const bodyResult = fromDecodeResult(bodyDecoder.decode(req.body))
  if (bodyResult._t === "Left") return left(bodyResult.error)

  return right({ ...urlResult.value, ...bodyResult.value })
}

export function decoderErrorMessage<P>(params: P, error: Annotation): string {
  return internalErrMessage(
    "Params Decoder Failed",
    params,
    JD.formatInline(error),
  )
}

export function internalErrMessage<E, P>(
  title: string,
  params: P,
  error: E,
): string {
  const errorMessages = [
    title,
    "Params: " + JSON.stringify(params),
    "Error: " + String(error),
  ]
  return errorMessages.join("\n")
}

export function ok200<D>(res: Express.Response<Ok200<D>>, data: D): void {
  res.status(200)
  res.json({ _t: "Ok", data })
  return
}
export function authOk200<D>(
  res: Express.Response<AuthOk200<D>>,
  data: D,
): void {
  res.status(200)
  res.json({ _t: "AuthOk", data })
  return
}

export function err400<E>(
  res: Express.Response<Err400<E>>,
  errorCode: E,
): void {
  res.status(400)
  res.json({ _t: "Err", code: errorCode })
  return
}
export function authErr400<E>(
  res: Express.Response<AuthErr400<E>>,
  errorCode: E,
): void {
  res.status(400)
  res.json({ _t: "AuthErr", code: errorCode })
  return
}

export function internalErr500(
  res: Express.Response<InternalErr500>,
  error: unknown,
  errorMessage: string,
): void {
  // Generate a unique id to send to user
  // so user can report this id for us to track the error
  const errorID = md5(errorMessage).slice(0, 9)
  Logger.error(`${errorID}: ${errorMessage}`)
  Logger.error(error)
  res.status(500)
  res.json({ _t: "ServerError", errorID })
  return
}
export function authInternalErr500(
  res: Express.Response<AuthInternalErr500>,
  error: unknown,
  errorMessage: string,
): void {
  // Generate a unique id to send to user
  // so user can report this id for us to track the error
  const errorID = md5(errorMessage).slice(0, 9)
  Logger.error(`${errorID}: ${errorMessage}`)
  Logger.error(error)
  res.status(500)
  res.json({ _t: "AuthServerError", errorID })
  return
}

// Specific response

export function unauthorised(
  res: Express.Response<AuthErr400<AuthApiError>>,
  errorMessage: string,
): void {
  Logger.error(`UNAUTHORISED: ${errorMessage}`)
  res.status(400)
  res.json({ _t: "AuthErr", code: "UNAUTHORISED" })
  return
}
