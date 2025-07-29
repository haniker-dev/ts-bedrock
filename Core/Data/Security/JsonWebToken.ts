import * as JD from "decoders"
import { Opaque } from "../Opaque"
import { diffFromNow, Timestamp, timestampDecoder } from "../Timestamp"
import { Either, left, right } from "../Either"
import { parseJSON } from "../JSON"
import { decodeBase64 } from "../Decoder"
import { Nat } from "../Number/Nat"

const key: unique symbol = Symbol()
/** Json Web Token is a string of this
 * format: `<header>.<payload>.<signature>`
 * separated by period and each part is base64 encoded
 **/
export type JsonWebToken<T> = Opaque<State<T>, typeof key, T>
type State<T> = {
  token: string // the original token
  header: string
  payload: T & Claims
  signature: string
}
/** We only need to claim exp to check for expiry
 * Currently no need for other claims
 * */
type Claims = {
  exp: Timestamp
}
export type ErrorCode = "INVALID_FORMAT" | "INVALID_PAYLOAD"

/** This function only parses the Payload.
 * It does not VERIFY!
 **/
export function parseJWT<T>(
  payloadDecoder: JD.Decoder<T>,
  s: string,
): Either<ErrorCode, JsonWebToken<T>> {
  const parts = s.split(".")
  if (parts.length !== 3) return left("INVALID_FORMAT")

  const header = parts[0]
  const payloadStr = decodeBase64(parts[1])
  const signature = parts[2]
  if (header === "" || payloadStr === null || signature === "") {
    return left("INVALID_FORMAT")
  }

  const payloadM = parseJSON(payloadStr)
  if (payloadM._t === "Left") {
    return left("INVALID_PAYLOAD")
  }
  const payload = payloadM.value

  // Check expiry claims
  // Expired JWT is still a "valid" JWT
  const expM = claimsDecoder.decode(payload)
  if (expM.ok === false) {
    return left("INVALID_PAYLOAD")
  }

  // Decode Payload
  const appPayloadM = payloadDecoder.decode(payload)
  if (appPayloadM.ok === false) {
    return left("INVALID_PAYLOAD")
  }

  const state: State<T> = {
    token: s,
    header,
    payload: {
      ...appPayloadM.value,
      exp: expM.value.exp,
    },
    signature,
  }

  return right({
    [key]: state,
    unwrap: function () {
      return this[key].payload
    },
    /** Returns the original JWT string since JWT should be immutable **/
    toJSON: function () {
      return s
    },
  })
}

export function toString<T>(jwt: JsonWebToken<T>): string {
  return jwt[key].token
}

export function expiringWithin<T>(seconds: Nat, jwt: JsonWebToken<T>): boolean {
  const diff = diffFromNow(getExpiry(jwt))

  // JWT has already expired
  if (diff <= 0) {
    return true
  }

  // Check if JWT is going to expire soon
  return diff < seconds.unwrap()
}

export function getExpiry<T>(jwt: JsonWebToken<T>): Timestamp {
  return jwt[key].payload.exp
}

const claimsDecoder: JD.Decoder<Claims> = JD.object({
  exp: timestampDecoder,
})

export function jsonWebTokenDecoder<T>(
  payloadDecoder: JD.Decoder<T>,
): JD.Decoder<JsonWebToken<T>> {
  return JD.string.transform((s) => {
    const result = parseJWT(payloadDecoder, s)
    if (result._t === "Left") {
      throw new Error(`Invalid JWT: ${result.error}`)
    }

    return result.value
  })
}
