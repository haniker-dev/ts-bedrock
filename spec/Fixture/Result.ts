import { Result } from "../../Core/Data/Result"

export function _fromOk<E, T>(result: Result<E, T>): T {
  if (result._t === "Ok") return result.value
  throw new Error(JSON.stringify(result.error, null, 2))
}

export function _fromErr<E, T>(result: Result<E, T>): E {
  if (result._t === "Err") return result.error
  throw new Error(
    "Supposed to fail but succeed with: " +
      JSON.stringify(result.value, null, 2),
  )
}
