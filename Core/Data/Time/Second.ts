import * as JD from "decoders"
import type { Result } from "../Result"
import { toMaybe, mapOk } from "../Result"
import type { Maybe } from "../Maybe"
import { throwIfNull } from "../Maybe"
import type { Opaque } from "../Opaque"
import { jsonValueCreate } from "../Opaque"
import type { ErrorNat } from "../Number/Nat"
import { createNatE } from "../Number/Nat"

const key: unique symbol = Symbol()
export type Second = Opaque<number, typeof key>

export const Second1: Second = jsonValueCreate<number, typeof key>(key)(1)

export function createSecond(n: number): Maybe<Second> {
  return toMaybe(createSecondE(n))
}

export function createSecondE(n: number): Result<ErrorNat, Second> {
  return mapOk(createNatE(n), (nat) =>
    jsonValueCreate<number, typeof key>(key)(nat.unwrap()),
  )
}

export const secondDecoder: JD.Decoder<Second> = JD.number.transform((n) => {
  return throwIfNull(createSecond(n), `Invalid second: ${n}`)
})
