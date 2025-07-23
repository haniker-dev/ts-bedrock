import * as JD from "decoders"
import { Either, left, right, fromRight, mapEither } from "./Either"
import { Maybe, throwIfNull } from "./Maybe"
import { Opaque, jsonValueCreate } from "./Opaque"

type Text<T extends symbol> = Opaque<string, T>
export type TextError = "EMPTY_TEXT" | "TEXT_TOO_LONG"

const key3: unique symbol = Symbol()
/** Text3 does not allow empty string */
export type Text3 = Text<typeof key3>
export const {
  create: createText3,
  createE: createText3E,
  decoder: text3Decoder,
} = _createFactory(key3, 3)

const key4: unique symbol = Symbol()
/** Text4 does not allow empty string */
export type Text4 = Text<typeof key4>
export const {
  create: createText4,
  createE: createText4E,
  decoder: text4Decoder,
} = _createFactory(key4, 4)

const key15: unique symbol = Symbol()
/** Text15 does not allow empty string */
export type Text15 = Text<typeof key15>
export const {
  create: createText15,
  createE: createText15E,
  decoder: text15Decoder,
} = _createFactory(key15, 15)

const key20: unique symbol = Symbol()
/** Text20 does not allow empty string */
export type Text20 = Text<typeof key20>
export const {
  create: createText20,
  createE: createText20E,
  decoder: text20Decoder,
} = _createFactory(key20, 20)

const key80: unique symbol = Symbol()
/** Text80 does not allow empty string */
export type Text80 = Text<typeof key80>
export const {
  create: createText80,
  createE: createText80E,
  decoder: text80Decoder,
} = _createFactory(key80, 80)

const key100: unique symbol = Symbol()
/** Text100 does not allow empty string */
export type Text100 = Text<typeof key100>
export const {
  create: createText100,
  createE: createText100E,
  decoder: text100Decoder,
} = _createFactory(key100, 100)

const key120: unique symbol = Symbol()
/** Text120 does not allow empty string */
export type Text120 = Text<typeof key120>
export const {
  create: createText120,
  createE: createText120E,
  decoder: text120Decoder,
} = _createFactory(key120, 120)

const key160: unique symbol = Symbol()
/** Text160 does not allow empty string */
export type Text160 = Text<typeof key160>
export const {
  create: createText160,
  createE: createText160E,
  decoder: text160Decoder,
} = _createFactory(key160, 160)

const key256: unique symbol = Symbol()
/** Text256 does not allow empty string */
export type Text256 = Text<typeof key256>
export const {
  create: createText256,
  createE: createText256E,
  decoder: text256Decoder,
} = _createFactory(key256, 256)

const key512: unique symbol = Symbol()
/** key512 does not allow empty string */
export type Text512 = Text<typeof key512>
export const {
  create: createText512,
  createE: createText512E,
  decoder: text512Decoder,
} = _createFactory(key512, 512)

const key1024: unique symbol = Symbol()
/** Text1024 does not allow empty string */
export type Text1024 = Text<typeof key1024>
export const {
  create: createText1024,
  createE: createText1024E,
  decoder: text1024Decoder,
} = _createFactory(key1024, 1024)

const keyNoLimit: unique symbol = Symbol()
/** TextNoLimit does not allow empty string */
export type TextNoLimit = Text<typeof keyNoLimit>
export function createTextNoLimitE(
  s: string,
): Either<"EMPTY_TEXT", TextNoLimit> {
  return s === ""
    ? left("EMPTY_TEXT")
    : right(jsonValueCreate<string, typeof keyNoLimit>(keyNoLimit)(s))
}
export function createTextNoLimit(s: string): TextNoLimit | null {
  return fromRight(createTextNoLimitE(s))
}
export const textNoLimitDecoder: JD.Decoder<TextNoLimit> = JD.string.transform(
  (s) => throwIfNull(createTextNoLimit(s), "EMPTY_TEXT"),
)

// Internal

type CreateFactorOutput<T extends symbol> = {
  create: (v: string) => Maybe<Text<T>>
  createE: (v: string) => Either<TextError, Text<T>>
  decoder: JD.Decoder<Text<T>>
}
function _createFactory<T extends symbol>(
  key: T,
  textLength: number,
): CreateFactorOutput<T> {
  return {
    create: (s: string) => _create(key, textLength, s),
    createE: (s: string) => _createE(key, textLength, s),
    decoder: _decoder(key, textLength),
  }
}

function _create<T extends symbol>(
  key: T,
  textLength: number,
  s: string,
): Maybe<Text<T>> {
  return fromRight(_createE(key, textLength, s))
}

function _createE<T extends symbol>(
  key: T,
  textLength: number,
  s: string,
): Either<TextError, Text<T>> {
  const validated = _validate(textLength, s)
  return mapEither(validated, jsonValueCreate(key))
}

function _validate(textLength: number, s: string): Either<TextError, string> {
  return s === ""
    ? left("EMPTY_TEXT")
    : textLength > 0 && s.length > textLength
      ? left("TEXT_TOO_LONG")
      : right(s)
}

function _decoder<T extends symbol>(
  key: T,
  textLength: number,
): JD.Decoder<Text<T>> {
  return JD.string.transform((s) => {
    return throwIfNull(
      _create(key, textLength, s),
      `Invalid ${key.toString()}: ${s}`,
    )
  })
}
