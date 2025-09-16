import * as Result from "../Result"
import { Maybe } from "../Maybe"
import { Opaque } from "../Opaque"

const fieldKey: unique symbol = Symbol()
/** Captures error with input value
 * It does *NOT* validate until you call *parse*
 * Do your own validation at the Actions!
 */

export type Field<E, V, T> = Opaque<FieldInternal<E, V, T>, typeof fieldKey, V>

export type FieldInternal<E, V, T> = {
  value: V
  parser: ParseDontValidateFn<E, V, T>
  _memo: Maybe<Result.Result<E, T>>
}

export type ParseDontValidateFn<E, V, T> = (s: V) => Result.Result<E, T>

export function init<E, V, T>(
  value: V,
  parser: ParseDontValidateFn<E, V, T>,
): Field<E, V, T> {
  return _create({
    value,
    parser,
    _memo: null,
  })
}

export function parse<E, V, T>(f: Field<E, V, T>): Field<E, V, T> {
  const fi = _internal(f)
  return _create({ ...fi, _memo: fi.parser(fi.value) })
}

export function change<E, V, T>(value: V, f: Field<E, V, T>): Field<E, V, T> {
  const fi = _internal(f)
  return _create({ ...fi, value })
}

export function changeAndParse<E, V, T>(
  value: V,
  f: Field<E, V, T>,
): Field<E, V, T> {
  const fi = _internal(f)
  return parse(_create({ ...fi, value }))
}

export function clearError<E, V, T>(f: Field<E, V, T>): Field<E, V, T> {
  const fi = _internal(f)
  return _create({ ...fi, _memo: null })
}

export function error<E, V, T>(f: Field<E, V, T>): Maybe<E> {
  const fi = _internal(f)
  return fi._memo == null ? null : Result.error(fi._memo)
}

export function value<E, V, T>(f: Field<E, V, T>): Maybe<T> {
  const fi = _internal(f)
  return fi._memo == null ? null : Result.value(fi._memo)
}

function _create<E, V, T>(f: FieldInternal<E, V, T>): Field<E, V, T> {
  return {
    [fieldKey]: f,
    unwrap: function () {
      return this[fieldKey].value
    },
    toJSON: function () {
      return JSON.stringify(this[fieldKey].value)
    },
  }
}

function _internal<E, V, T>(f: Field<E, V, T>): FieldInternal<E, V, T> {
  return f[fieldKey]
}
