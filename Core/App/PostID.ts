import * as JD from "decoders"
import { Opaque, jsonValueCreate } from "../Data/Opaque"
import { UUID, uuidDecoder } from "../Data/UUID"

const key: unique symbol = Symbol()

export type PostID = Opaque<string, typeof key>
export type ErrorPostID = "INVALID_POST_ID"

export function createPostID(uuid: UUID): PostID {
  return jsonValueCreate<string, typeof key>(key)(uuid.unwrap())
}

export const postIDDecoder: JD.Decoder<PostID> = uuidDecoder
  .describe("INVALID_POST_ID")
  .transform((uuid) => {
    return createPostID(uuid)
  })
