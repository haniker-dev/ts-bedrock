type AggregateQueueState<T> = {
  running: Promise<T> | null
  resolveFn: () => Promise<T>
}

/** Creates an AggregateQueue which will
 * run the resolveFn *once*
 * and hold all other calls
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
    running: null,
    resolveFn,
  }

  return (): Promise<T> => {
    if (state.running != null) {
      return state.running
    }

    state.running = Promise.resolve()
      .then(state.resolveFn)
      .finally(() => {
        state.running = null
      })
    return state.running
  }
}
