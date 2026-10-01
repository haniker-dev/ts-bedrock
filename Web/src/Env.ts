/// <reference types="vite/client" />
import * as JD from "decoders"

const env = JD.object({
  VITE_APP_ENV: JD.string,
  VITE_API_HOST: JD.string,
})
  .transform((e) => ({ APP_ENV: e.VITE_APP_ENV, API_HOST: e.VITE_API_HOST }))
  .verify(import.meta.env)

export default env
