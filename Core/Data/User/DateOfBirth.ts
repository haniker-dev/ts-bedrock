import type * as JD from "decoders"
import type { Opaque } from "../Opaque"
import type { Result } from "../Result"
import { err, mapOk, ok, toMaybe } from "../Result"
import type { Maybe } from "../Maybe"
import { throwIfNull } from "../Maybe"
import type { SDate } from "../Time/SDate"
import { afterToday, sdateStringDecoder, toString } from "../Time/SDate"

const key: unique symbol = Symbol()
export type DateOfBirth = Opaque<SDate, typeof key>
export type ErrorDateOfBirth = "FUTURE_DATE_OF_BIRTH"

export function createDateOfBirth(d: SDate): Maybe<DateOfBirth> {
  return toMaybe(createDateOfBirthE(d))
}

export function createDateOfBirthE(
  d: SDate,
): Result<ErrorDateOfBirth, DateOfBirth> {
  return mapOk(_validate(d), _create)
}

export const dateOfBirthStringDecoder: JD.Decoder<DateOfBirth> =
  sdateStringDecoder.transform((d) => {
    return throwIfNull(
      createDateOfBirth(d),
      `Invalid DateOfBirth: ${toString(d)}`,
    )
  })

function _validate(d: SDate): Result<ErrorDateOfBirth, SDate> {
  return afterToday(d) ? err("FUTURE_DATE_OF_BIRTH") : ok(d)
}

function _create(d: SDate): DateOfBirth {
  return {
    [key]: d,
    unwrap: function () {
      return this[key]
    },
    toJSON: function () {
      return this[key].toJSON()
    },
  }
}
