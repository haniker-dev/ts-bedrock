import type * as JD from "decoders"
import * as jose from "jose"
import { jwtVerify } from "jose"
import ENV from "../Env"
import type { Result } from "../../../Core/Data/Result"
import { ok, err } from "../../../Core/Data/Result"
import * as Logger from "../Logger"
import type { UserID } from "../../../Core/App/User/UserID"
import type { AccessToken } from "../../../Core/App/User/AccessToken"
import { accessTokenDecoder } from "../../../Core/App/User/AccessToken"
import {
  addMillisecond,
  createNow,
  toDate,
} from "../../../Core/Data/Time/Timestamp"
import { fromHour } from "../../../Core/Data/Time/Millisecond"
import { Hour1 } from "../../../Core/Data/Time/Hour"

const jwt_config = {
  // HS256 = HMAC 256-bits which is "fastest"
  // Make sure secret string is at least 256 bit which is 64 characters
  // Ref: https://fusionauth.io/articles/tokens/building-a-secure-jwt
  algorithm: "HS256",
  secret: new TextEncoder().encode(ENV.JWT_SECRET),
  lifetime: Hour1,
}

export async function issue(userID: UserID): Promise<AccessToken> {
  // Jose can only sign with JSON object
  const payloadJSON: JD.JSONObject = { userID: userID.unwrap() }
  const expiresAt = addMillisecond(createNow(), fromHour(jwt_config.lifetime))
  const signer = new jose.SignJWT(payloadJSON)
    .setProtectedHeader({ alg: jwt_config.algorithm })
    .setExpirationTime(toDate(expiresAt))

  return signer
    .sign(jwt_config.secret)
    .then((token) => accessTokenDecoder.verify(token))
    .catch((error) => {
      Logger.error(`jwt issue error: ${error}`)
      throw new Error(`jwt issue error: ${error}`)
    })
}

export async function verify(
  token: string,
): Promise<Result<string, AccessToken>> {
  return jwtVerify(token, jwt_config.secret)
    .then(() => ok(accessTokenDecoder.verify(token)))
    .catch((error) => err(String(error)))
}
