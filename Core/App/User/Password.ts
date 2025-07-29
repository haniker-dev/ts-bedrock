import * as JD from "decoders"
import { Opaque, jsonValueCreate } from "../../Data/Opaque"
import { Either, left, right, fromRight, mapEither } from "../../Data/Either"
import { Maybe, throwIfNull } from "../../Data/Maybe"

const key: unique symbol = Symbol()

/** NOTE: Adjust the logic to fit your project requirements */
export type Password = Opaque<string, typeof key>
export type ErrorPassword =
  | "INVALID_LENGTH"
  | "MISSING_NUMBER"
  | "MISSING_SYMBOL"
  | "CONTAINS_SPACE"

export function createPassword(s: string): Maybe<Password> {
  return fromRight(createPasswordE(s))
}

export function createPasswordE(s: string): Either<ErrorPassword, Password> {
  const validated = _validate(s)
  return mapEither(validated, jsonValueCreate(key))
}

export const passwordDecoder: JD.Decoder<Password> = JD.string.transform(
  (s) => {
    return throwIfNull(createPassword(s), `Invalid password: ${s}`)
  },
)

const symbolRegex = /[^a-zA-Z0-9]/
const numberRegex = /\d/
const noSpaceRegex = /^\S*$/
/** Password must be at least 8 chars with no spaces and include 1 symbol and 1 number */

export function passwordErrors(s: string): Array<ErrorPassword> {
  const errors: Array<ErrorPassword> = []
  if (s.length < 8) {
    errors.push("INVALID_LENGTH")
  }
  if (numberRegex.test(s) === false) {
    errors.push("MISSING_NUMBER")
  }
  if (symbolRegex.test(s) === false) {
    errors.push("MISSING_SYMBOL")
  }
  if (noSpaceRegex.test(s) === false) {
    errors.push("CONTAINS_SPACE")
  }
  return errors
}

function _validate(s: string): Either<ErrorPassword, string> {
  if (s.length < 8) return left("INVALID_LENGTH")
  if (numberRegex.test(s) === false) return left("MISSING_NUMBER")
  if (symbolRegex.test(s) === false) return left("MISSING_SYMBOL")
  if (noSpaceRegex.test(s) === false) return left("CONTAINS_SPACE")
  return right(s)
}

export function passwordErrorString(error: ErrorPassword): string {
  switch (error) {
    case "INVALID_LENGTH":
      return "Minimum 8 characters"
    case "MISSING_NUMBER":
      return "At least 1 number"
    case "MISSING_SYMBOL":
      return "At least 1 symbol"
    case "CONTAINS_SPACE":
      return "Not contains space"
  }
}
