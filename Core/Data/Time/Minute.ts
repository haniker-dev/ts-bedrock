import * as JD from "decoders"
import type { Result } from "../Result"
import { toMaybe, mapOk } from "../Result"
import type { Maybe } from "../Maybe"
import { throwIfNull } from "../Maybe"
import type { Opaque } from "../Opaque"
import { jsonValueCreate } from "../Opaque"
import type { ErrorNat } from "../Number/Nat"
import { createNatE } from "../Number/Nat"
import type { Hour } from "./Hour"
import type { Day } from "./Day"

const key: unique symbol = Symbol()
export type Minute = Opaque<number, typeof key>

export const Minute1: Minute = _create(1)
export const Minute2: Minute = _create(2)
export const Minute3: Minute = _create(3)
export const Minute5: Minute = _create(5)
export const Minute10: Minute = _create(10)
export const Minute15: Minute = _create(15)
export const Minute30: Minute = _create(30)
export const Minute45: Minute = _create(45)

const hourInMinute = 60
const dayInMinute = 24 * hourInMinute

export function createMinute(n: number): Maybe<Minute> {
  return toMaybe(createMinuteE(n))
}

export function createMinuteE(n: number): Result<ErrorNat, Minute> {
  return mapOk(createNatE(n), (nat) => _create(nat.unwrap()))
}

export function fromHour(h: Hour): Minute {
  return _create(h.unwrap() * hourInMinute)
}

export function fromDay(d: Day): Minute {
  return _create(d.unwrap() * dayInMinute)
}

export const minuteDecoder: JD.Decoder<Minute> = JD.number.transform((n) => {
  return throwIfNull(createMinute(n), `Invalid minute: ${n}`)
})

function _create(n: number): Minute {
  return jsonValueCreate<number, typeof key>(key)(n)
}
