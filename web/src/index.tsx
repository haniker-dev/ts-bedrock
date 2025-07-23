import "normalize.css"
import * as Route from "./Route"
import { startReactRuntime } from "./Runtime/React"
import View from "./View"
import { initSubscriptions } from "./Subscription"
import { initState } from "./State/init"
import { initCmd } from "./Action/init"

const route = Route.parseRoute(window.location.href)
const state = initState(route)
const cmd = initCmd()

// Starts the web runtime
startReactRuntime(state, cmd, View)

// Starts subscriptions
initSubscriptions()
