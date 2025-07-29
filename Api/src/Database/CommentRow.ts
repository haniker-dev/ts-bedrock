import * as JD from "decoders"
import { CommentID, commentIDDecoder } from "../../../Core/App/CommentID"
import { PostID, postIDDecoder } from "../../../Core/App/PostID"
import { UserID, userIDDecoder } from "../../../Core/App/User/UserID"
import { Text1024, text1024Decoder } from "../../../Core/Data/Text"
import {
  Timestamp,
  timestampDecoderFromDate,
  toDate,
  createNow,
} from "../../../Core/Data/Timestamp"
import db from "../Database"
import * as Logger from "../Logger"

const tableName = "comment"

export type CommentRow = {
  id: CommentID
  postID: PostID
  userID: UserID
  content: Text1024
  createdAt: Timestamp
}

export type CreateParams = {
  postID: PostID
  userID: UserID
  content: Text1024
}

export async function create(params: CreateParams): Promise<CommentRow> {
  const { postID, userID, content } = params
  const now = toDate(createNow())

  return db
    .insertInto(tableName)
    .values({
      postID: postID.unwrap(),
      userID: userID.unwrap(),
      content: content.unwrap(),
      createdAt: now,
    })
    .returningAll()
    .executeTakeFirstOrThrow()
    .then(commentRowDecoder.verify)
    .catch((e) => {
      Logger.error(`#${tableName}.create error ${e}`)
      throw e
    })
}

export const commentRowDecoder: JD.Decoder<CommentRow> = JD.object({
  id: commentIDDecoder,
  postID: postIDDecoder,
  userID: userIDDecoder,
  content: text1024Decoder,
  createdAt: timestampDecoderFromDate,
})
