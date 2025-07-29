import * as JD from "decoders"
import { createPostID, PostID, postIDDecoder } from "../../../Core/App/PostID"
import {
  Text256,
  text256Decoder,
  TextNoLimit,
  textNoLimitDecoder,
} from "../../../Core/Data/Text"
import {
  Timestamp,
  timestampDecoderFromDate,
  toDate,
  createNow,
} from "../../../Core/Data/Timestamp"
import db from "../Database"
import * as Logger from "../Logger"
import { createUUID } from "../../../Core/Data/UUID"

const tableName = "post"

export type PostRow = {
  id: PostID
  title: Text256
  content: TextNoLimit
  createdAt: Timestamp
  updatedAt: Timestamp
}

export type CreateParams = {
  title: Text256
  content: TextNoLimit
}

export async function create(params: CreateParams): Promise<PostRow> {
  const { title, content } = params
  const now = toDate(createNow())

  return db
    .insertInto(tableName)
    .values({
      id: createPostID(createUUID()).unwrap(),
      title: title.unwrap(),
      content: content.unwrap(),
      createdAt: now,
      updatedAt: now,
    })
    .returningAll()
    .executeTakeFirstOrThrow()
    .then(postRowDecoder.verify)
    .catch((e) => {
      Logger.error(`#${tableName}.create error ${e}`)
      throw e
    })
}

export const postRowDecoder: JD.Decoder<PostRow> = JD.object({
  id: postIDDecoder,
  title: text256Decoder,
  content: textNoLimitDecoder,
  createdAt: timestampDecoderFromDate,
  updatedAt: timestampDecoderFromDate,
})
