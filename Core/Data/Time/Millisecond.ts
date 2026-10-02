import * as JD from "decoders"
import type { Result } from "../Result"
import { toMaybe, mapOk } from "../Result"
import type { Maybe } from "../Maybe"
import { throwIfNull } from "../Maybe"
import type { Opaque } from "../Opaque"
import { jsonValueCreate } from "../Opaque"
import type { ErrorNat } from "../Number/Nat"
import { createNatE } from "../Number/Nat"
import type { Second } from "./Second"
import type { Minute } from "./Minute"
import type { Hour } from "./Hour"
import type { Day } from "./Day"

const key: unique symbol = Symbol()
export type Millisecond = Opaque<number, typeof key>

export const Millisecond0: Millisecond = _create(0)
export const Millisecond1: Millisecond = _create(1)
export const Millisecond10: Millisecond = _create(10)
export const Millisecond25: Millisecond = _create(25)
export const Millisecond100: Millisecond = _create(100)
export const Millisecond200: Millisecond = _create(200)
export const Millisecond300: Millisecond = _create(300)
export const Millisecond500: Millisecond = _create(500)

const secondInMillisecond = 1000
const minuteInMillisecond = 60 * secondInMillisecond
const hourInMillisecond = 60 * minuteInMillisecond
const dayInMillisecond = 24 * hourInMillisecond

export function createMillisecond(n: number): Maybe<Millisecond> {
  return toMaybe(createMillisecondE(n))
}

export function createMillisecondE(n: number): Result<ErrorNat, Millisecond> {
  return mapOk(createNatE(n), (nat) => _create(nat.unwrap()))
}

export function fromSecond(s: Second): Millisecond {
  return _create(s.unwrap() * secondInMillisecond)
}

export function fromMinute(m: Minute): Millisecond {
  return _create(m.unwrap() * minuteInMillisecond)
}

export function fromHour(h: Hour): Millisecond {
  return _create(h.unwrap() * hourInMillisecond)
}

export function fromDay(d: Day): Millisecond {
  return _create(d.unwrap() * dayInMillisecond)
}

export const millisecondDecoder: JD.Decoder<Millisecond> = JD.number.transform(
  (n) => {
    return throwIfNull(createMillisecond(n), `Invalid millisecond: ${n}`)
  },
)

function _create(n: number): Millisecond {
  return jsonValueCreate<number, typeof key>(key)(n)
}
