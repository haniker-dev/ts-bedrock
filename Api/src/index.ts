import type { Express } from "express"
import express from "express"
import cors from "cors"
import { routes } from "./Route"
import { unknownRoute } from "./Api"
import ENV from "./Env"
import { HttpLogger } from "./Logger"

const app: Express = express()
const { APP_PORT, NODE_ENV } = ENV

if (NODE_ENV === "development") {
  // We enable CORS for all requests in NodeJS in development
  // as CORS will be handled externally (eg. by Nginx/API Gateway) in staging/production
  app.use(
    cors({
      origin: "*",
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      preflightContinue: false,
      optionsSuccessStatus: 204,
    }),
  )
}

// Logger agent
app.use(HttpLogger)

// Express answers OPTIONS on a bound path (200 with Allow) only once its
// router runs out of layers, so the catch-all must sit on a parent app
const routesApp: Express = express()
// All API routes are defined in this function
routes(routesApp)
app.use(routesApp)

app.use(unknownRoute)

app.listen(APP_PORT, () => {
  console.info(`⚡️[server]: Server is running at http://localhost:${APP_PORT}`)
})
