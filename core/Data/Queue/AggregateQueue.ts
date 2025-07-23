type AggregateQueueState<T> = {
  isResolving: boolean
  queue: Array<(v: T) => void>
  resolveFn: () => Promise<T>
}

/** Creates an AggregateQueue which will
 * run the resolveFn *once*
 * and hold all other calls
 * and finally resolving all calls with the result of resolveFn
 *
 * Example:
 * ```
 * const runThisFnOnce = () => new Promise(resolve => setTimeout(() => resolve("Done"), 1000))
 * const runQueue = create(runThisFnOnce)
 * const allResults = await Promise.all([ runQueue(), runQueue(), runQueue() ])
 * console.log(allResults) // [ "Done", "Done", "Done" ]
 * ```
 * **/
export function create<T>(resolveFn: () => Promise<T>) {
  // A mutatable state
  const state: AggregateQueueState<T> = {
    isResolving: false,
    queue: [],
    resolveFn,
  }

  return async (): Promise<T> => {
    if (state.isResolving === true) {
      // It is already resolving... just queue it up
      return new Promise((resolve) => state.queue.push(resolve))
    }

    // Start the resolveFn
    state.isResolving = true
    const value = await state.resolveFn()
    state.queue.forEach((resolve) => resolve(value))
    state.queue = []
    state.isResolving = false
    return value
  }
}
