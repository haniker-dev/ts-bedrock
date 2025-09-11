import * as JD from "decoders"
import { Timestamp, timestampDecoder } from "../Time/Timestamp"
import { Opaque } from "../Opaque"
import { Text256, text256Decoder } from "../Text"

const key: unique symbol = Symbol()
/** A hashed string that is used to prevent replay attacks
 * Note that the internal value (string) of Nonce is hashed and cannot be recovered
 * Nonce is meant to be compared like password hashing
 *
 * As Nonce is calculated based on the payload,
 * this type wraps the payload together for consistency
 * */
export type Nonce<T> = Opaque<NonceInternal<T>, typeof key>
// This contains all necessary information to construct a nonce hash
// WITHOUT secretKey
type NonceInternal<T> = {
  nonceHash: Text256 // Hashed string
  requestedAt: Timestamp
  payload: T
}

export type NonceParams<T> = {
  /** Shared secretKey between client and server */
  secretKey: string

  /** Allows short-lived nonces */
  requestedAt: Timestamp

  /** Important to make payload different from each request */
  payload: T

  /** Hashing is dependent on platform (eg. NodeJS or Browser)
   * Recommended:
   * - NodeJS: hashFu = (s: string) => crypto.createHash("sha256").update(s).digest().toString("hex")
   */
  hashFn: (nonce: string) => Promise<Text256>
}

export async function createNonce<T>(
  params: NonceParams<T>,
): Promise<Nonce<T>> {
  const nonceHash = await _generateNonceHash(params)
  const nonceInternal = {
    nonceHash,
    requestedAt: params.requestedAt,
    payload: params.payload,
  }
  return _create(nonceInternal)
}

export async function verifyNonce<T>(
  nonce: Nonce<T>,
  secretKey: string,
  hashFn: (nonce: string) => Promise<Text256>,
): Promise<boolean> {
  const nonceInternal = nonce.unwrap()
  const nonceHash = await _generateNonceHash({
    secretKey,
    requestedAt: nonceInternal.requestedAt,
    payload: nonceInternal.payload,
    hashFn,
  })
  return nonceInternal.nonceHash.unwrap() === nonceHash.unwrap()
}

export function payloadNonce<T>(nonce: Nonce<T>): T {
  return nonce.unwrap().payload
}

/**
 * In the frontend, this function should be protected via obfuscation or other means
 * so as to increase reverse-engineering difficulty.
 *
 * In React Native's hermes engine, Javascript code will be compiled into Hermes bytecode.
 * Ref: https://payatu.com/blog/understanding-modifying-hermes-bytecode/
 *
 * In web, we can use https://github.com/javascript-obfuscator/javascript-obfuscator
 */
async function _generateNonceHash<T>(params: NonceParams<T>): Promise<Text256> {
  const { secretKey, requestedAt, payload, hashFn } = params
  const hashedPayload = await hashFn(JSON.stringify(payload))
  const data = `${hashedPayload.unwrap()}|${requestedAt.unwrap()}|${secretKey}`
  return hashFn(data)
}

export function nonceDecoder<T>(
  payloadDecoder: JD.Decoder<T>,
): JD.Decoder<Nonce<T>> {
  return nonceInternalDecoder(payloadDecoder).transform(_create)
}

function nonceInternalDecoder<T>(
  payloadDecoder: JD.Decoder<T>,
): JD.Decoder<NonceInternal<T>> {
  return JD.object({
    nonceHash: text256Decoder,
    requestedAt: timestampDecoder,
    payload: JD.string,
  }).transform((blob) => {
    const payload = payloadDecoder.verify(JSON.parse(blob.payload))
    return {
      nonceHash: blob.nonceHash,
      requestedAt: blob.requestedAt,
      payload,
    }
  })
}

function _create<T>(internal: NonceInternal<T>): Nonce<T> {
  return {
    [key]: internal,
    unwrap: () => internal,
    toJSON: () => ({
      nonceHash: internal.nonceHash.unwrap(),
      requestedAt: internal.requestedAt.toJSON(),
      payload: JSON.stringify(internal.payload),
    }),
  }
}
