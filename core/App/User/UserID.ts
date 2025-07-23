import * as JD from "decoders"
import { jsonValueCreate, Opaque } from "../../Data/Opaque"
import { createUUID, UUID, uuidDecoder } from "../../Data/UUID"

const key: unique symbol = Symbol()
export type UserID = Opaque<string, typeof key>
export type ErrorUserID = "INVALID_USER_ID"

export function createUserID(): UserID {
  return _create(createUUID())
}

export const userIDDecoder: JD.Decoder<UserID> = uuidDecoder
  .describe("INVALID_USER_ID")
  .transform(_create)

// Purposely receive UUID to express UserID is UUID
function _create(uuid: UUID): UserID {
  return jsonValueCreate<string, typeof key>(key)(uuid.unwrap())
}
