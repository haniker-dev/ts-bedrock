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
import { Maybe } from "../../../Core/Data/Maybe"
import { Nat, Nat0, natDecoder } from "../../../Core/Data/Number/Nat"

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

export async function listPosts(
  page: Nat,
  pageSize: Nat,
  title: Maybe<Text256>,
): Promise<PostRow[]> {
  let query = db.selectFrom(tableName).selectAll()

  if (title != null) {
    query = query.where("title", "like", `%${title.unwrap()}%`)
  }

  const offset = (page.unwrap() - 1) * pageSize.unwrap()

  return query
    .orderBy("createdAt", "desc")
    .offset(offset)
    .limit(pageSize.unwrap())
    .execute()
    .then(JD.array(postRowDecoder).verify)
    .catch((e) => {
      Logger.error(`#${tableName}.listPosts error ${e}`)
      throw e
    })
}

export async function countPosts(title: Maybe<Text256>): Promise<Nat> {
  let query = db
    .selectFrom(tableName)
    .select((eb) => eb.fn.count("id").as("total"))

  if (title != null) {
    query = query.where("title", "like", `%${title.unwrap()}%`)
  }

  return query
    .executeTakeFirst()
    .then((row) => (row?.total ? natDecoder.verify(row.total) : Nat0))
    .catch((e) => {
      Logger.error(`#${tableName}.countPosts error ${e}`)
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
