import * as JD from "decoders"
import type { Opaque } from "../../Data/Opaque"
import { jsonValueCreate } from "../../Data/Opaque"
import type { Result } from "../../Data/Result"
import { toMaybe, err, ok } from "../../Data/Result"
import type { Maybe } from "../../Data/Maybe"
import { throwIfNull } from "../../Data/Maybe"
import { createText100 } from "../../Data/Text"

const key: unique symbol = Symbol()
export type Name = Opaque<string, typeof key>
export type ErrorName = "INVALID_NAME"

export function createName(s: string): Maybe<Name> {
  return toMaybe(createNameE(s))
}

export function createNameE(s: string): Result<ErrorName, Name> {
  const text100 = createText100(s)
  if (text100 == null) return err("INVALID_NAME")

  return ok(jsonValueCreate<string, typeof key>(key)(text100.unwrap()))
}

export const nameDecoder: JD.Decoder<Name> = JD.string.transform((s) => {
  return throwIfNull(createName(s), `Invalid name: ${s}`)
})
