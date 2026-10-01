import * as JD from "decoders"
import type { Opaque } from "../Opaque"
import type { Timestamp } from "../Time/Timestamp"
import { addMillisecond, createNow, timestampDecoder } from "../Time/Timestamp"
import type { Millisecond } from "../Time/Millisecond"
import type { Result } from "../Result"
import { err, ok } from "../Result"
import { parseJSON } from "../JSON"
import { decodeBase64 } from "../Decoder"

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
): Result<ErrorCode, JsonWebToken<T>> {
  const [header, payloadBase64, signature, ...extraParts] = s.split(".")
  if (
    header == null ||
    payloadBase64 == null ||
    signature == null ||
    extraParts.length > 0
  ) {
    return err("INVALID_FORMAT")
  }

  const payloadStr = decodeBase64(payloadBase64)
  if (header === "" || payloadStr === null || signature === "") {
    return err("INVALID_FORMAT")
  }

  const payloadM = parseJSON(payloadStr)
  if (payloadM._t === "Err") {
    return err("INVALID_PAYLOAD")
  }
  const payload = payloadM.value

  // Check expiry claims
  // Expired JWT is still a "valid" JWT
  const expM = claimsDecoder.decode(payload)
  if (expM.ok === false) {
    return err("INVALID_PAYLOAD")
  }

  // Decode Payload
  const appPayloadM = payloadDecoder.decode(payload)
  if (appPayloadM.ok === false) {
    return err("INVALID_PAYLOAD")
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

  return ok({
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

export function expiringWithin<T>(
  within: Millisecond,
  jwt: JsonWebToken<T>,
): boolean {
  const windowEnd = addMillisecond(createNow(), within)
  return getExpiry(jwt).unwrap() < windowEnd.unwrap()
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
    if (result._t === "Err") {
      throw new Error(`Invalid JWT: ${result.error}`)
    }

    return result.value
  })
}
