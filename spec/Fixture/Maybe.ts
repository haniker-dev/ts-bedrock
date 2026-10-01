import { Maybe, throwIfNull } from "../../Core/Data/Maybe"

export function _notNull<T>(m: Maybe<T>): T {
  return throwIfNull(m, "Maybe should not be Nothing")
}
