import type * as Express from "express"
import type { UrlRecord } from "../../../Core/Data/UrlToken"
import type { Result } from "../../../Core/Data/Result"
import { err, mapOk } from "../../../Core/Data/Result"
import {
  decodeParams,
  removeQuery,
  decoderErrorMessage,
  internalErrMessage,
  bodyParserErrorType,
  bodyParserTooLargeType,
  jsonBody,
  authOk200,
  authErr400,
  authInternalErr500,
  unauthorised,
} from "../Api"
import * as UserRow from "../Database/UserRow"
import type { Method } from "../../../Core/Data/Api"
import type {
  AuthApi,
  AuthApiError,
  AuthResponseJson,
} from "../../../Core/Data/Api/Auth"
import type { JwtPayload } from "../../../Core/App/User/AccessToken"
import * as AccessToken from "../App/AccessToken"

/**
 * AuthHandler receives AuthUser on top of PublicHandler
 * */
export type AuthHandler<P, E, T> = (
  authUser: AuthUser,
  params: P,
) => Promise<Result<E, T>>

export type AuthUser = UserRow.UserRow

export function authApi<
  ApiMethod extends Method,
  Route extends string,
  UrlParams extends UrlRecord<Route>,
  RequestBody,
  ErrorCode,
  Payload,
>(
  app: Express.Express,
  api: {
    contract: AuthApi<
      ApiMethod,
      Route,
      UrlParams,
      RequestBody,
      ErrorCode,
      Payload
    >
    handler: AuthHandler<UrlParams & RequestBody, ErrorCode, Payload>
  },
): void {
  const { contract, handler } = api
  const { method, route, urlDecoder, bodyDecoder } = contract
  const expressRoute = removeQuery(route)
  const handlerRunner = async (
    req: Express.Request,
    res: Express.Response<unknown>,
  ): Promise<void> => {
    const paramsResult = decodeParams(req, urlDecoder, bodyDecoder)
    if (paramsResult._t === "Err") {
      return authInternalErr500(
        res,
        paramsResult.error,
        decoderErrorMessage(req.query, paramsResult.error),
      )
    }

    return runAuthHandler(paramsResult.value, handler, req, res).catch(
      (error) =>
        authInternalErr500(
          res,
          error,
          internalErrMessage("API Uncaught Exception", req.query, error),
        ),
    )
  }

  switch (method) {
    case "GET":
      app.get(expressRoute, jsonBody, bodyErrorRunner, handlerRunner)
      break
    case "DELETE":
      app.delete(expressRoute, jsonBody, bodyErrorRunner, handlerRunner)
      break
    case "POST":
      app.post(expressRoute, jsonBody, bodyErrorRunner, handlerRunner)
      break
    case "PATCH":
      app.patch(expressRoute, jsonBody, bodyErrorRunner, handlerRunner)
      break
    case "PUT":
      app.put(expressRoute, jsonBody, bodyErrorRunner, handlerRunner)
      break
  }
}

// Express runs a handler as error middleware only when it declares
// four parameters, hence the unused _next
function bodyErrorRunner(
  error: unknown,
  req: Express.Request,
  res: Express.Response<unknown>,
  _next: Express.NextFunction,
): void {
  const errorType = bodyParserErrorType(error)
  return errorType === bodyParserTooLargeType
    ? authErr400<AuthApiError>(res, "PAYLOAD_TOO_LARGE")
    : authInternalErr500(
        res,
        errorType,
        internalErrMessage("Request Body Parse Failed", req.query, errorType),
      )
}

async function runAuthHandler<ErrorCode, Params, Payload>(
  params: Params,
  handler: AuthHandler<Params, ErrorCode, Payload>,
  req: Express.Request,
  res: Express.Response<AuthResponseJson<ErrorCode, Payload>>,
): Promise<void> {
  const jwtPayload = await verifyToken(req)
  if (jwtPayload._t === "Err") return unauthorised(res, jwtPayload.error)

  const { userID } = jwtPayload.value
  const user = await UserRow.getByID(userID)
  if (user == null) {
    return unauthorised(res, `Invalid user with id ${userID.unwrap()}`)
  }

  return handler(user, params)
    .then((result) => {
      return result._t === "Ok"
        ? authOk200(res, result.value)
        : authErr400(res, result.error)
    })
    .catch((error) => {
      return authInternalErr500(
        res,
        error,
        internalErrMessage("Handler Uncaught Exception", params, error),
      )
    })
}

async function verifyToken(
  req: Express.Request,
): Promise<Result<string, JwtPayload>> {
  const { authorization } = req.headers
  if (authorization == null || authorization.startsWith("Bearer ") === false) {
    return err(`Invalid authorization header: ${authorization}`)
  } else {
    const token = authorization.slice(7)
    return AccessToken.verify(token).then((result) => {
      return mapOk(result, (accessToken) => accessToken.unwrap())
    })
  }
}
