import * as JD from "decoders"
import { Opaque } from "../Opaque"
import { Either, fromRight, left, right } from "../Either"
import { Maybe, throwIfNull } from "../Maybe"
import { parse } from "date-fns"
import { Nat, natDecoder } from "../Number/Nat"
import { fromDate, Timestamp } from "../Timestamp"

const key: unique symbol = Symbol()
/** Represents a date of birth
 * Internally it cannot be a JS Date
 * as JS Date include timezone which causes issue with different timezone
 **/
export type DateOfBirth = Opaque<Internal, typeof key>
type Internal = {
  year: Nat
  month: Month
  day: Day
}
export type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
export type Day =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23
  | 24
  | 25
  | 26
  | 27
  | 28
  | 29
  | 30
  | 31
export type ErrorCode = "INVALID_DATE_OF_BIRTH"

/** WARN JS Date is adjusted for timezone
 * and it is different in different environments such as API or web or mobile
 * In this function, we will take the year/month/day according to *local time*
 */
export function fromJsDateLocal(d: Date): Maybe<DateOfBirth> {
  const year = d.getFullYear()
  const month = d.getMonth() + 1 // January is 0
  const day = d.getDate()

  return dateOfBirthDecoder.value(_toString(year, month, day)) || null
}

export function toJsDateLocal(dob: DateOfBirth): Date {
  const { year, month, day } = dob.unwrap()
  const date = new Date()
  date.setFullYear(year.unwrap(), month - 1, day)
  return date
}

export function toTimestamp(dob: DateOfBirth): Timestamp {
  return fromDate(toJsDateLocal(dob))
}

export function createDateOfBirth(
  year: Nat,
  month: Month,
  day: Day,
): Maybe<DateOfBirth> {
  return fromRight(createDateOfBirthE(year, month, day))
}

export function createDateOfBirthE(
  year: Nat,
  month: Month,
  day: Day,
): Either<ErrorCode, DateOfBirth> {
  const internal = { year, month, day }
  const jsDateE = _validate(internal)
  if (jsDateE._t === "Left") {
    return jsDateE
  }

  return right({
    [key]: internal,
    unwrap: function () {
      return this[key]
    },
    toJSON: function () {
      // This is for backward compatibility
      return toString(this) + "T00:00:00Z"
    },
  })
}

/** NOTE this is the string the decoder is expecting eg. 1981-01-27 */
export function toString(d: DateOfBirth): string {
  const { year, month, day } = d.unwrap()
  return _toString(year.unwrap(), month, day)
}

function _toString(year: number, month: number, day: number): string {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`
}

function _validate(internal: Internal): Either<ErrorCode, Internal> {
  const { year, month, day } = internal

  try {
    // date-fns.parse checks for invalid date such as 2024-02-31
    // This is timezone-safe as the JSDate is not leaked out
    const jsDate = parse(
      _toString(year.unwrap(), month, day),
      "yyyy-MM-dd",
      new Date(),
    )

    // WARN parseISO always return a Date even if it is invalid
    if (String(jsDate) === "Invalid Date") {
      return left("INVALID_DATE_OF_BIRTH")
    }

    return jsDate > new Date() ? left("INVALID_DATE_OF_BIRTH") : right(internal)
  } catch (_e) {
    return left("INVALID_DATE_OF_BIRTH")
  }
}

export const dateOfBirthDecoder: JD.Decoder<DateOfBirth> = JD.string.transform(
  (s) => {
    const [yyyymmdd] = s.split("T") // to allow ISO string eg. 1981-01-27T23:59:59Z
    const [yearM, monthM, dayM] = yyyymmdd.split("-")
    const year = natDecoder.verify(parseInt(yearM))
    const month = monthDecoder.verify(monthM)
    const day = dayDecoder.verify(dayM)
    return throwIfNull(
      createDateOfBirth(year, month, day),
      `Invalid DateOfBirth: ${s}`,
    )
  },
)

export const monthDecoder: JD.Decoder<Month> = JD.string.transform((s) => {
  switch (s) {
    case "01":
      return 1
    case "02":
      return 2
    case "03":
      return 3
    case "04":
      return 4
    case "05":
      return 5
    case "06":
      return 6
    case "07":
      return 7
    case "08":
      return 8
    case "09":
      return 9
    case "10":
      return 10
    case "11":
      return 11
    case "12":
      return 12
  }

  throw new Error(`Invalid month: ${s}`)
})

export const dayDecoder: JD.Decoder<Day> = JD.string.transform((s) => {
  switch (s) {
    case "01":
      return 1
    case "02":
      return 2
    case "03":
      return 3
    case "04":
      return 4
    case "05":
      return 5
    case "06":
      return 6
    case "07":
      return 7
    case "08":
      return 8
    case "09":
      return 9
    case "10":
      return 10
    case "11":
      return 11
    case "12":
      return 12
    case "13":
      return 13
    case "14":
      return 14
    case "15":
      return 15
    case "16":
      return 16
    case "17":
      return 17
    case "18":
      return 18
    case "19":
      return 19
    case "20":
      return 20
    case "21":
      return 21
    case "22":
      return 22
    case "23":
      return 23
    case "24":
      return 24
    case "25":
      return 25
    case "26":
      return 26
    case "27":
      return 27
    case "28":
      return 28
    case "29":
      return 29
    case "30":
      return 30
    case "31":
      return 31
  }

  throw new Error(`Invalid day: ${s}`)
})
