import * as JD from "decoders"
import { Either, fromRight, left, mapEither, right } from "../Either"
import { Maybe, throwIfNull } from "../Maybe"
import { Opaque, jsonValueCreate } from "../Opaque"

const key: unique symbol = Symbol()
/** PositiveInt does not include 0 */
export type PositiveInt = Opaque<number, typeof key>
export type ErrorPositiveInt = "NOT_AN_INT" | "NOT_A_POSITIVE_INT"

export const PositiveInt1: PositiveInt = jsonValueCreate<number, typeof key>(
  key,
)(1)

export const PositiveInt2: PositiveInt = jsonValueCreate<number, typeof key>(
  key,
)(2)

export const PositiveInt3: PositiveInt = jsonValueCreate<number, typeof key>(
  key,
)(3)

export const PositiveInt10: PositiveInt = jsonValueCreate<number, typeof key>(
  key,
)(10)

export const PositiveInt20: PositiveInt = jsonValueCreate<number, typeof key>(
  key,
)(20)

export const PositiveInt100: PositiveInt = jsonValueCreate<number, typeof key>(
  key,
)(100)

export function createPositiveInt(n: number): Maybe<PositiveInt> {
  return fromRight(createPositiveIntE(n))
}

export function createPositiveIntE(
  n: number,
): Either<ErrorPositiveInt, PositiveInt> {
  return mapEither(_validate(n), jsonValueCreate(key))
}

export const positiveIntDecoder: JD.Decoder<PositiveInt> = JD.number.transform(
  (n) => {
    return throwIfNull(createPositiveInt(n), `Invalid positive int: ${n}`)
  },
)
export const stringPositiveIntDecoder: JD.Decoder<PositiveInt> =
  JD.string.transform((n) => {
    return throwIfNull(
      createPositiveInt(Number(n)),
      `Invalid string positive int: ${n}`,
    )
  })

export function increment(n: PositiveInt): PositiveInt {
  return add(n, PositiveInt1)
}

export function add(n: PositiveInt, i: PositiveInt): PositiveInt {
  return jsonValueCreate<number, typeof key>(key)(n.unwrap() + i.unwrap())
}

function _validate(n: number): Either<ErrorPositiveInt, number> {
  return Number.isInteger(n) === false
    ? left("NOT_AN_INT")
    : n <= 0
      ? left("NOT_A_POSITIVE_INT")
      : right(n)
}
