import * as JD from "decoders"
import { Opaque } from "../Opaque"
import { createAbsoluteNat, Nat } from "./Nat"
import { clamp } from "../Number"

const key: unique symbol = Symbol()

/** Type for Percentage (0% to 100%)
 * Start using this with percent0 and use #add to increment import
 * Clamps all values to between 0 to 100 in Percent
 */
export type Percent = Opaque<number, typeof key>
export type Error = "NOT_AN_INT" | "NOT_A_POSITIVE_INT"

export const Percent0: Percent = _createUnsafe(0)
export const Percent100: Percent = _createUnsafe(100)

/** Clamps all values to between 0 to 100 */
export function add(amount: Nat, percent: Percent): Percent {
  const total = amount.unwrap() + percent.unwrap()
  return _createUnsafe(total > 100 ? 100 : total)
}

/** Clamps all values to between 0 to 100 */
export function fromFraction(n: number): Percent {
  return add(createAbsoluteNat(n * 100), Percent0)
}

export function isPercent100(p: Percent): boolean {
  return p[key] === 100
}

export const percentDecoder: JD.Decoder<Percent> = JD.number.transform((n) => {
  return _createUnsafe(clamp(0, 100, n))
})

function _createUnsafe(n: number): Percent {
  return {
    [key]: n,
    unwrap: function () {
      return this[key]
    },
    toJSON: function () {
      return this[key]
    },
  }
}
