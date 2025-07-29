import ENV from "./Env"

export function log(s: unknown): void {
  if (ENV.APP_ENV !== "test") {
    return console.info(s)
  }
}

export function error(s: unknown): void {
  if (ENV.APP_ENV !== "test") {
    return console.error(s)
  }
}

export function fullError(e: Error) {
  return console.error(fullErrorDetail(e))
}

export function fullErrorDetail(e: Error) {
  return {
    name: e.name,
    message: e.message,
    cause: e.cause,
    stack: e.stack?.split("\n"),
  }
}
