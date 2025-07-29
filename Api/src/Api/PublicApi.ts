import * as Express from "express"
import { UrlRecord } from "../../../Core/Data/UrlToken"
import { Either } from "../../../Core/Data/Either"
import { Api, Method, ResponseJson } from "../../../Core/Data/Api"
import {
  internalErr500,
  decodeParams,
  removeQuery,
  catchCallback,
  decoderErrorMessage,
  err400,
  internalErrMessage,
  ok200,
} from "../Api"

/** Handler type is a "pure" function that takes any P as params
 * and returns a Promise that resolves to Either<E, T>
 * It is deliberately decoupled from ExpressJS
 * or any other server package so that it is easy to test and
 * allows reusing with other codes
 * */
export type PublicHandler<P, E, T> = (params: P) => Promise<Either<E, T>>

export function publicApi<
  ApiMethod extends Method,
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  RequestBody,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  contract: Api<ApiMethod, Route, UrlParams, RequestBody, ErrorCode, Payload>,
  handler: PublicHandler<UrlParams & RequestBody, ErrorCode, Payload>,
): void {
  const { method, route, urlDecoder, bodyDecoder } = contract
  const expressRoute = removeQuery(route)
  const handlerRunner = catchCallback((req, res) => {
    const paramsResult = decodeParams(req, urlDecoder, bodyDecoder)
    return paramsResult._t === "Right"
      ? runPublicHandler(paramsResult.value, handler, res)
      : internalErr500(
          res,
          paramsResult.error,
          decoderErrorMessage(req.query, paramsResult.error),
        )
  })

  switch (method) {
    case "GET":
      app.get(expressRoute, handlerRunner)
      break
    case "DELETE":
      app.delete(expressRoute, handlerRunner)
      break
    case "POST":
      app.post(expressRoute, handlerRunner)
      break
    case "PATCH":
      app.patch(expressRoute, handlerRunner)
      break
    case "PUT":
      app.put(expressRoute, handlerRunner)
      break
  }
}

async function runPublicHandler<ErrorCode, Params, Payload>(
  params: Params,
  handler: PublicHandler<Params, ErrorCode, Payload>,
  res: Express.Response<ResponseJson<ErrorCode, Payload>>,
): Promise<void> {
  return handler(params)
    .then((result) => {
      return result._t === "Right"
        ? ok200(res, result.value)
        : err400(res, result.error)
    })
    .catch((error) => {
      return internalErr500(
        res,
        error,
        internalErrMessage("Handler Uncaught Exception", params, error),
      )
    })
}
