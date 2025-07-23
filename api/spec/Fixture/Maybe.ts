import { Maybe, throwIfNull } from "../../../core/Data/Maybe"

export function _notNull<T>(m: Maybe<T>): T {
  return throwIfNull(m, `${m} should not be Nothing`)
}
