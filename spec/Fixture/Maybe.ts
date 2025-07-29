import { Maybe, throwIfNull } from "../../Core/Data/Maybe"

export function _notNull<T>(m: Maybe<T>): T {
  return throwIfNull(m, `${m} should not be Nothing`)
}
