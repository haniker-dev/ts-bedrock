import type { Result } from "./Result"
import { err } from "./Result"
import type { Maybe } from "./Maybe"
import type { Millisecond } from "./Time/Millisecond"
import { Millisecond0 } from "./Time/Millisecond"

/** Retry a promise immediately if it failed **/
export async function retryPromise<A, B>(
  maxRetries: number,
  fn: () => Promise<Result<A, B>>,
): Promise<Result<A, B>> {
  return _retryPromise(maxRetries, Millisecond0, null, fn)
}

/** Retry a promise with a delay if it failed **/
export async function retryPromiseWithDelay<A, B>(
  maxRetries: number,
  delay: Millisecond,
  fn: () => Promise<Result<A, B>>,
): Promise<Result<A, B>> {
  return _retryPromise(maxRetries, delay, null, fn)
}

async function _retryPromise<A, B>(
  maxRetries: number,
  delay: Millisecond,
  lastFailure: Maybe<A>,
  fn: () => Promise<Result<A, B>>,
): Promise<Result<A, B>> {
  if (maxRetries <= 0) {
    return lastFailure == null ? fn() : err(lastFailure)
  }

  const result = await fn()
  if (result._t === "Err") {
    await new Promise((resolve) => setTimeout(resolve, delay.unwrap()))
    return _retryPromise(maxRetries - 1, delay, result.error, fn)
  } else {
    return result
  }
}
