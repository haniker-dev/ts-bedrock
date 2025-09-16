import * as JD from "decoders"
import { Result, toMaybe, err, mapOk, ok } from "../Result"
import { Maybe, throwIfNull } from "../Maybe"
import { Opaque, jsonValueCreate } from "../Opaque"

type FixedDigit<T extends symbol> = Opaque<string, T>
export type FixedDigitError = "INVALID_FIXED_DIGIT"

const key6: unique symbol = Symbol()
export type FixedDigit6 = FixedDigit<typeof key6>
export const {
  create: createFixedDigit6,
  createE: createFixedDigit6E,
  decoder: fixedDigit6Decoder,
} = _createFactory(key6, 6)

// Internal

type CreateFactorOutput<T extends symbol> = {
  create: (v: string) => Maybe<FixedDigit<T>>
  createE: (v: string) => Result<FixedDigitError, FixedDigit<T>>
  decoder: JD.Decoder<FixedDigit<T>>
}
function _createFactory<T extends symbol>(
  key: T,
  length: number,
): CreateFactorOutput<T> {
  return {
    create: (s: string) => _create(key, length, s),
    createE: (s: string) => _createE(key, length, s),
    decoder: _decoder(key, length),
  }
}

function _create<T extends symbol>(
  key: T,
  length: number,
  s: string,
): Maybe<FixedDigit<T>> {
  return toMaybe(_createE(key, length, s))
}

function _createE<T extends symbol>(
  key: T,
  length: number,
  s: string,
): Result<FixedDigitError, FixedDigit<T>> {
  const validated = _validate(length, s)
  return mapOk(validated, jsonValueCreate(key))
}

function _validate(length: number, s: string): Result<FixedDigitError, string> {
  const regex = new RegExp(`^\\d{${length}}$`)
  return regex.test(s) === false ? err("INVALID_FIXED_DIGIT") : ok(s)
}

function _decoder<T extends symbol>(
  key: T,
  length: number,
): JD.Decoder<FixedDigit<T>> {
  return JD.string.transform((s) => {
    return throwIfNull(
      _create(key, length, s),
      `Invalid ${key.toString()}: ${s}`,
    )
  })
}
