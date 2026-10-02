import * as JD from "decoders"
import type { Opaque } from "../Opaque"
import { jsonValueCreate } from "../Opaque"
import type { Result } from "../Result"
import { toMaybe, err, mapOk, ok } from "../Result"
import type { Maybe } from "../Maybe"
import { throwIfNull } from "../Maybe"
import type { Nat } from "../Number/Nat"
import type { Millisecond } from "./Millisecond"
import { createMillisecond, fromSecond } from "./Millisecond"
import { secondDecoder } from "./Second"

const key: unique symbol = Symbol()
/** Timestamp is epoch milliseconds */
export type Timestamp = Opaque<number, typeof key>
export type ErrorTimestamp = "NOT_AN_INT" | "NOT_A_TIMESTAMP"

export function createNow(): Timestamp {
  return _create(_now())
}

export function fromDate(date: Date): Timestamp {
  return _create(date.getTime())
}

export function fromMillisecond(value: Millisecond): Maybe<Timestamp> {
  return createTimestamp(value.unwrap())
}

export function toMillisecond(timestamp: Timestamp): Maybe<Millisecond> {
  return createMillisecond(timestamp.unwrap())
}

export function createTimestamp(value: number): Maybe<Timestamp> {
  return toMaybe(createTimestampE(value))
}

export function createTimestampE(n: number): Result<ErrorTimestamp, Timestamp> {
  return mapOk(_validate(n), jsonValueCreate(key))
}

export function afterNow(t: Timestamp): boolean {
  return _now() - t.unwrap() < 0
}

export function beforeNow(t: Timestamp): boolean {
  return t.unwrap() - _now() < 0
}

export function addMillisecond(
  t1: Timestamp,
  duration: Millisecond,
): Timestamp {
  return _create(t1.unwrap() + duration.unwrap())
}

export function isSameDay(a: Timestamp, b: Timestamp): boolean {
  const a_ = toDate(a).toDateString()
  const b_ = toDate(b).toDateString()
  return a_ === b_
}

export function yearAgo(n: Nat): Timestamp {
  const d = new Date()
  d.setFullYear(d.getFullYear() - n.unwrap())
  return fromDate(d)
}

export function yearFromNow(n: Nat): Timestamp {
  const d = new Date()
  d.setFullYear(d.getFullYear() + n.unwrap())
  return fromDate(d)
}

/**Past day is not include today*/
export function isPastDay(day: Timestamp): boolean {
  const day_ = new Date(toDate(day).setHours(0, 0, 0, 0))
  const now = new Date(new Date().setHours(0, 0, 0, 0))

  return day_.getTime() < now.getTime()
}

export function toDate(timestamp: Timestamp): Date {
  return new Date(timestamp.unwrap())
}

export const timestampDecoder: JD.Decoder<Timestamp> = JD.number.transform(
  (n) => {
    return throwIfNull(createTimestamp(n), `Invalid timestamp: ${n}`)
  },
)

export const timestampSecondDecoder: JD.Decoder<Timestamp> =
  secondDecoder.transform((s) => {
    return throwIfNull(
      createTimestamp(fromSecond(s).unwrap()),
      `Invalid timestamp: ${s.unwrap()} seconds`,
    )
  })

export const timestampJSDateDecoder: JD.Decoder<Timestamp> = JD.date.transform(
  (v) => fromDate(v),
)

function _validate(n: number): Result<ErrorTimestamp, number> {
  return Number.isInteger(n) === false
    ? err("NOT_AN_INT")
    : n <= 0
      ? err("NOT_A_TIMESTAMP")
      : ok(n)
}

function _create(epochMillisecond: number): Timestamp {
  return jsonValueCreate<number, typeof key>(key)(Math.floor(epochMillisecond))
}

function _now(): number {
  return Date.now()
}
