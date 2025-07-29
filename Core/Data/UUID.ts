import * as JD from "decoders"
import { Either, fromRight, left, mapEither, right } from "./Either"
import { Maybe, throwIfNull } from "./Maybe"
import { Opaque, jsonValueCreate } from "./Opaque"
import { v6, validate, version } from "uuid"

const uuidVersion = 6
const key: unique symbol = Symbol()
export type UUID = Opaque<string, typeof key>
export type ErrorUUID = "INVALID_UUID"

export function createUUID(): UUID {
  return jsonValueCreate<string, typeof key>(key)(v6())
}

export const uuidDecoder: JD.Decoder<UUID> = JD.string.transform((s) => {
  return throwIfNull(_create(s), `Invalid UUID v${uuidVersion}: ${s}`)
})

function _create(s: string): Maybe<UUID> {
  return fromRight(mapEither(_validate(s), jsonValueCreate(key)))
}

function _validate(s: string): Either<ErrorUUID, string> {
  return validate(s) === true && version(s) === uuidVersion
    ? right(s)
    : left("INVALID_UUID")
}
