import * as JD from "decoders"
import { Either, left, right } from "./Either"
import { fromEither, Maybe } from "./Maybe"

/** Annotation type is not exported from decoders package
 * hence, we have to do a sleight of hand to trick it out
 */
export type Annotation = Parameters<typeof JD.formatInline>[0]
export function fromDecodeResult<T>(
  result: JD.DecodeResult<T>,
): Either<Annotation, T> {
  return result.ok ? right(result.value) : left(result.error)
}

export const numberFromStringDecoder: JD.Decoder<number> = JD.string
  .transform(Number)
  .transform(JD.number.verify)

export const stringNumberDecoder: JD.Decoder<number> = JD.either(
  JD.number,
  numberFromStringDecoder,
)

export const dateFromUTCStringDecoder: JD.Decoder<Date> = JD.string
  .transform(Date.parse)
  .transform((d) => new Date(d))

export const booleanFromStringDecoder: JD.Decoder<boolean> =
  JD.string.transform((s) => {
    switch (s) {
      case "true":
        return true
      case "false":
        return false
      default:
        throw new Error(`Invalid boolean string: ${s}`)
    }
  })

/** Decode a base64 string **/
export function decodeBase64(s: string): Maybe<string> {
  return fromEither(decodeBase64E(s))
}

export function decodeBase64E(s: string): Either<unknown, string> {
  try {
    return right(_decodeBase64(s))
  } catch (e) {
    return left(e)
  }
}

/**
 * Convert base64 string to string
 * No function exists in React-Native to do this
 * Adapted from https://github.com/davidchambers/Base64.js/blob/master/base64.js
 **/
function _decodeBase64(input: string): string | never {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
  const str = String(input).replace(/[=]+$/, "")
  if (str.length % 4 === 1) {
    throw new Error(
      "_decodeBase64 failed: The string to be decoded is not correctly encoded.",
    )
  }
  let output = ""
  for (
    // initialize result and counters
    let bc = 0, bs = 0, buffer, idx = 0;
    // get next character
    (buffer = str.charAt(idx++));
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer &&
    ((bs = bc % 4 ? bs * 64 + buffer : buffer),
    // and if not first of each 4 characters,
    // convert the first 8 bits to one ascii character
    bc++ % 4)
      ? (output += String.fromCharCode(255 & (bs >> ((-2 * bc) & 6))))
      : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer)
  }
  return output
}
