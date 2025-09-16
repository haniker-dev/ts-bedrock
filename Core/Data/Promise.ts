import { Result, err } from "./Result"
import { Maybe } from "./Maybe"

/** Retry a promise immediately if it failed **/
export async function retryPromise<A, B>(
  maxRetries: number,
  fn: () => Promise<Result<A, B>>,
): Promise<Result<A, B>> {
  return _retryPromise(maxRetries, 0, null, fn)
}

/** Retry a promise with a delay if it failed **/
export async function retryPromiseWithDelay<A, B>(
  maxRetries: number,
  delayMS: number,
  fn: () => Promise<Result<A, B>>,
): Promise<Result<A, B>> {
  return _retryPromise(maxRetries, delayMS, null, fn)
}

async function _retryPromise<A, B>(
  maxRetries: number,
  delayMS: number,
  lastFailure: Maybe<A>,
  fn: () => Promise<Result<A, B>>,
): Promise<Result<A, B>> {
  if (maxRetries <= 0) {
    return lastFailure == null ? fn() : err(lastFailure)
  }

  const result = await fn()
  if (result._t === "Err") {
    await new Promise((resolve) => setTimeout(resolve, delayMS))
    return _retryPromise(maxRetries - 1, delayMS, result.error, fn)
  } else {
    return result
  }
}
