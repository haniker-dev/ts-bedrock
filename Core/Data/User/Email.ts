import * as JD from "decoders"
import { Opaque, jsonValueCreate } from "../Opaque"
import { err, mapOk, ok, Result, toMaybe } from "../Result"
import { Maybe, throwIfNull } from "../Maybe"

const key: unique symbol = Symbol()
/** Max email length is 320 as per RFC 5321 and RFC 5322
 *Regex taken from https://emailregex.com/ */
export type Email = Opaque<string, typeof key>
export type ErrorEmail = "INVALID_EMAIL"

export function createEmail(s: string): Maybe<Email> {
  return toMaybe(createEmailE(s))
}

export function createEmailE(s: string): Result<ErrorEmail, Email> {
  return mapOk(_validate(s), jsonValueCreate(key))
}

export const emailDecoder: JD.Decoder<Email> = JD.string.transform((s) => {
  return throwIfNull(createEmail(s), `Invalid email: ${s}`)
})

function _validate(s: string): Result<ErrorEmail, string> {
  // The almost perfect email regex, taken from https://emailregex.com/
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  const v = s.trim().toLowerCase()
  return v.length <= 320 && emailRegex.test(v) ? ok(v) : err("INVALID_EMAIL")
}
