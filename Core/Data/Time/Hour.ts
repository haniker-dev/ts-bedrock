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
export type Hour = Opaque<number, typeof key>

export const Hour1: Hour = jsonValueCreate<number, typeof key>(key)(1)
export const Hour2160: Hour = jsonValueCreate<number, typeof key>(key)(2160)

export function createHour(n: number): Maybe<Hour> {
  return toMaybe(createHourE(n))
}

export function createHourE(n: number): Result<ErrorNat, Hour> {
  return mapOk(createNatE(n), (nat) =>
    jsonValueCreate<number, typeof key>(key)(nat.unwrap()),
  )
}

export const hourDecoder: JD.Decoder<Hour> = JD.number.transform((n) => {
  return throwIfNull(createHour(n), `Invalid hour: ${n}`)
})
