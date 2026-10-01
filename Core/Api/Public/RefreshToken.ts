import * as JD from "decoders"
import type { Api, NoUrlParams } from "../../Data/Api"
import { noUrlParamsDecoder, responseDecoder } from "../../Data/Api"
import type { User } from "../../App/User"
import { userDecoder } from "../../App/User"
import type { UserID } from "../../App/User/UserID"
import { userIDDecoder } from "../../App/User/UserID"
import type { RefreshToken } from "../../Data/Security/RefreshToken"
import { refreshTokenDecoder } from "../../Data/Security/RefreshToken"
import type { AccessToken } from "../../App/User/AccessToken"
import { accessTokenDecoder } from "../../App/User/AccessToken"

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
