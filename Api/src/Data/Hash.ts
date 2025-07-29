import * as bcrypt from "bcrypt"
import { Maybe } from "../../../Core/Data/Maybe"
import { Opaque, jsonValueCreate } from "../../../Core/Data/Opaque"
import * as Logger from "../Logger"

const key: unique symbol = Symbol()
export type Hash = Opaque<string, typeof key>

export async function issue(s: string): Promise<Maybe<Hash>> {
  const saltRounds = 10 // We use auto-gen salt with saltRounds 10 as recommend
  return bcrypt
    .hash(s, saltRounds)
    .then((hash) => jsonValueCreate<string, typeof key>(key)(hash))
    .catch((error) => {
      Logger.error(`bcrypt issue error: ${error}`)
      return null
    })
}

export async function verify(s: string, hashedS: string): Promise<boolean> {
  return bcrypt.compare(s, hashedS).catch(() => false)
}
