import * as JD from "decoders"
import { Maybe } from "./Maybe"

/**
 * A Result is either
 * - Ok meaning the computation succeeded,
 * - or it is an Err meaning that there was some failure.
 */
export type Result<E, T> = ResultErr<E> | ResultOk<T>
export type ResultErr<E> = {
  readonly _t: "Err"
  readonly error: E
}
export type ResultOk<T> = {
  readonly _t: "Ok"
  readonly value: T
}

/** Creates an Ok Result */
export function ok<T>(value: T): ResultOk<T> {
  return { _t: "Ok", value }
}

/** Creates an Err Result */
export function err<E>(error: E): ResultErr<E> {
  return { _t: "Err", error }
}

/** Apply a function on the value if the Result is Ok
 * otherwise no change to the Result
 * */
export function mapOk<E, T1, T2>(
  result: Result<E, T1>,
  fn: (t: T1) => T2,
): Result<E, T2> {
  return result._t === "Ok" ? ok(fn(result.value)) : result
}

/** Apply a function on the error if the Result is Err
 * otherwise no change to the Result
 * */
export function mapErr<E1, E2, T>(
  result: Result<E1, T>,
  fn: (e: E1) => E2,
): Result<E2, T> {
  return result._t === "Err" ? err(fn(result.error)) : result
}

/** Converts a Result to a toMaybe
 * burying the error;
 */
export function toMaybe<E, T>(result: Result<E, T>): Maybe<T> {
  return result._t === "Ok" ? result.value : null
}

/** Returns the value if the Result is Ok else null */
export function value<E, T>(result: Result<E, T>): Maybe<T> {
  return toMaybe(result)
}

/** Returns the error if the Result is Err else null */
export function error<E, T>(result: Result<E, T>): Maybe<E> {
  return result._t === "Err" ? result.error : null
}

/* Type inference for a JD.object({ t: JD.Decoder<T> }) is always { t: T | undefined }
 * hence, we have to do a roundabout way to decode an Result type
 * Ref: https://github.com/nvie/decoders/issues/930
 */
export function resultOkDecoder<T>(
  valueDecoder: JD.Decoder<T>,
): JD.Decoder<ResultOk<T>> {
  return JD.define((blob, ok, err) => {
    const decoded = JD.object({
      _t: JD.constant("Ok"),
      value: valueDecoder,
    }).decode(blob)

    if (decoded.ok === false) {
      return err(decoded.error)
    }

    const valueM = valueDecoder.decode(decoded.value.value)
    if (valueM.ok === false) {
      return err(valueM.error)
    }

    return ok({ _t: "Ok", value: valueM.value })
  })
}

/* Type inference for a JD.object({ t: JD.Decoder<T> }) is always { t: T | undefined }
 * hence, we have to do a roundabout way to decode an Result type
 * Ref: https://github.com/nvie/decoders/issues/930
 */
export function resultErrDecoder<E>(
  errorDecoder: JD.Decoder<E>,
): JD.Decoder<ResultErr<E>> {
  return JD.define((blob, ok, err) => {
    const decoded = JD.object({
      _t: JD.constant("Err"),
      error: errorDecoder,
    }).decode(blob)

    if (decoded.ok === false) {
      return err(decoded.error)
    }

    const errorM = errorDecoder.decode(decoded.value.error)
    if (errorM.ok === false) {
      return err(errorM.error)
    }

    return ok({ _t: "Err", error: errorM.value })
  })
}

export function resultDecoder<E, T>(
  errorDecoder: JD.Decoder<E>,
  valueDecoder: JD.Decoder<T>,
): JD.Decoder<Result<E, T>> {
  return JD.taggedUnion("_t", {
    Ok: resultOkDecoder(valueDecoder),
    Err: resultErrDecoder(errorDecoder),
  })
}
