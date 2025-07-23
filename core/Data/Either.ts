import * as JD from "decoders"
import { Maybe } from "./Maybe"

export type Either<E, T> = Left<E> | Right<T>
export type Left<E> = { readonly _t: "Left"; readonly error: E }
export type Right<T> = { readonly _t: "Right"; readonly value: T }

/** Returns a Right value */
export function right<T>(value: T): Right<T> {
  return { _t: "Right", value }
}

/** Returns a Left value */
export function left<E>(error: E): Left<E> {
  return { _t: "Left", error }
}

export function mapEither<E, A, B>(
  either: Either<E, A>,
  fn: (a: A) => B,
): Either<E, B> {
  if (either._t === "Left") {
    return either
  } else {
    return right(fn(either.value))
  }
}

export const mapRight = mapEither

export function mapLeft<E1, E2, A>(
  either: Either<E1, A>,
  fn: (e: E1) => E2,
): Either<E2, A> {
  if (either._t === "Right") {
    return either
  } else {
    return left(fn(either.error))
  }
}

/** Groups a Either[] into lefts and rights */
export function partition<E, T>(
  results: Array<Either<E, T>>,
): { lefts: E[]; rights: T[] } {
  return results.reduce(
    (accum: { lefts: E[]; rights: T[] }, value) => {
      const { lefts, rights } = accum
      if (value._t === "Left") {
        return { lefts: [...lefts, value.error], rights }
      } else {
        return { lefts, rights: [...rights, value.value] }
      }
    },
    { lefts: [], rights: [] },
  )
}

export function fromRight<E, T>(result: Either<E, T>): Maybe<T> {
  return result._t === "Right" ? result.value : null
}

export function fromLeft<E, T>(result: Either<E, T>): Maybe<E> {
  return result._t === "Left" ? result.error : null
}

/** Type inference for a JD.object({ t: JD.Decoder<T> }) is always { t: T | undefined }
 * hence, we have to do a roundabout way to decode an Either type
 * Ref: https://github.com/nvie/decoders/issues/930
 */
export function leftDecoder<E>(
  errorDecoder: JD.Decoder<E>,
): JD.Decoder<Left<E>> {
  return JD.define((blob, ok, err) => {
    const result = JD.object({
      _t: JD.constant("Left"),
      error: JD.unknown,
    }).decode(blob)
    if (result.ok === false) {
      return err(result.error)
    }

    const errorM = errorDecoder.decode(result.value.error)
    if (errorM.ok === false) {
      return err(errorM.error)
    }

    return ok({ _t: "Left", error: errorM.value })
  })
}

/** Type inference for a JD.object({ t: JD.Decoder<T> }) is always { t: T | undefined }
 * hence, we have to do a roundabout way to decode an Either type
 * Ref: https://github.com/nvie/decoders/issues/930
 */
export function rightDecoder<T>(
  valueDecoder: JD.Decoder<T>,
): JD.Decoder<Right<T>> {
  return JD.define((blob, ok, err) => {
    const result = JD.object({
      _t: JD.constant("Right"),
      value: JD.unknown,
    }).decode(blob)
    if (result.ok === false) {
      return err(result.error)
    }

    const valueM = valueDecoder.decode(result.value.value)
    if (valueM.ok === false) {
      return err(valueM.error)
    }

    return ok({ _t: "Right", value: valueM.value })
  })
}

export function eitherDecoder<E, T>(
  errorDecoder: JD.Decoder<E>,
  valueDecoder: JD.Decoder<T>,
): JD.Decoder<Either<E, T>> {
  return JD.select(JD.object({ _t: JD.oneOf(["Left", "Right"]) }), ({ _t }) => {
    switch (_t) {
      case "Left":
        return leftDecoder(errorDecoder)
      case "Right":
        return rightDecoder(valueDecoder)
    }
  })
}
