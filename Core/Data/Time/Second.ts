import * as JD from "decoders"
import type { Result } from "../Result"
import { toMaybe, mapOk } from "../Result"
import type { Maybe } from "../Maybe"
import { throwIfNull } from "../Maybe"
import type { Opaque } from "../Opaque"
import { jsonValueCreate } from "../Opaque"
import type { ErrorNat } from "../Number/Nat"
import { createNatE } from "../Number/Nat"
import type { Minute } from "./Minute"
import type { Hour } from "./Hour"
import type { Day } from "./Day"

const key: unique symbol = Symbol()
export type Second = Opaque<number, typeof key>

export const Second1: Second = _create(1)
export const Second2: Second = _create(2)
export const Second3: Second = _create(3)
export const Second5: Second = _create(5)
export const Second10: Second = _create(10)
export const Second15: Second = _create(15)
export const Second30: Second = _create(30)

const minuteInSecond = 60
const hourInSecond = 60 * minuteInSecond
const dayInSecond = 24 * hourInSecond

export function createSecond(n: number): Maybe<Second> {
  return toMaybe(createSecondE(n))
}

export function createSecondE(n: number): Result<ErrorNat, Second> {
  return mapOk(createNatE(n), (nat) => _create(nat.unwrap()))
}

export function fromMinute(m: Minute): Second {
  return _create(m.unwrap() * minuteInSecond)
}

export function fromHour(h: Hour): Second {
  return _create(h.unwrap() * hourInSecond)
}

export function fromDay(d: Day): Second {
  return _create(d.unwrap() * dayInSecond)
}

export const secondDecoder: JD.Decoder<Second> = JD.number.transform((n) => {
  return throwIfNull(createSecond(n), `Invalid second: ${n}`)
})

function _create(n: number): Second {
  return jsonValueCreate<number, typeof key>(key)(n)
}
