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
export type Day = Opaque<number, typeof key>

export const Day1: Day = _create(1)
export const Day2: Day = _create(2)
export const Day3: Day = _create(3)
export const Day7: Day = _create(7)
export const Day10: Day = _create(10)
export const Day14: Day = _create(14)
export const Day30: Day = _create(30)
export const Day31: Day = _create(31)
export const Day90: Day = _create(90)

export function createDay(n: number): Maybe<Day> {
  return toMaybe(createDayE(n))
}

export function createDayE(n: number): Result<ErrorNat, Day> {
  return mapOk(createNatE(n), (nat) => _create(nat.unwrap()))
}

export const dayDecoder: JD.Decoder<Day> = JD.number.transform((n) => {
  return throwIfNull(createDay(n), `Invalid day: ${n}`)
})

function _create(n: number): Day {
  return jsonValueCreate<number, typeof key>(key)(n)
}
