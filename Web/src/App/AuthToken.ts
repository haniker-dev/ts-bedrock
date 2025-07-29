import { UserID, userIDDecoder } from "../../../Core/App/User/UserID"
import {
  AccessToken,
  accessTokenDecoder,
} from "../../../Core/App/User/AccessToken"
import { toString } from "../../../Core/Data/Security/JsonWebToken"
import {
  RefreshToken,
  unsafeToRefreshToken,
} from "../../../Core/Data/Security/RefreshToken"

export type AuthToken = {
  userID: UserID
  accessToken: AccessToken
  refreshToken: RefreshToken
}

// We obfuscate the keys for some security sake
const userIDKey = "_xu"
const accessTokenKey = "_xa"
const refreshTokenKey = "_xr"

export function set(authToken: AuthToken): void {
  localStorage.setItem(userIDKey, authToken.userID.unwrap())
  localStorage.setItem(accessTokenKey, toString(authToken.accessToken))
  localStorage.setItem(refreshTokenKey, authToken.refreshToken.unwrap())
}

export function get(): AuthToken | null {
  const [u, a, r] = [
    userIDDecoder.decode(localStorage.getItem(userIDKey)),
    accessTokenDecoder.decode(localStorage.getItem(accessTokenKey)),
    localStorage.getItem(refreshTokenKey),
  ]
  if (u.ok == false || a.ok == false || r == null) return null

  return {
    userID: u.value,
    accessToken: a.value,
    refreshToken: unsafeToRefreshToken(r),
  }
}

export function remove(): void {
  localStorage.removeItem(userIDKey)
  localStorage.removeItem(accessTokenKey)
  localStorage.removeItem(refreshTokenKey)
}
