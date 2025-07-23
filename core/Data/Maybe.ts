import * as JD from "decoders"
import type { Either } from "./Either"

/** This is just a sugar syntax for T | null
 * but the decoder is better
 * */
export type Maybe<T> = T | null

export function maybe<T>(value: T | null | undefined): Maybe<T> {
  return value == null ? null : value
}

export function fromMaybe<T>(m: Maybe<T>): T | null {
  return m == null ? null : m
}

export function fromEither<E, T>(m: Either<E, T>): T | null {
  return m._t === "Right" ? m.value : null
}

export function mapMaybe<A, B>(m: Maybe<A>, fn: (a: A) => B): Maybe<B> {
  return m == null ? null : fn(m)
}

export function throwIfNull<T>(m: Maybe<T>, errorMsg: string): T {
  if (m == null) {
    throw new Error(errorMsg)
  }

  return m
}

export function maybeDecoder<T>(
  valueDecoder: JD.Decoder<T>,
): JD.Decoder<Maybe<T>> {
  return JD.nullable(valueDecoder)
}

/** Decodes undefined as null */
export function maybeOptionalDecoder<T>(
  valueDecoder: JD.Decoder<T>,
): JD.Decoder<Maybe<T>> {
  return JD.optional(maybeDecoder(valueDecoder)).transform((m) => m ?? null)
}

export function stringMaybeDecoder<T>(
  valueDecoder: JD.Decoder<T>,
): JD.Decoder<Maybe<T>> {
  return JD.string
    .transform((s) => s.toLowerCase())
    .transform((s) => (s === "null" ? null : valueDecoder.verify(s)))
}
