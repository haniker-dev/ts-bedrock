import * as Express from "express"
import { UrlRecord } from "../../../Core/Data/UrlToken"
import { Either, left, mapEither } from "../../../Core/Data/Either"
import {
  internalErr500,
  decodeParams,
  removeQuery,
  catchCallback,
  decoderErrorMessage,
  internalErrMessage,
  authOk200,
  authErr400,
  authInternalErr500,
  unauthorised,
} from "../Api"
import * as UserRow from "../Database/UserRow"
import { Method } from "../../../Core/Data/Api"
import { AuthApi, AuthResponseJson } from "../../../Core/Data/Api/Auth"
import { JwtPayload } from "../../../Core/App/User/AccessToken"
import * as AccessToken from "../App/AccessToken"

/**
 * AuthHandler receives AuthUser on top of PublicHandler
 * */
export type AuthHandler<P, E, T> = (
  authUser: AuthUser,
  params: P,
) => Promise<Either<E, T>>

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
  contract: AuthApi<
    ApiMethod,
    Route,
    UrlParams,
    RequestBody,
    ErrorCode,
    Payload
  >,
  handler: AuthHandler<UrlParams & RequestBody, ErrorCode, Payload>,
): void {
  const { method, route, urlDecoder, bodyDecoder } = contract
  const expressRoute = removeQuery(route)
  const handlerRunner = catchCallback((req, res) => {
    const paramsResult = decodeParams(req, urlDecoder, bodyDecoder)
    return paramsResult._t === "Right"
      ? runAuthHandler(paramsResult.value, handler, req, res)
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

async function runAuthHandler<ErrorCode, Params, Payload>(
  params: Params,
  handler: AuthHandler<Params, ErrorCode, Payload>,
  req: Express.Request,
  res: Express.Response<AuthResponseJson<ErrorCode, Payload>>,
): Promise<void> {
  const jwtPayload = await verifyToken(req)
  if (jwtPayload._t === "Left") return unauthorised(res, jwtPayload.error)

  const { userID } = jwtPayload.value
  const user = await UserRow.getByID(userID)
  if (user == null) {
    return unauthorised(res, `Invalid user with id ${userID.unwrap()}`)
  }

  return handler(user, params)
    .then((result) => {
      return result._t === "Right"
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
): Promise<Either<string, JwtPayload>> {
  const { authorization } = req.headers
  if (authorization == null || authorization.startsWith("Bearer ") === false) {
    return left(`Invalid authorization header: ${authorization}`)
  } else {
    const token = authorization.slice(7)
    return AccessToken.verify(token).then((result) => {
      return mapEither(result, (accessToken) => accessToken.unwrap())
    })
  }
}
