import { contract } from "../../../../Core/Api/Public/RefreshToken"
import { Either, left, right } from "../../../../Core/Data/Either"
import { Nat900 } from "../../../../Core/Data/Number/Nat"
import * as Queue from "../../../../Core/Data/Queue/AggregateQueue"
import { expiringWithin } from "../../../../Core/Data/Security/JsonWebToken"
import * as AuthToken from "../../App/AuthToken"
import { publicApi } from "../PublicApi"

/**
 * Request a new access token using the refresh token
 * if the current access token is expired/expiring soon
 * otherwise, return the current access token
 *
 * The function will ignore repeated calls while it is processing
 * This is necessary to prevent overwriting of newly issued tokens
 */
export const requestNewAccessToken = Queue.create(_requestNewAccessToken)

/**
 * The error codes are handled differently
 * as the context varies greatly
 * Basically we should not log the user out if there is no network
 */
export type ErrorCode =
  | "NETWORK_ERROR" /** Client has a network error so we should retry */
  | "SERVER_ERROR" /** Server has an unknown error so we should retry */
  | "MISSING_AUTH_TOKEN" /** The Auth Token is not found in local storage */
  | "INVALID" /** Refresh token is invalid */

export async function _requestNewAccessToken(): Promise<
  Either<ErrorCode, AuthToken.AuthToken>
> {
  const authToken = AuthToken.get()
  if (authToken == null) return left("MISSING_AUTH_TOKEN")

  const { accessToken } = authToken
  if (expiringWithin(Nat900, accessToken) === false) {
    return right(authToken)
  }

  const response = await publicApi(
    contract,
    {},
    {
      userID: authToken.userID,
      refreshToken: authToken.refreshToken,
    },
  )

  if (response._t === "Left") {
    switch (response.error) {
      case "PAYLOAD_TOO_LARGE":
      case "UNAUTHORISED":
      case "INVALID":
        AuthToken.remove()
        return left("INVALID")
      case "SERVER_ERROR":
      case "DECODE_ERROR":
        return left("SERVER_ERROR")
      case "NETWORK_ERROR":
        return left("NETWORK_ERROR")
    }
  } else {
    const newAuthToken = {
      userID: authToken.userID,
      accessToken: response.value.accessToken,
      refreshToken: response.value.refreshToken,
    }

    AuthToken.set(newAuthToken)
    return right(newAuthToken)
  }
}
