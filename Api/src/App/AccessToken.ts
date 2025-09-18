import * as JD from "decoders"
import * as jose from "jose"
import { jwtVerify } from "jose"
import ENV from "../Env"
import { Result, ok, err } from "../../../Core/Data/Result"
import * as Logger from "../Logger"
import { UserID } from "../../../Core/App/User/UserID"
import {
  AccessToken,
  accessTokenDecoder,
} from "../../../Core/App/User/AccessToken"

const jwt_config = {
  // HS256 = HMAC 256-bits which is "fastest"
  // Make sure secret string is at least 256 bit which is 64 characters
  // Ref: https://fusionauth.io/articles/tokens/building-a-secure-jwt
  algorithm: "HS256",
  secret: new TextEncoder().encode(ENV.JWT_SECRET),
  expirationTime: "1 hour",
}

export async function issue(userID: UserID): Promise<AccessToken> {
  // Jose can only sign with JSON object
  const payloadJSON: JD.JSONObject = { userID: userID.unwrap() }
  const signer = new jose.SignJWT(payloadJSON)
    .setProtectedHeader({ alg: jwt_config.algorithm })
    .setExpirationTime(jwt_config.expirationTime)

  return signer
    .sign(jwt_config.secret)
    .then(accessTokenDecoder.verify)
    .catch((error) => {
      Logger.error(`jwt issue error: ${error}`)
      throw `jwt issue error: ${error}`
    })
}

export async function verify(
  token: string,
): Promise<Result<string, AccessToken>> {
  return jwtVerify(token, jwt_config.secret)
    .then(() => ok(accessTokenDecoder.verify(token)))
    .catch((error) => err(String(error)))
}
