/***
 * Runtime of web:
 * This is based on The Elm Architecture except that action is a function to update state
 *
 * Life cycle:
 * First run: [initState, initCmd] -> render base on [initState, initCmd]
 * On each Emit: emit(Action) -> Action(current state) -> [newState, newCmd] -> render base on [newState, newCmd]
 **/

export type Action<S> = (state: S) => [S, Cmd<S>]
export type Cmd<S> = Array<Promise<Action<S> | null>>
export type EmitFn<S> = (a: Action<S>) => void
type RenderFn<S> = (state: S) => void

/**
 * Entry point to start the runtime
 * */
export function start<S>(
  initState: S,
  initCmd: Cmd<S>,
  renderState: RenderFn<S>,
): EmitFn<S> {
  let singletonState: S = initState

  // Creates the emit function that is tied to state S
  // It uses the closure of mutableState in order to maintain a single state
  // Javascript is a single-thread runtime which guarantees us
  // that emit will always run sequentially
  const emit: EmitFn<S> = (action: Action<S>) => {
    const [newState, cmd] = action(singletonState)
    singletonState = newState
    runCmd(emit, cmd)
    renderState(singletonState)
  }

  // First run of the program
  runCmd(emit, initCmd)
  renderState(singletonState)

  // Subsequently, any changes to State is only caused by emit
  // Return the emit function for app to change state
  return emit
}

// Run all Cmd as runaway promises
// so as not to block any rendering
function runCmd<S>(emit: EmitFn<S>, cmd: Cmd<S>): void {
  cmd.forEach((promiseAction) => {
    promiseAction
      .then((action) => {
        return action == null ? null : emit(action)
      })
      .catch((e) => console.error(e))
  })
}
