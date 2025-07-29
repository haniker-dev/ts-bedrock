import ENV from "./Env"
import pino from "pino-http"

export const HttpLogger =
  ENV.NODE_ENV === "production"
    ? pino()
    : pino({
        transport: {
          target: "pino-http-print",
          options: {
            all: true,
            colorize: true,
            translateTime: true,
            relativeUrl: true,
          },
        },
      })

const _Logger = HttpLogger.logger

/** Switch this to true to turn on Logger in test **/
const debugTest = false

export function log(s: unknown): void {
  switch (ENV.APP_ENV) {
    case "test":
      return debugTest ? _Logger.info(s) : undefined
    case "development":
      return _Logger.info(s)
    case "staging":
      return _Logger.info(s)
    case "production":
      return _Logger.info(s)
  }
}

export function warn(s: unknown): void {
  switch (ENV.APP_ENV) {
    case "test":
      return debugTest ? _Logger.warn(s) : undefined
    case "development":
      return _Logger.warn(s)
    case "staging":
      return _Logger.warn(s)
    case "production":
      return _Logger.warn(s)
  }
}

export function error(s: unknown): void {
  switch (ENV.APP_ENV) {
    case "test":
      return debugTest ? _Logger.error(s) : undefined
    case "development":
      return _Logger.error(s)
    case "staging":
      return _Logger.error(s)
    case "production":
      return _Logger.error(s)
  }
}

export function fullError(e: Error): void {
  return debugTest ? _Logger.error(fullErrorDetail(e)) : undefined
}

export function fullErrorDetail(e: Error) {
  return {
    name: e.name,
    message: e.message,
    cause: e.cause,
    stack: e.stack?.split("\n"),
  }
}
