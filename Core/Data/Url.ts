import * as JD from "decoders"
import { Opaque, jsonValueCreate } from "./Opaque"
import { Either, left, right, fromRight, mapEither } from "./Either"
import { Maybe, throwIfNull } from "./Maybe"

const key: unique symbol = Symbol()
export type Url = Opaque<string, typeof key>
export type ErrorWebLink = "INVALID_URL"

export function createWebLink(s: string): Maybe<Url> {
  return fromRight(createWebLinkE(s))
}

export function createWebLinkE(s: string): Either<ErrorWebLink, Url> {
  return mapEither(_validate(s), jsonValueCreate(key))
}

export const webLinkDecoder: JD.Decoder<Url> = JD.string.transform((s) => {
  return throwIfNull(createWebLink(s), `Invalid url: ${s}`)
})

function _validate(s: string): Either<ErrorWebLink, string> {
  try {
    new URL(s)
    return right(s)
  } catch (_e) {
    return left("INVALID_URL")
  }
}
