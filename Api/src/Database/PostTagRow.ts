import * as JD from "decoders"
import { PostID, postIDDecoder } from "../../../Core/App/PostID"
import { TagName, tagNameDecoder } from "../../../Core/App/TagName"
import db from "../Database"
import * as Logger from "../Logger"

const tableName = "post_tag"

export type PostTagRow = {
  postID: PostID
  tagName: TagName
}

export type CreateParams = {
  postID: PostID
  tagName: TagName
}

export async function create(params: CreateParams): Promise<PostTagRow> {
  const { postID, tagName } = params

  return db
    .insertInto(tableName)
    .values({
      postID: postID.unwrap(),
      tagName: tagName.unwrap(),
    })
    .returningAll()
    .executeTakeFirstOrThrow()
    .then(postTagRowDecoder.verify)
    .catch((e) => {
      Logger.error(`#${tableName}.create error ${e}`)
      throw e
    })
}

export const postTagRowDecoder: JD.Decoder<PostTagRow> = JD.object({
  postID: postIDDecoder,
  tagName: tagNameDecoder,
})
