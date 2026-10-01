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
export type Minute = Opaque<number, typeof key>

export const Minute15: Minute = jsonValueCreate<number, typeof key>(key)(15)

export function createMinute(n: number): Maybe<Minute> {
  return toMaybe(createMinuteE(n))
}

export function createMinuteE(n: number): Result<ErrorNat, Minute> {
  return mapOk(createNatE(n), (nat) =>
    jsonValueCreate<number, typeof key>(key)(nat.unwrap()),
  )
}

export const minuteDecoder: JD.Decoder<Minute> = JD.number.transform((n) => {
  return throwIfNull(createMinute(n), `Invalid minute: ${n}`)
})
