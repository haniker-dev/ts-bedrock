/** Customised Runtime for React Web */
import React, { JSX } from "react"
import { flushSync } from "react-dom"
import { createRoot } from "react-dom/client"
import * as Runtime from "./Internal"
import type { State } from "../State"
import type { Action, Cmd } from "../Action"
import { EmitFn } from "./Internal"

// Due to cyclic dependencies between Runtime.start and View,
// we have to do this trick to allow View to import emit
// This also resolves Runtime<S> and emit<State>
let runtimeEmit: EmitFn<State> | null = null
export const emit: EmitFn<State> = (action: Action) => {
  if (runtimeEmit != null) {
    runtimeEmit(action)
  } else {
    throw new Error("Emit function is not set yet.")
  }
}

export function startReactRuntime(
  initState: State,
  initCmd: Cmd,
  View: (props: { state: State }) => JSX.Element,
): void {
  const rootElement = document.getElementById("app")
  if (rootElement == null) {
    throw new Error("Cannot find root element")
  }
  const root = createRoot(rootElement)
  function render(state: State): void {
    // React does batch rendering instead of rendering synchronously
    // Hence we force React to render synchronously here on every state update
    flushSync(() => {
      root.render(
        <React.StrictMode>
          <View state={state} />
        </React.StrictMode>,
      )
    })
  }

  runtimeEmit = Runtime.start(initState, initCmd, render)
}
