import * as ActionRoute from "./Action/Route"
import { emit } from "./Runtime/React"

export function initSubscriptions() {
  window.onpopstate = () => {
    emit(ActionRoute.onUrlChange)
  }
}
