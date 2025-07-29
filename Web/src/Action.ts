import type { State } from "./State"

export type Action = (s: State) => [State, Cmd]
export type Cmd = Array<Promise<Action | null>>

/** Sugar syntax */
export function cmd(...xs: Cmd): Cmd {
  return xs
}

/** Sugar syntax */
export function perform(a: Action): Promise<Action> {
  return Promise.resolve(a)
}

/** Sugar syntax */
export function noAction(): Action {
  return (state) => [state, []]
}
