import { Maybe } from "../Maybe"
import * as Field from "./Field"

export type FieldString<E, T> = Field.Field<E, string, T>

export function init<E, T>(
  value: string,
  parser: Field.ParseDontValidateFn<E, string, T>,
): FieldString<E, T> {
  return Field.init(value, parser)
}

export function parse<E, T>(f: FieldString<E, T>): FieldString<E, T> {
  return Field.parse(f)
}

export function change<E, T>(
  value: string,
  f: FieldString<E, T>,
): FieldString<E, T> {
  return Field.change(value, f)
}

export function changeAndParse<E, T>(
  value: string,
  f: FieldString<E, T>,
): FieldString<E, T> {
  return Field.changeAndParse(value, f)
}

export function clearError<E, T>(f: FieldString<E, T>): FieldString<E, T> {
  return Field.clearError(f)
}

export function error<E, T>(f: FieldString<E, T>): Maybe<E> {
  return Field.error(f)
}

export function value<E, T>(f: FieldString<E, T>): Maybe<T> {
  return Field.value(f)
}
