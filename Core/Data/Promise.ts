import type { Result } from "./Result"
import type { Millisecond } from "./Time/Millisecond"
import { Millisecond0 } from "./Time/Millisecond"
import { sleep } from "./Time/Timer"

/** Retry a promise immediately if it failed **/
export async function retryPromise<A, B>(
  maxAttempts: number,
  fn: () => Promise<Result<A, B>>,
): Promise<Result<A, B>> {
  return _retryPromise(maxAttempts, Millisecond0, fn)
}

/** Retry a promise with a delay if it failed **/
export async function retryPromiseWithDelay<A, B>(
  maxAttempts: number,
  delay: Millisecond,
  fn: () => Promise<Result<A, B>>,
): Promise<Result<A, B>> {
  return _retryPromise(maxAttempts, delay, fn)
}

async function _retryPromise<A, B>(
  maxAttempts: number,
  delay: Millisecond,
  fn: () => Promise<Result<A, B>>,
): Promise<Result<A, B>> {
  const result = await fn()
  const isLastAttempt = maxAttempts <= 1
  switch (result._t) {
    case "Ok":
      return result
    case "Err":
      if (isLastAttempt) {
        return result
      }
      await sleep(delay)
      return _retryPromise(maxAttempts - 1, delay, fn)
  }
}
