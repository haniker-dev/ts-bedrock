import * as JD from "decoders"
import { Opaque, jsonValueCreate } from "./Opaque"
import { Result, err, ok, toMaybe, mapOk } from "./Result"
import { Maybe, throwIfNull } from "./Maybe"

const key: unique symbol = Symbol()
/** Ensure a string conforms to a full URL
 * as per https://developer.mozilla.org/en-US/docs/Web/API/URL_API
 */
export type Url = Opaque<string, typeof key>
export type ErrorWebLink = "INVALID_URL"

export function createWebLink(s: string): Maybe<Url> {
  return toMaybe(createWebLinkE(s))
}

export function createWebLinkE(s: string): Result<ErrorWebLink, Url> {
  return mapOk(_validate(s), jsonValueCreate(key))
}

export const webLinkDecoder: JD.Decoder<Url> = JD.string.transform((s) => {
  return throwIfNull(createWebLink(s), `Invalid url: ${s}`)
})

function _validate(s: string): Result<ErrorWebLink, string> {
  try {
    new URL(s)
    return ok(s)
  } catch (_e) {
    return err("INVALID_URL")
  }
}
