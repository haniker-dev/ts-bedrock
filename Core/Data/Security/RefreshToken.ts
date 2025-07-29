import * as JD from "decoders"
import { Opaque, jsonValueCreate } from "../Opaque"
import { v6 } from "uuid"

const key: unique symbol = Symbol()
/** Internally it is just a random string using UUID **/
export type RefreshToken = Opaque<string, typeof key>

export function createRefreshToken(): RefreshToken {
  return jsonValueCreate<string, typeof key>(key)(v6())
}

/** For client-side where we store the refresh token as string in local storage **/
export function unsafeToRefreshToken(s: string): RefreshToken {
  return _create(s)
}

export const refreshTokenDecoder: JD.Decoder<RefreshToken> =
  JD.string.transform(_create)

function _create(s: string): RefreshToken {
  return jsonValueCreate<string, typeof key>(key)(s)
}
