import * as JD from "decoders"
import type { Opaque } from "../Opaque"
import type { Result } from "../Result"
import { toMaybe, mapErr, mapOk } from "../Result"
import type { Maybe } from "../Maybe"
import { throwIfNull } from "../Maybe"
import type { ErrorNat } from "../Number/Nat"
import type { Millisecond } from "./Millisecond"
import { add, createMillisecondE, fromSecond, sinceEpoch } from "./Millisecond"
import { secondDecoder } from "./Second"

const key: unique symbol = Symbol()
/** Timestamp is epoch milliseconds */
export type Timestamp = Opaque<Millisecond, typeof key, number>
export type ErrorTimestamp = "NOT_AN_INT" | "NOT_A_TIMESTAMP"

export function createNow(): Timestamp {
  return fromMillisecond(sinceEpoch())
}

export function fromDate(date: Date): Maybe<Timestamp> {
  return createTimestamp(date.getTime())
}

export function fromMillisecond(value: Millisecond): Timestamp {
  return {
    [key]: value,
    unwrap: function () {
      return this[key].unwrap()
    },
    toJSON: function () {
      return this[key].unwrap()
    },
  }
}

export function toMillisecond(timestamp: Timestamp): Millisecond {
  return timestamp[key]
}

export function createTimestamp(value: number): Maybe<Timestamp> {
  return toMaybe(createTimestampE(value))
}

export function createTimestampE(n: number): Result<ErrorTimestamp, Timestamp> {
  return mapOk(
    mapErr(createMillisecondE(n), _toErrorTimestamp),
    fromMillisecond,
  )
}

export function afterNow(t: Timestamp): boolean {
  return sinceEpoch().unwrap() - t.unwrap() < 0
}

export function beforeNow(t: Timestamp): boolean {
  return t.unwrap() - sinceEpoch().unwrap() < 0
}

export function addMillisecond(
  t1: Timestamp,
  duration: Millisecond,
): Timestamp {
  return fromMillisecond(add(toMillisecond(t1), duration))
}

export function isSameDay(a: Timestamp, b: Timestamp): boolean {
  const a_ = toDate(a).toDateString()
  const b_ = toDate(b).toDateString()
  return a_ === b_
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
  (v) => throwIfNull(fromDate(v), `Invalid timestamp: ${String(v)}`),
)

function _toErrorTimestamp(e: ErrorNat): ErrorTimestamp {
  switch (e) {
    case "NOT_AN_INT":
      return "NOT_AN_INT"
    case "NOT_A_NAT":
      return "NOT_A_TIMESTAMP"
  }
}
