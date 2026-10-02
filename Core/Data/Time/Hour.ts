import * as JD from "decoders"
import type { Result } from "../Result"
import { toMaybe, mapOk } from "../Result"
import type { Maybe } from "../Maybe"
import { throwIfNull } from "../Maybe"
import type { Opaque } from "../Opaque"
import { jsonValueCreate } from "../Opaque"
import type { ErrorNat } from "../Number/Nat"
import { createNatE } from "../Number/Nat"
import type { Day } from "./Day"

const key: unique symbol = Symbol()
export type Hour = Opaque<number, typeof key>

export const Hour1: Hour = _create(1)
export const Hour2: Hour = _create(2)
export const Hour3: Hour = _create(3)
export const Hour6: Hour = _create(6)
export const Hour12: Hour = _create(12)
export const Hour24: Hour = _create(24)

const dayInHour = 24

export function createHour(n: number): Maybe<Hour> {
  return toMaybe(createHourE(n))
}

export function createHourE(n: number): Result<ErrorNat, Hour> {
  return mapOk(createNatE(n), (nat) => _create(nat.unwrap()))
}

export function fromDay(d: Day): Hour {
  return _create(d.unwrap() * dayInHour)
}

export const hourDecoder: JD.Decoder<Hour> = JD.number.transform((n) => {
  return throwIfNull(createHour(n), `Invalid hour: ${n}`)
})

function _create(n: number): Hour {
  return jsonValueCreate<number, typeof key>(key)(n)
}
