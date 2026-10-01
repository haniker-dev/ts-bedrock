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

const key: unique symbol = Symbol()
export type Millisecond = Opaque<number, typeof key>

export const Millisecond0: Millisecond = jsonValueCreate<number, typeof key>(
  key,
)(0)

const secondInMillisecond = 1000
const minuteInMillisecond = 60 * secondInMillisecond
const hourInMillisecond = 60 * minuteInMillisecond

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

export const millisecondDecoder: JD.Decoder<Millisecond> = JD.number.transform(
  (n) => {
    return throwIfNull(createMillisecond(n), `Invalid millisecond: ${n}`)
  },
)

function _create(n: number): Millisecond {
  return jsonValueCreate<number, typeof key>(key)(n)
}
