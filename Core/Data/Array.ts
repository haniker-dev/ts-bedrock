import type { Maybe } from "./Maybe"

/** Break an array into its last element and all preceding elements.
 * Function naming from:
 * https://pursuit.purescript.org/packages/purescript-arrays/7.3.0/docs/Data.Array#v:unsnoc
 */
export function unsnoc<T>(xs: T[]): Maybe<{ init: T[]; last: T }> {
  const denseLast = Array.from(xs.slice(-1))
  const [unsnocced] = denseLast.map((last) => ({
    init: xs.slice(0, -1),
    last,
  }))

  return unsnocced ?? null
}

/** Consider using a set if possible */
export function uniqueBy<T, K>(array: T[], compareValue: (item: T) => K): T[] {
  return array.reduce((acc: T[], item) => {
    const value = compareValue(item)
    if (!acc.some((existingItem) => compareValue(existingItem) === value)) {
      acc.push(item)
    }
    return acc
  }, [])
}
