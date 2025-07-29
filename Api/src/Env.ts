import * as JD from "decoders"
import { fromDecodeResult, stringNumberDecoder } from "../../Core/Data/Decoder"

export type Env = {
  NODE_ENV: "test" | "development" | "production"
  APP_ENV: "test" | "development" | "staging" | "production"
  APP_PORT: number
  DB_HOST: string
  DB_PORT: number
  DB_USER: string
  DB_PASSWORD: string
  DB_DATABASE: string
  DB_MAX_POOL: number
  JWT_SECRET: string
}

const decoder: JD.Decoder<Env> = JD.object({
  NODE_ENV: JD.oneOf(["test", "development", "production"]),
  APP_ENV: JD.oneOf(["test", "development", "staging", "production"]),
  APP_PORT: stringNumberDecoder,
  DB_HOST: JD.string,
  DB_PORT: stringNumberDecoder,
  DB_USER: JD.string,
  DB_PASSWORD: JD.string,
  DB_DATABASE: JD.string,
  DB_MAX_POOL: stringNumberDecoder,
  JWT_SECRET: JD.string,
})

// Private

// Loads the ENV
// Throws to kill server if it fails
function load(): Env | never {
  const env = {
    NODE_ENV: process.env.NODE_ENV,
    APP_ENV: process.env.APP_ENV,
    APP_PORT: process.env.APP_PORT,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_DATABASE: process.env.DB_DATABASE,
    DB_MAX_POOL: process.env.DB_MAX_POOL,
    JWT_SECRET: process.env.JWT_SECRET,
  }

  const result = fromDecodeResult(decoder.decode(env))
  if (result._t === "Right") {
    return result.value
  } else {
    // Cannot use Logger because of cycle dependencies
    console.error("Env is malformed.")
    throw new Error(JD.formatInline(result.error))
  }
}

export default load()
