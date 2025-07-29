import * as JD from "decoders"
import {
  Api,
  NoUrlParams,
  noUrlParamsDecoder,
  responseDecoder,
} from "../../Data/Api"
import { User, userDecoder } from "../../App/User"
import { UserID, userIDDecoder } from "../../App/User/UserID"
import {
  RefreshToken,
  refreshTokenDecoder,
} from "../../Data/Security/RefreshToken"
import { AccessToken, accessTokenDecoder } from "../../App/User/AccessToken"

/**
 * NOTE Client-side MUST update the local user with this returned user
 * as credentials as the user's data/access/profile may have changed
 * API: Don't show too much error to reduce information to hackers
 * WARN This is a public Api as the AccessToken may have expired
 **/
export type Contract = Api<
  "POST",
  "/refresh-token",
  NoUrlParams,
  BodyParams,
  ErrorCode,
  Payload
>

export type BodyParams = {
  userID: UserID // Public API so we need userID in body
  refreshToken: RefreshToken
}

export type Payload = {
  user: User
  accessToken: AccessToken
  refreshToken: RefreshToken
}

export type ErrorCode = "INVALID"

export const contract: Contract = {
  method: "POST",
  route: "/refresh-token",
  urlDecoder: noUrlParamsDecoder,
  bodyDecoder: JD.object({
    userID: userIDDecoder,
    refreshToken: refreshTokenDecoder,
  }),
  responseDecoder: responseDecoder(
    JD.oneOf(["INVALID"]),
    JD.object({
      user: userDecoder,
      accessToken: accessTokenDecoder,
      refreshToken: refreshTokenDecoder,
    }),
  ),
}
